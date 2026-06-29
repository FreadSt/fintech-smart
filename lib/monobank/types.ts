export type MonobankAccount = {
  monobank_account_id: string;
  send_id: string | null;
  balance: number;
  credit_limit: number;
  currency_code: number;
  cashback_type: string | null;
  account_type: string;
  masked_pan: string[];
  iban: string | null;
  is_default: boolean;
  is_visible: boolean;
  synced_at: string;
};

export type MonobankJar = {
  monobank_jar_id: string;
  title: string;
  description: string | null;
  balance: number;
  goal: number;
  currency_code: number;
  synced_at: string;
};

export type MonobankConnectionStatus = {
  client_name: string | null;
  last_client_info_sync_at: string | null;
  last_statement_sync_at: string | null;
};

export type MonobankOverviewResponse = {
  connection: MonobankConnectionStatus | null;
  accounts: MonobankAccount[];
  jars: MonobankJar[];
};

export type MonobankTransaction = {
  monobank_transaction_id: string;
  monobank_account_id: string;
  transaction_time: string;
  description: string;
  mcc: number | null;
  original_mcc: number | null;
  is_hold: boolean;
  amount: number;
  operation_amount: number | null;
  currency_code: number;
  commission_rate: number;
  cashback_amount: number;
  balance_after: number | null;
  comment: string | null;
  receipt_id: string | null;
  invoice_id: string | null;
  counter_edrpou: string | null;
  counter_iban: string | null;
  counter_name: string | null;
  synced_at: string;
  spending_category?: {
    slug: string;
    label: string;
    color_hex: string;
  } | null;
};

export type MonobankTransactionsResponse = {
  transactions: MonobankTransaction[];
  source: "db" | "monobank";
};

export type MonobankConnectResponse = {
  clientName: string;
  accountsSynced: number;
  jarsSynced: number;
  transactionsSynced: number;
};
