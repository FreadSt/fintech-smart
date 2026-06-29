"use client";

import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { WidgetEmptyState, WidgetSkeleton } from "@/components/dashboard/widgets/WidgetState";
import { Text } from "@/shared/text/Text";
import { cn } from "@/lib/utils/cn";
import { formatKopecks } from "@/lib/monobank/money";
import {
  getDefaultStatementRange,
  useMonobankTransactions,
} from "@/components/cards/mono/useMonobankConnection";

const range = getDefaultStatementRange();

export function TransactionsPageClient() {
  const { data, error, isLoading } = useMonobankTransactions(
    range.from,
    range.to,
  );
  const transactions = data?.transactions ?? [];

  return (
    <div className="space-y-5">
      <div>
        <Text className="text-sm text-muted">Activity</Text>
        <Text as="h1" className="text-2xl font-semibold tracking-tight">Transactions</Text>
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
        ) : transactions.length === 0 ? (
          <WidgetEmptyState className="m-5" />
        ) : (
          <div className="divide-y divide-border">
            {transactions.map((transaction) => (
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
                      {transaction.spending_category?.label ?? "Other"} / {formatDate(transaction.transaction_time)}
                    </Text>
                  </div>
                </div>
                <Text className="text-sm text-muted">
                  {transaction.monobank_account_id}
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

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("uk-UA", {
    day: "2-digit",
    month: "short",
  });
}
