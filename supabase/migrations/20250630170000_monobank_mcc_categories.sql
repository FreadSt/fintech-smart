-- Expand Monobank transaction categories from design mock groups to MCC-based groups.

begin;

insert into public.spending_categories (slug, label, color_hex, sort_order)
values
  ('groceries', 'Groceries', '#6ee7b7', 10),
  ('restaurants', 'Cafes & Restaurants', '#facc15', 20),
  ('transport', 'Transport', '#38bdf8', 30),
  ('auto', 'Fuel & Auto', '#fb923c', 40),
  ('pharmacy', 'Pharmacy', '#a7f3d0', 50),
  ('health_beauty', 'Health & Beauty', '#f0abfc', 60),
  ('clothing', 'Clothing', '#c084fc', 70),
  ('home', 'Home', '#94a3b8', 80),
  ('electronics', 'Electronics', '#60a5fa', 90),
  ('entertainment', 'Entertainment', '#f472b6', 100),
  ('travel', 'Travel', '#22d3ee', 110),
  ('telecom', 'Mobile & Internet', '#818cf8', 120),
  ('utilities', 'Utilities', '#2dd4bf', 130),
  ('education', 'Education', '#a3e635', 140),
  ('charity', 'Charity', '#fb7185', 150),
  ('financial_services', 'Financial Services', '#fbbf24', 160),
  ('transfers', 'Transfers', '#e5e7eb', 170),
  ('shopping', 'Shopping', '#34d399', 180),
  ('other', 'Other', '#e7e7e7', 999)
on conflict (slug) do update
set
  label = excluded.label,
  color_hex = excluded.color_hex,
  sort_order = excluded.sort_order;

delete from public.mcc_category_mappings;

