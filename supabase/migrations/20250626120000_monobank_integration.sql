-- FinFlex + Monobank integration schema
-- Run in Supabase SQL Editor or via: supabase db push
--
-- Monobank amounts are stored in minor units (kopiyky for UAH), matching the API.
-- Currency codes use ISO 4217 numeric values (980 = UAH, 840 = USD, 978 = EUR).

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Profiles (extends auth.users)
-- ---------------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  monobank_client_id text,
  monobank_client_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is 'App profile linked to Supabase Auth user.';

-- ---------------------------------------------------------------------------
-- Monobank connection (personal X-Token)
-- Store token only via server/service role; never expose to the browser.
-- ---------------------------------------------------------------------------

create table public.monobank_integrations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles (id) on delete cascade,
  access_token text not null,
  webhook_url text,
  permissions text,
  is_active boolean not null default true,
  last_client_info_sync_at timestamptz,
  last_statement_sync_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.monobank_integrations is
  'Per-user Monobank personal API token and sync metadata. access_token must be written/read with service role only.';

create index monobank_integrations_user_id_idx
  on public.monobank_integrations (user_id);

-- ---------------------------------------------------------------------------
-- Accounts from GET /personal/client-info -> accounts[]
-- Powers: Total balance, Credit card widget, Cards page, payment methods
-- ---------------------------------------------------------------------------

create table public.monobank_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  monobank_account_id text not null,
  send_id text,
  balance bigint not null default 0,
  credit_limit bigint not null default 0,
  currency_code integer not null default 980,
  cashback_type text,
  account_type text not null,
  masked_pan text[] not null default '{}',
  iban text,
  is_default boolean not null default false,
  is_visible boolean not null default true,
  synced_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint monobank_accounts_user_account_unique unique (user_id, monobank_account_id)
);

comment on column public.monobank_accounts.balance is 'Balance in minor currency units (Monobank API format).';
comment on column public.monobank_accounts.account_type is 'Monobank type: black, white, platinum, iron, fop, yellow, eAid, madeInUkraine, etc.';

create index monobank_accounts_user_id_idx on public.monobank_accounts (user_id);
create index monobank_accounts_user_visible_idx on public.monobank_accounts (user_id, is_visible);

-- ---------------------------------------------------------------------------
-- Jars from GET /personal/client-info -> jars[]
-- Powers: Plan page savings goals (title, balance, goal, progress)
-- ---------------------------------------------------------------------------

create table public.monobank_jars (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  monobank_jar_id text not null,
  send_id text,
  title text not null,
  description text,
  currency_code integer not null default 980,
  balance bigint not null default 0,
  goal bigint not null default 0,
  synced_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint monobank_jars_user_jar_unique unique (user_id, monobank_jar_id)
);

comment on column public.monobank_jars.goal is 'Target amount in minor currency units.';

create index monobank_jars_user_id_idx on public.monobank_jars (user_id);

-- ---------------------------------------------------------------------------
-- Transactions from GET /personal/statement/{account}/{from}/{to}
-- and webhook StatementItem events
-- Powers: Transaction history, Analytics, income/expense widgets, top spending
-- ---------------------------------------------------------------------------

create table public.monobank_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  monobank_account_id text not null,
  monobank_transaction_id text not null,
  transaction_time timestamptz not null,
  description text not null,
  mcc integer,
  original_mcc integer,
  is_hold boolean not null default false,
  amount bigint not null,
  operation_amount bigint,
  currency_code integer not null default 980,
  commission_rate bigint not null default 0,
  cashback_amount bigint not null default 0,
  balance_after bigint,
  comment text,
  receipt_id text,
  invoice_id text,
  counter_edrpou text,
  counter_iban text,
  counter_name text,
  spending_category_id uuid,
  synced_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint monobank_transactions_user_tx_unique unique (user_id, monobank_transaction_id),
  constraint monobank_transactions_account_fk
    foreign key (user_id, monobank_account_id)
    references public.monobank_accounts (user_id, monobank_account_id)
    on delete cascade
);

comment on column public.monobank_transactions.amount is
  'Signed amount in account currency minor units. Negative = expense, positive = income.';

create index monobank_transactions_user_time_idx
  on public.monobank_transactions (user_id, transaction_time desc);

create index monobank_transactions_user_account_time_idx
  on public.monobank_transactions (user_id, monobank_account_id, transaction_time desc);

create index monobank_transactions_user_mcc_idx
  on public.monobank_transactions (user_id, mcc);

create index monobank_transactions_user_hold_idx
  on public.monobank_transactions (user_id, is_hold);

-- ---------------------------------------------------------------------------
-- MCC -> UI spending categories (design: Auto & Transport, Food, Clothes, Other)
-- ---------------------------------------------------------------------------

