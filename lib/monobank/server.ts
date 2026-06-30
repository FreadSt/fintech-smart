import "server-only";

import type { User } from "@supabase/supabase-js";
import { encrypt, decrypt } from "@/lib/crypto";
import { getServerSupabase } from "@/lib/supabase/server";
import { createAdminClient } from "@/supabase/admin";
import type {
  MonobankAccount,
  MonobankConnectResponse,
  MonobankJar,
  MonobankOverviewResponse,
  MonobankTransaction,
} from "./types";

type ServerSupabase = Awaited<ReturnType<typeof getServerSupabase>>;
type AdminSupabase = ReturnType<typeof createAdminClient>;
const STATEMENT_SYNC_COOLDOWN_SECONDS = 61;

type MonobankClientInfo = {
  clientId: string;
  name: string;
  webHookUrl?: string;
  permissions?: string;
  accounts: MonobankClientAccount[];
  jars?: MonobankClientJar[];
};

type MonobankClientAccount = {
  id: string;
  sendId?: string;
  balance: number;
  creditLimit: number;
  type: string;
  currencyCode: number;
  cashbackType?: string;
  maskedPan?: string[];
  iban?: string;
};

type MonobankClientJar = {
  id: string;
  sendId?: string;
  title: string;
  description?: string;
  currencyCode: number;
  balance: number;
  goal: number;
};

type MonobankStatementItem = {
  id: string;
  time: number;
  description: string;
  mcc?: number;
  originalMcc?: number;
  hold?: boolean;
  amount: number;
  operationAmount?: number;
  currencyCode: number;
  commissionRate?: number;
  cashbackAmount?: number;
  balance?: number;
  comment?: string;
  receiptId?: string;
  invoiceId?: string;
  counterEdrpou?: string;
  counterIban?: string;
  counterName?: string;
};

type MonobankTransactionRow = Omit<MonobankTransaction, "spending_category"> & {
  spending_category:
    | {
        slug: string;
        label: string;
        color_hex: string;
      }
    | {
        slug: string;
        label: string;
        color_hex: string;
      }[]
    | null;
};

export class MonobankRequestError extends Error {
  retryAfterSeconds?: number;
  status: number;

  constructor(message: string, status: number, retryAfterSeconds?: number) {
    super(message);
    this.name = "MonobankRequestError";
    this.status = status;
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

export async function getAuthenticatedSupabase(): Promise<{
  supabase: ServerSupabase;
  user: User;
}> {
  const supabase = await getServerSupabase();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new MonobankRequestError("Unauthorized", 401);
  }

  return { supabase, user };
}

export async function getMonobankOverview(
  supabase: ServerSupabase,
  userId: string,
): Promise<MonobankOverviewResponse> {
  const { data: integration, error: integrationError } = await supabase
    .from("monobank_integrations")
    .select("last_client_info_sync_at,last_statement_sync_at")
    .eq("user_id", userId)
    .maybeSingle();

  if (integrationError) {
    throw new Error(integrationError.message);
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("monobank_client_name")
    .eq("id", userId)
    .maybeSingle();

  if (profileError) {
    throw new Error(profileError.message);
  }

  const { data: accounts, error: accountsError } = await supabase
    .from("monobank_accounts")
    .select(
      "monobank_account_id,send_id,balance,credit_limit,currency_code,cashback_type,account_type,masked_pan,iban,is_default,is_visible,synced_at",
    )
    .eq("user_id", userId)
    .eq("is_visible", true)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: true });

  if (accountsError) {
    throw new Error(accountsError.message);
  }

