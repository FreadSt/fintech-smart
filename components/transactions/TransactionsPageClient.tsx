"use client";

import { ArrowDownLeft, ArrowUpRight, ChevronDown, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Card } from "@/components/ui/Card";
import { WidgetEmptyState, WidgetSkeleton } from "@/components/dashboard/widgets/WidgetState";
import { Input } from "@/shared/input/Input";
import { Text } from "@/shared/text/Text";
import { cn } from "@/lib/utils/cn";
import { formatKopecks, getCurrencyCode } from "@/lib/monobank/money";
import type { MonobankAccount, MonobankTransaction } from "@/lib/monobank/types";
import {
  getAccountLabel,
  getTransactionSpendingCategory,
  formatDate,
} from "@/lib/monobank/view/dashboard";
import {
  useDefaultStatementRange,
  useMonobankOverview,
  useSelectedMonobankAccount,
  useMonobankTransactions,
} from "@/components/cards/mono/useMonobankConnection";

const emptyAccounts: MonobankAccount[] = [];
const emptyTransactions: MonobankTransaction[] = [];

export function TransactionsPageClient() {
  const overviewQuery = useMonobankOverview();
  const range = useDefaultStatementRange();
  const accounts = overviewQuery.data?.accounts ?? emptyAccounts;
  const selectedAccount = useSelectedMonobankAccount(accounts);
  const [transactionSearch, setTransactionSearch] = useState("");
  const [pickerOpen, setPickerOpen] = useState(false);
  const activeAccountId = selectedAccount.activeAccountId;
  const activeAccount = selectedAccount.activeAccount;
  const { data, error, isLoading } = useMonobankTransactions(
    range.from,
    range.to,
    activeAccountId,
    { enabled: Boolean(activeAccountId) },
  );
  const transactions = data?.transactions ?? emptyTransactions;
  const visibleTransactions = useMemo(
    () =>
      transactions.filter(
        (transaction) =>
          transaction.monobank_account_id === activeAccountId &&
          matchesTransactionSearch(transaction, transactionSearch, activeAccount),
      ),
    [activeAccount, activeAccountId, transactionSearch, transactions],
  );

  function handleAccountSelected(accountId: string) {
    selectedAccount.setSelectedAccountId(accountId);
    setPickerOpen(false);
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-end">
        <div>
          <Text className="text-sm text-muted">Activity</Text>
          <Text as="h1" className="text-2xl font-semibold tracking-tight">Transactions</Text>
        </div>
        <div className="flex w-full flex-col gap-2 sm:flex-row lg:max-w-2xl">
          <div className="flex items-center gap-2 rounded-2xl border border-border bg-surface-elevated px-3 py-2">
            <Search className="size-4 text-muted" />
            <Input
              aria-label="Search transactions"
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted"
              placeholder="Search transactions"
              value={transactionSearch}
              onChange={(event) => setTransactionSearch(event.target.value)}
            />
          </div>
          <div className="relative sm:w-72">
            <button
              className="flex h-full min-h-10 w-full items-center justify-between gap-3 rounded-2xl border border-border bg-surface-elevated px-3 py-2 text-left text-sm"
              type="button"
              onClick={() => setPickerOpen((isOpen) => !isOpen)}
            >
              <span className="min-w-0">
                <Text as="span" className="block truncate font-medium">
                  {activeAccount ? getAccountLabel(activeAccount) : "Select card"}
                </Text>
                {activeAccount ? (
                  <Text as="span" className="block truncate text-xs text-muted">
                    {formatKopecks(activeAccount.balance, activeAccount.currency_code)}
                  </Text>
                ) : null}
              </span>
              <ChevronDown className="size-4 shrink-0 text-muted" />
            </button>
            {pickerOpen ? (
              <div className="absolute right-0 z-20 mt-2 max-h-72 w-full overflow-auto rounded-card border border-border bg-surface p-2 shadow-2xl">
                {overviewQuery.isLoading ? (
                  <Text className="px-3 py-2 text-sm text-muted">Loading cards...</Text>
                ) : accounts.length === 0 ? (
                  <Text className="px-3 py-2 text-sm text-muted">No cards found</Text>
                ) : (
                  accounts.map((account) => (
                    <button
                      key={account.monobank_account_id}
                      className={cn(
                        "flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-left text-sm transition-colors hover:bg-surface-elevated",
                        account.monobank_account_id === activeAccountId && "bg-surface-elevated",
                      )}
                      type="button"
                      onClick={() => handleAccountSelected(account.monobank_account_id)}
                    >
                      <span className="min-w-0">
                        <Text as="span" className="block truncate font-medium">
                          {getAccountLabel(account)}
                        </Text>
                        <Text as="span" className="block truncate text-xs text-muted">
                          {account.monobank_account_id}
                        </Text>
                      </span>
                      <Text as="span" className="shrink-0 font-semibold">
                        {formatKopecks(account.balance, account.currency_code)}
                      </Text>
                    </button>
                  ))
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <Card className="overflow-hidden p-0">
        <div className="grid grid-cols-[1.2fr_0.8fr_0.8fr_0.6fr] gap-4 border-b border-border px-5 py-4 text-xs uppercase text-muted max-md:hidden">
          <Text as="span">Merchant</Text>
          <Text as="span">Account</Text>
          <Text as="span">Status</Text>
          <Text as="span" className="text-right">Amount</Text>
        </div>
        {isLoading ? (
          <TransactionsSkeleton />
        ) : error ? (
          <div className="p-5">
            <Text className="text-sm text-red-400">{error.message}</Text>
          </div>
        ) : !activeAccountId ? (
          <WidgetEmptyState className="m-5" />
        ) : visibleTransactions.length === 0 ? (
          <WidgetEmptyState className="m-5" />
        ) : (
          <div className="divide-y divide-border">
            {visibleTransactions.map((transaction) => (
              <div
                key={transaction.monobank_transaction_id}
                className="grid gap-4 px-5 py-4 md:grid-cols-[1.2fr_0.8fr_0.8fr_0.6fr] md:items-center"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-11 items-center justify-center rounded-2xl bg-surface-elevated text-xs font-semibold">
                    {transaction.amount > 0 ? (
                      <ArrowDownLeft className="size-4 text-accent-emerald" />
                    ) : (
                      <ArrowUpRight className="size-4 text-red-400" />
                    )}
                  </div>
                  <div>
                <Text className="font-medium">{transaction.description}</Text>
                    <Text className="text-sm text-muted">
                      {getTransactionSpendingCategory(transaction)?.label ?? "Other"} / {formatDate(transaction.transaction_time)}
                    </Text>
                  </div>
                </div>
                <Text className="text-sm text-muted">
                  {getAccountLabel(
                    accounts.find(
                      (account) =>
                        account.monobank_account_id ===
                        transaction.monobank_account_id,
                    ),
                  )}
                </Text>
                <Text as="span" className="w-fit rounded-full bg-surface-elevated px-3 py-1 text-xs text-muted">
                  {transaction.is_hold ? "Hold" : "Completed"}
                </Text>
                <Text
                  className={cn(
                    "text-right font-semibold max-md:text-left",
                    transaction.amount > 0 && "text-accent-emerald",
                    transaction.amount < 0 && "text-red-400",
                  )}
                >
                  {formatKopecks(transaction.amount, transaction.currency_code)}
                </Text>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
function matchesTransactionSearch(
  transaction: MonobankTransaction,
  query: string,
  account?: MonobankAccount,
): boolean {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return true;
  }

  const searchableValues = [
    transaction.description,
    transaction.counter_name,
    transaction.comment,
    transaction.receipt_id,
    transaction.invoice_id,
    transaction.counter_edrpou,
    transaction.counter_iban,
    getTransactionSpendingCategory(transaction)?.label,
    transaction.is_hold ? "hold" : "completed",
    formatDate(transaction.transaction_time),
    formatKopecks(transaction.amount, transaction.currency_code),
    String(transaction.amount / 100),
    String(Math.abs(transaction.amount) / 100),
    account ? getAccountLabel(account) : getCurrencyCode(transaction.currency_code),
  ];

  return searchableValues.some((value) =>
    value?.toLowerCase().includes(normalizedQuery),
  );
}
function TransactionsSkeleton() {
  return (
    <div className="space-y-0 p-5">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="grid gap-4 py-4 md:grid-cols-[1.2fr_0.8fr_0.8fr_0.6fr] md:items-center"
        >
          <div className="flex items-center gap-3">
            <WidgetSkeleton className="size-11 rounded-2xl" />
            <div className="space-y-2">
              <WidgetSkeleton className="h-4 w-32" />
              <WidgetSkeleton className="h-3 w-24" />
            </div>
          </div>
          <WidgetSkeleton className="h-4 w-24" />
          <WidgetSkeleton className="h-6 w-20 rounded-full" />
          <WidgetSkeleton className="h-5 w-20 md:ml-auto" />
        </div>
      ))}
    </div>
  );
}