with range_mappings (start_mcc, end_mcc, slug, priority) as (
  values
    (3000, 3299, 'travel', 2),
    (3351, 3441, 'travel', 2),
    (3501, 3999, 'travel', 2),
    (742, 742, 'health_beauty', 2),
    (8011, 8099, 'health_beauty', 2),
    (8211, 8299, 'education', 2),
    (8398, 8661, 'charity', 2)
),
explicit_mappings (mcc, slug, priority) as (
  values
    -- Groceries
    (5411, 'groceries', 1),
    (5412, 'groceries', 1),
    (5422, 'groceries', 1),
    (5441, 'groceries', 1),
    (5451, 'groceries', 1),
    (5462, 'groceries', 1),
    (5499, 'groceries', 1),

    -- Cafes & restaurants
    (5811, 'restaurants', 1),
    (5812, 'restaurants', 1),
    (5813, 'restaurants', 1),
    (5814, 'restaurants', 1),

    -- Transport
    (4011, 'transport', 1),
    (4111, 'transport', 1),
    (4112, 'transport', 1),
    (4121, 'transport', 1),
    (4131, 'transport', 1),
    (4784, 'transport', 1),
    (4789, 'transport', 1),
    (7523, 'transport', 1),

    -- Fuel & auto
    (5013, 'auto', 1),
    (5511, 'auto', 1),
    (5521, 'auto', 1),
    (5531, 'auto', 1),
    (5532, 'auto', 1),
    (5533, 'auto', 1),
    (5541, 'auto', 1),
    (5542, 'auto', 1),
    (5571, 'auto', 1),
    (7531, 'auto', 1),
    (7534, 'auto', 1),
    (7535, 'auto', 1),
    (7538, 'auto', 1),
    (7542, 'auto', 1),
    (7549, 'auto', 1),

    -- Pharmacy
    (5122, 'pharmacy', 1),
    (5912, 'pharmacy', 1),

    -- Health & beauty
    (5975, 'health_beauty', 1),
    (5976, 'health_beauty', 1),
    (7230, 'health_beauty', 1),
    (7297, 'health_beauty', 1),
    (7298, 'health_beauty', 1),
    (7299, 'health_beauty', 1),
    (8041, 'health_beauty', 1),
    (8042, 'health_beauty', 1),
    (8043, 'health_beauty', 1),
    (8049, 'health_beauty', 1),
    (8050, 'health_beauty', 1),
    (8062, 'health_beauty', 1),
    (8071, 'health_beauty', 1),
    (8099, 'health_beauty', 1),

    -- Clothing
    (5137, 'clothing', 1),
    (5139, 'clothing', 1),
    (5611, 'clothing', 1),
    (5621, 'clothing', 1),
    (5631, 'clothing', 1),
    (5641, 'clothing', 1),
    (5651, 'clothing', 1),
    (5655, 'clothing', 1),
    (5661, 'clothing', 1),
    (5681, 'clothing', 1),
    (5691, 'clothing', 1),
    (5697, 'clothing', 1),
    (5698, 'clothing', 1),
    (5699, 'clothing', 1),
    (5931, 'clothing', 1),
    (5944, 'clothing', 1),

    -- Home
    (5021, 'home', 1),
    (5200, 'home', 1),
    (5211, 'home', 1),
    (5231, 'home', 1),
    (5251, 'home', 1),
    (5261, 'home', 1),
    (5712, 'home', 1),
    (5713, 'home', 1),
    (5714, 'home', 1),
    (5718, 'home', 1),
    (5719, 'home', 1),
    (5722, 'home', 1),
    (7622, 'home', 1),
    (7623, 'home', 1),
    (7629, 'home', 1),
    (7641, 'home', 1),
    (7699, 'home', 1),

    -- Electronics
    (5045, 'electronics', 1),
    (5732, 'electronics', 1),
    (5734, 'electronics', 1),
    (5735, 'electronics', 1),
    (7372, 'electronics', 1),

    -- Entertainment
    (5815, 'entertainment', 1),
    (5816, 'entertainment', 1),
    (5817, 'entertainment', 1),
    (5818, 'entertainment', 1),
    (5932, 'entertainment', 1),
    (5945, 'entertainment', 1),
    (5993, 'entertainment', 1),
    (7032, 'entertainment', 1),
    (7832, 'entertainment', 1),
    (7841, 'entertainment', 1),
    (7911, 'entertainment', 1),
    (7922, 'entertainment', 1),
    (7929, 'entertainment', 1),
    (7932, 'entertainment', 1),
    (7933, 'entertainment', 1),
    (7941, 'entertainment', 1),
    (7991, 'entertainment', 1),
    (7992, 'entertainment', 1),
    (7993, 'entertainment', 1),
    (7994, 'entertainment', 1),
    (7995, 'entertainment', 1),
    (7996, 'entertainment', 1),
    (7997, 'entertainment', 1),
    (7998, 'entertainment', 1),
    (7999, 'entertainment', 1),

    -- Travel
    (4411, 'travel', 1),
    (4511, 'travel', 1),
    (4582, 'travel', 1),
    (4722, 'travel', 1),
    (5962, 'travel', 1),
    (6513, 'travel', 1),
    (7011, 'travel', 1),
    (7012, 'travel', 1),
    (7033, 'travel', 1),
    (7512, 'travel', 1),

    -- Mobile & internet
    (4812, 'telecom', 1),
    (4814, 'telecom', 1),
    (4816, 'telecom', 1),
    (4821, 'telecom', 1),
    (4899, 'telecom', 1),

    -- Utilities
    (4900, 'utilities', 1),

    -- Education
    (5111, 'education', 1),
    (5192, 'education', 1),
    (5942, 'education', 1),
    (5943, 'education', 1),
    (5946, 'education', 1),
    (5968, 'education', 1),
    (8299, 'education', 1),
    (8351, 'education', 1),

    -- Charity
    (8398, 'charity', 1),
    (8641, 'charity', 1),
    (8651, 'charity', 1),
    (8661, 'charity', 1),

    -- Financial services
    (6010, 'financial_services', 1),
    (6011, 'financial_services', 1),
    (6012, 'financial_services', 1),
    (6051, 'financial_services', 1),
    (6211, 'financial_services', 1),
    (6300, 'financial_services', 1),
    (6399, 'financial_services', 1),

    -- Transfers
    (4829, 'transfers', 1),
    (6532, 'transfers', 1),
    (6533, 'transfers', 1),
    (6536, 'transfers', 1),
    (6537, 'transfers', 1),
    (6538, 'transfers', 1),
    (6540, 'transfers', 1),

    -- Shopping
    (5300, 'shopping', 1),
    (5310, 'shopping', 1),
    (5311, 'shopping', 1),
    (5331, 'shopping', 1),
    (5399, 'shopping', 1),
    (5699, 'shopping', 2),
    (5733, 'shopping', 1),
    (5940, 'shopping', 1),
    (5941, 'shopping', 1),
    (5947, 'shopping', 1),
    (5948, 'shopping', 1),
    (5949, 'shopping', 1),
    (5950, 'shopping', 1),
    (5960, 'shopping', 1),
    (5963, 'shopping', 1),
    (5964, 'shopping', 1),
    (5965, 'shopping', 1),
    (5966, 'shopping', 1),
    (5967, 'shopping', 1),
    (5969, 'shopping', 1),
    (5970, 'shopping', 1),
    (5971, 'shopping', 1),
    (5972, 'shopping', 1),
    (5973, 'shopping', 1),
    (5977, 'shopping', 1),
    (5992, 'shopping', 1),
    (5994, 'shopping', 1),
    (5995, 'shopping', 1),
    (5996, 'shopping', 1),
    (5997, 'shopping', 1),
    (5998, 'shopping', 1),
    (5999, 'shopping', 1)
),
expanded_range_mappings as (
  select generate_series(start_mcc, end_mcc) as mcc, slug, priority
  from range_mappings
),
combined_mappings as (
  select mcc, slug, priority from explicit_mappings
  union all
  select mcc, slug, priority from expanded_range_mappings
),
deduplicated_mappings as (
  select distinct on (mcc) mcc, slug
  from combined_mappings
  order by mcc, priority asc
)
insert into public.mcc_category_mappings (mcc, spending_category_id)
select dm.mcc, sc.id
from deduplicated_mappings dm
join public.spending_categories sc on sc.slug = dm.slug
on conflict (mcc) do update
set spending_category_id = excluded.spending_category_id;

create or replace function public.resolve_transaction_spending_category()
returns trigger
language plpgsql
as $$
declare
  effective_mcc integer;
begin
  effective_mcc := coalesce(new.mcc, new.original_mcc);

  if effective_mcc is not null then
    select mcm.spending_category_id
    into new.spending_category_id
    from public.mcc_category_mappings mcm
    where mcm.mcc = effective_mcc;
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

drop trigger if exists monobank_transactions_resolve_category
  on public.monobank_transactions;

create trigger monobank_transactions_resolve_category
  before insert or update of mcc, original_mcc on public.monobank_transactions
  for each row execute function public.resolve_transaction_spending_category();

update public.monobank_transactions t
set spending_category_id = coalesce(
  (
    select mcm.spending_category_id
    from public.mcc_category_mappings mcm
    where mcm.mcc = coalesce(t.mcc, t.original_mcc)
  ),
  (
    select sc.id
    from public.spending_categories sc
    where sc.slug = 'other'
  )
);

delete from public.spending_categories sc
where sc.slug in ('auto_transport', 'food', 'clothes')
  and not exists (
    select 1
    from public.monobank_transactions t
    where t.spending_category_id = sc.id
  );

commit;