  const { data: jars, error: jarsError } = await supabase
    .from("monobank_jars")
    .select(
      "monobank_jar_id,title,description,balance,goal,currency_code,synced_at",
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (jarsError) {
    throw new Error(jarsError.message);
  }

  return {
    connection: integration
      ? {
          client_name: profile?.monobank_client_name ?? null,
          last_client_info_sync_at: integration.last_client_info_sync_at,
          last_statement_sync_at: integration.last_statement_sync_at,
        }
      : null,
    accounts: (accounts ?? []) as MonobankAccount[],
    jars: (jars ?? []) as MonobankJar[],
  };
}

export async function connectMonobank(
  user: User,
  token: string,
): Promise<MonobankConnectResponse> {
  const admin = createAdminClient();
  const clientInfo = await fetchMonobankClientInfo(token);
  const now = new Date();

  await ensureProfile(admin, user, clientInfo);
  await upsertIntegration(admin, user.id, token, clientInfo, now);
  await upsertAccounts(admin, user.id, clientInfo.accounts, now);
  await upsertJars(admin, user.id, clientInfo.jars ?? [], now);

  return {
    clientName: clientInfo.name,
    accountsSynced: clientInfo.accounts.length,
    jarsSynced: clientInfo.jars?.length ?? 0,
    transactionsSynced: 0,
  };
}

export async function disconnectMonobank(userId: string): Promise<void> {
  const admin = createAdminClient();
  const tables = [
    "monobank_transactions",
    "monobank_jars",
    "monobank_accounts",
    "monobank_integrations",
  ] as const;

  for (const table of tables) {
    const { error } = await admin.from(table).delete().eq("user_id", userId);

    if (error) {
      throw new Error(error.message);
    }
  }
}

export async function getMonobankConnectionToken(
  supabase: ServerSupabase,
  userId: string,
): Promise<string> {
  const { data, error } = await supabase
    .from("monobank_integrations")
    .select("access_token")
    .eq("user_id", userId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return decrypt(data.access_token);
}

export async function getStatementRetryAfterSeconds(
  supabase: ServerSupabase,
  userId: string,
): Promise<number> {
  const { data, error } = await supabase
    .from("monobank_integrations")
    .select("last_client_info_sync_at,last_statement_sync_at")
    .eq("user_id", userId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  const lastRequestAt = [
    data.last_client_info_sync_at,
    data.last_statement_sync_at,
  ]
    .filter((value): value is string => Boolean(value))
    .map((value) => new Date(value).getTime())
    .sort((a, b) => b - a)[0];

  if (!lastRequestAt) {
    return 0;
  }

  const elapsedSeconds = Math.floor((Date.now() - lastRequestAt) / 1000);
  return Math.max(0, STATEMENT_SYNC_COOLDOWN_SECONDS - elapsedSeconds);
}

export async function reserveStatementSync(userId: string): Promise<void> {
  const admin = createAdminClient();
  const now = new Date().toISOString();
  const { error } = await admin
    .from("monobank_integrations")
    .update({ last_statement_sync_at: now })
    .eq("user_id", userId);

  if (error) {
    throw new Error(error.message);
  }
}

export async function markStatementSynced(userId: string): Promise<void> {
  const admin = createAdminClient();
  const { error } = await admin
    .from("monobank_integrations")
    .update({ last_statement_sync_at: new Date().toISOString() })
    .eq("user_id", userId);

  if (error) {
    throw new Error(error.message);
  }
}

export async function assertMonobankAccountBelongsToUser(
  supabase: ServerSupabase,
  userId: string,
  accountId: string,
): Promise<void> {
  const { data, error } = await supabase
    .from("monobank_accounts")
    .select("monobank_account_id")
    .eq("user_id", userId)
    .eq("monobank_account_id", accountId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new MonobankRequestError("Account not found", 404);
  }
}

export async function getDefaultMonobankAccountId(
  supabase: ServerSupabase,
  userId: string,
): Promise<string> {
  const { data, error } = await supabase
    .from("monobank_accounts")
    .select("monobank_account_id,balance,is_default")
    .eq("user_id", userId)
    .eq("is_visible", true)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  if (!data || data.length === 0) {
    throw new MonobankRequestError("No Monobank account connected", 404);
  }

  return (
    data.find((account) => account.is_default && account.balance > 0) ??
    data.find((account) => account.balance > 0) ??
    data[0]
  ).monobank_account_id;
}

export async function getCachedMonobankTransactions(
  supabase: ServerSupabase,
  userId: string,
  from: number,
  to: number,
  accountId?: string,
): Promise<MonobankTransaction[]> {
  let query = supabase
    .from("monobank_transactions")
    .select(
      "monobank_transaction_id,monobank_account_id,transaction_time,description,mcc,original_mcc,is_hold,amount,operation_amount,currency_code,commission_rate,cashback_amount,balance_after,comment,receipt_id,invoice_id,counter_edrpou,counter_iban,counter_name,synced_at,spending_category:spending_categories(slug,label,color_hex)",
    )
    .eq("user_id", userId)
    .gte("transaction_time", new Date(from * 1000).toISOString())
    .lte("transaction_time", new Date(to * 1000).toISOString())
    .order("transaction_time", { ascending: false });

  if (accountId) {
    query = query.eq("monobank_account_id", accountId);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return ((data ?? []) as MonobankTransactionRow[]).map((transaction) => ({
    ...transaction,
    spending_category: Array.isArray(transaction.spending_category)
      ? (transaction.spending_category[0] ?? null)
      : transaction.spending_category,
  }));
}

function buildMonobankStatementUrl(
  accountId: string,
  from: number,
  to: number,
): string {
  if (!accountId.trim()) {
    throw new MonobankRequestError("Monobank account id is required", 400);
  }

  return `https://api.monobank.ua/personal/statement/${encodeURIComponent(accountId)}/${from}/${to}`;
}

export async function fetchMonobankStatement(
  token: string,
  accountId: string,
  from: number,
  to: number,
): Promise<MonobankStatementItem[]> {
  const statementUrl = buildMonobankStatementUrl(accountId, from, to);
  const response = await monobankFetch(statementUrl, token);

  return (await response.json()) as MonobankStatementItem[];
}

export async function saveMonobankTransactions(
  supabase: ServerSupabase,
  userId: string,
  accountId: string,
  items: MonobankStatementItem[],
): Promise<MonobankTransaction[]> {
  const admin = createAdminClient();
  const syncedAt = new Date().toISOString();
  const rows = items.map((item) =>
    toTransactionRow(userId, accountId, item, syncedAt),
  );

  if (rows.length === 0) {
    return [];
  }

  const { error } = await admin
    .from("monobank_transactions")
    .upsert(rows, { onConflict: "user_id,monobank_transaction_id" });

  if (error) {
    throw new Error(error.message);
  }

  return getCachedMonobankTransactions(
    supabase,
    userId,
    Math.min(...items.map((item) => item.time)),
    Math.max(...items.map((item) => item.time)),
    accountId,
  );
}

async function fetchMonobankClientInfo(
  token: string,
): Promise<MonobankClientInfo> {
  const response = await monobankFetch(
    "https://api.monobank.ua/personal/client-info",
    token,
  );

  return (await response.json()) as MonobankClientInfo;
}

async function monobankFetch(url: string, token: string): Promise<Response> {
  const response = await fetch(url, {
    headers: {
      "X-Token": token,
    },
    cache: "no-store",
  });

  if (response.status === 429) {
    const retryAfter = Number(response.headers.get("retry-after") ?? 61);
    throw new MonobankRequestError(
      "Monobank rate limit reached",
      429,
      Number.isFinite(retryAfter) ? retryAfter : 61,
    );
  }

  if (!response.ok) {
    throw new MonobankRequestError(
      `Monobank request failed with status ${response.status}`,
      response.status,
    );
  }

  return response;
}

async function ensureProfile(
  admin: AdminSupabase,
  user: User,
  clientInfo: MonobankClientInfo,
): Promise<void> {
  const { error } = await admin.from("profiles").upsert({
    id: user.id,
    display_name: user.user_metadata.full_name ?? user.email ?? clientInfo.name,
    monobank_client_id: clientInfo.clientId,
    monobank_client_name: clientInfo.name,
  });

  if (error) {
    throw new Error(error.message);
  }
}

async function upsertIntegration(
  admin: AdminSupabase,
  userId: string,
  token: string,
  clientInfo: MonobankClientInfo,
  syncedAt: Date,
): Promise<void> {
  const { error } = await admin.from("monobank_integrations").upsert(
    {
      user_id: userId,
      access_token: encrypt(token),
      webhook_url: clientInfo.webHookUrl ?? null,
      permissions: clientInfo.permissions ?? null,
      is_active: true,
      last_client_info_sync_at: syncedAt.toISOString(),
    },
    { onConflict: "user_id" },
  );

  if (error) {
    throw new Error(error.message);
  }
}

async function upsertAccounts(
  admin: AdminSupabase,
  userId: string,
  accounts: MonobankClientAccount[],
  syncedAt: Date,
): Promise<void> {
  if (accounts.length === 0) {
    return;
  }

  const defaultAccountIndex = Math.max(
    accounts.findIndex((account) => account.balance > 0),
    0,
  );

  const { error } = await admin.from("monobank_accounts").upsert(
    accounts.map((account, index) => ({
      user_id: userId,
      monobank_account_id: account.id,
      send_id: account.sendId ?? null,
      balance: account.balance,
      credit_limit: account.creditLimit,
      currency_code: account.currencyCode,
      cashback_type: account.cashbackType ?? null,
      account_type: account.type,
      masked_pan: account.maskedPan ?? [],
      iban: account.iban ?? null,
      is_default: index === defaultAccountIndex,
      is_visible: true,
      synced_at: syncedAt.toISOString(),
    })),
    { onConflict: "user_id,monobank_account_id" },
  );

  if (error) {
    throw new Error(error.message);
  }
}

async function upsertJars(
  admin: AdminSupabase,
  userId: string,
  jars: MonobankClientJar[],
  syncedAt: Date,
): Promise<void> {
  if (jars.length === 0) {
    return;
  }

  const { error } = await admin.from("monobank_jars").upsert(
    jars.map((jar) => ({
      user_id: userId,
      monobank_jar_id: jar.id,
      send_id: jar.sendId ?? null,
      title: jar.title,
      description: jar.description ?? null,
      currency_code: jar.currencyCode,
      balance: jar.balance,
      goal: jar.goal,
      synced_at: syncedAt.toISOString(),
    })),
    { onConflict: "user_id,monobank_jar_id" },
  );

  if (error) {
    throw new Error(error.message);
  }
}

function toTransactionRow(
  userId: string,
  accountId: string,
  item: MonobankStatementItem,
  syncedAt: string,
) {
  return {
    user_id: userId,
    monobank_account_id: accountId,
    monobank_transaction_id: item.id,
    transaction_time: new Date(item.time * 1000).toISOString(),
    description: item.description,
    mcc: item.mcc ?? null,
    original_mcc: item.originalMcc ?? null,
    is_hold: item.hold ?? false,
    amount: item.amount,
    operation_amount: item.operationAmount ?? null,
    currency_code: item.currencyCode,
    commission_rate: item.commissionRate ?? 0,
    cashback_amount: item.cashbackAmount ?? 0,
    balance_after: item.balance ?? null,
    comment: item.comment ?? null,
    receipt_id: item.receiptId ?? null,
    invoice_id: item.invoiceId ?? null,
    counter_edrpou: item.counterEdrpou ?? null,
    counter_iban: item.counterIban ?? null,
    counter_name: item.counterName ?? null,
    synced_at: syncedAt,
  };
}