create table public.spending_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  label text not null,
  color_hex text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.mcc_category_mappings (
  id uuid primary key default gen_random_uuid(),
  mcc integer not null unique,
  spending_category_id uuid not null references public.spending_categories (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.monobank_transactions
  add constraint monobank_transactions_spending_category_fk
  foreign key (spending_category_id)
  references public.spending_categories (id)
  on delete set null;

-- ---------------------------------------------------------------------------
-- Sync audit log (rate limits: client-info & statement max 1 req / 60s)
-- ---------------------------------------------------------------------------

create table public.monobank_sync_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  sync_type text not null check (sync_type in ('client_info', 'statement', 'webhook')),
  monobank_account_id text,
  status text not null check (status in ('started', 'success', 'error')),
  records_synced integer not null default 0,
  error_message text,
  started_at timestamptz not null default now(),
  finished_at timestamptz
);

create index monobank_sync_logs_user_started_idx
  on public.monobank_sync_logs (user_id, started_at desc);

-- ---------------------------------------------------------------------------
-- Seed spending categories aligned with design3.png / mock-data.ts
-- ---------------------------------------------------------------------------

insert into public.spending_categories (slug, label, color_hex, sort_order)
values
  ('auto_transport', 'Auto & Transport', '#00bdf9', 1),
  ('food', 'Food', '#e6ff4b', 2),
  ('clothes', 'Clothes', '#24d79f', 3),
  ('other', 'Other', '#e7e7e7', 99);

-- Common MCC mappings (extend as needed)
insert into public.mcc_category_mappings (mcc, spending_category_id)
select mcc, sc.id
from (
  values
    -- Food & dining
    (5411), (5412), (5812), (5814), (5499),
    -- Auto & transport
    (4111), (4121), (4131), (4789), (5541), (5542), (7523),
    -- Clothes & retail
    (5611), (5621), (5631), (5651), (5691), (5699), (5944)
) as m (mcc)
cross join lateral (
  select id from public.spending_categories
  where slug = case
    when m.mcc in (5411, 5412, 5812, 5814, 5499) then 'food'
    when m.mcc in (4111, 4121, 4131, 4789, 5541, 5542, 7523) then 'auto_transport'
    when m.mcc in (5611, 5621, 5631, 5651, 5691, 5699, 5944) then 'clothes'
    else 'other'
  end
) sc;

-- ---------------------------------------------------------------------------
-- updated_at trigger
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger monobank_integrations_set_updated_at
  before update on public.monobank_integrations
  for each row execute function public.set_updated_at();

create trigger monobank_accounts_set_updated_at
  before update on public.monobank_accounts
  for each row execute function public.set_updated_at();

create trigger monobank_jars_set_updated_at
  before update on public.monobank_jars
  for each row execute function public.set_updated_at();

create trigger monobank_transactions_set_updated_at
  before update on public.monobank_transactions
  for each row execute function public.set_updated_at();

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.email)
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Resolve spending category from MCC on insert/update
create or replace function public.resolve_transaction_spending_category()
returns trigger
language plpgsql
as $$
begin
  if new.mcc is not null then
    select mcm.spending_category_id
    into new.spending_category_id
    from public.mcc_category_mappings mcm
    where mcm.mcc = new.mcc;
  end if;

  if new.spending_category_id is null then
    select id
    into new.spending_category_id
    from public.spending_categories
    where slug = 'other';
  end if;

  return new;
end;
$$;

create trigger monobank_transactions_resolve_category
  before insert or update of mcc on public.monobank_transactions
  for each row execute function public.resolve_transaction_spending_category();

-- ---------------------------------------------------------------------------
-- Dashboard helper views (replace mock-data.ts aggregations)
-- ---------------------------------------------------------------------------

create or replace view public.v_user_account_balances
with (security_invoker = true) as
select
  user_id,
  sum(balance) filter (where currency_code = 980) as total_balance_minor,
  count(*) filter (where is_visible) as visible_accounts_count
from public.monobank_accounts
group by user_id;

create or replace view public.v_user_monthly_cashflow
with (security_invoker = true) as
select
  user_id,
  date_trunc('month', transaction_time at time zone 'UTC') as month_start,
  sum(amount) filter (where amount > 0 and not is_hold) as income_minor,
  sum(abs(amount)) filter (where amount < 0 and not is_hold) as expense_minor
from public.monobank_transactions
group by user_id, date_trunc('month', transaction_time at time zone 'UTC');

create or replace view public.v_user_spending_by_category
with (security_invoker = true) as
select
  t.user_id,
  date_trunc('month', t.transaction_time at time zone 'UTC') as month_start,
  sc.slug as category_slug,
  sc.label as category_label,
  sc.color_hex,
  sum(abs(t.amount)) as spent_minor,
  count(*) as transaction_count
from public.monobank_transactions t
join public.spending_categories sc on sc.id = t.spending_category_id
where t.amount < 0 and not t.is_hold
group by
  t.user_id,
  date_trunc('month', t.transaction_time at time zone 'UTC'),
  sc.slug,
  sc.label,
  sc.color_hex;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.monobank_integrations enable row level security;
alter table public.monobank_accounts enable row level security;
alter table public.monobank_jars enable row level security;
alter table public.monobank_transactions enable row level security;
alter table public.spending_categories enable row level security;
alter table public.mcc_category_mappings enable row level security;
alter table public.monobank_sync_logs enable row level security;

-- profiles
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- monobank_integrations: no client policies (service role only for token CRUD)
create policy "Users can view own integration metadata"
  on public.monobank_integrations for select
  using (auth.uid() = user_id);

-- monobank_accounts
create policy "Users can view own accounts"
  on public.monobank_accounts for select
  using (auth.uid() = user_id);

create policy "Users can update own account visibility"
  on public.monobank_accounts for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- monobank_jars
create policy "Users can view own jars"
  on public.monobank_jars for select
  using (auth.uid() = user_id);

-- monobank_transactions
create policy "Users can view own transactions"
  on public.monobank_transactions for select
  using (auth.uid() = user_id);

-- reference tables readable by authenticated users
create policy "Authenticated users can read spending categories"
  on public.spending_categories for select
  to authenticated
  using (true);

create policy "Authenticated users can read mcc mappings"
  on public.mcc_category_mappings for select
  to authenticated
  using (true);

-- sync logs
create policy "Users can view own sync logs"
  on public.monobank_sync_logs for select
  using (auth.uid() = user_id);
