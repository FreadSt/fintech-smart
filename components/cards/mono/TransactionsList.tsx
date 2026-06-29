"use client";

import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { Text } from "@/shared/text/Text";
import { cn } from "@/lib/utils/cn";
import { formatKopecks } from "@/lib/monobank/money";
import { MonobankApiError } from "@/lib/monobank/client";
import { WidgetEmptyState, WidgetSkeleton } from "@/components/dashboard/widgets/WidgetState";
import { useMonobankTransactions } from "./useMonobankConnection";

type TransactionsListProps = {
  from: number;
  to: number;
};

function formatTransactionDate(value: string): string {
  return new Date(value).toLocaleDateString("uk-UA", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function TransactionsList({ from, to }: TransactionsListProps) {
  const { data, error, isLoading, isFetching } = useMonobankTransactions(
    from,
    to,
  );
  const transactions = data?.transactions ?? [];

  if (isLoading || isFetching) {
    return <TransactionsSkeleton />;
  }

  if (error) {
    const retryAfterSeconds =
      error instanceof MonobankApiError ? error.retryAfterSeconds : undefined;

    return (
      <div className="rounded-card border border-border bg-surface-elevated/50 p-5">
        <Text className="text-sm font-medium text-red-400">
          {error.message}
        </Text>
        {retryAfterSeconds ? (
          <Text className="mt-1 text-xs text-muted">
            Retry after {retryAfterSeconds} seconds.
          </Text>
        ) : null}
      </div>
    );
  }

  if (transactions.length === 0) {
    return <WidgetEmptyState className="min-h-48" />;
  }

  return (
    <div className="divide-y divide-border">
      {transactions.map((transaction) => {
        const isIncome = transaction.amount > 0;

        return (
          <div
            key={transaction.monobank_transaction_id}
            className="grid gap-4 py-4 md:grid-cols-[0.7fr_1fr_0.6fr_0.45fr] md:items-center"
          >
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-2xl bg-surface-elevated">
                {isIncome ? (
                  <ArrowDownLeft className="size-4 text-accent-emerald" />
                ) : (
                  <ArrowUpRight className="size-4 text-red-400" />
                )}
              </div>
              <Text className="text-sm text-muted">
                {formatTransactionDate(transaction.transaction_time)}
              </Text>
            </div>

            <div>
              <Text className="text-sm font-medium">
                {transaction.description}
              </Text>
              {transaction.counter_name ? (
                <Text className="text-xs text-muted">
                  {transaction.counter_name}
                </Text>
              ) : null}
            </div>

            <Text className="text-sm text-muted">
              {transaction.spending_category?.label ?? "Other"}
            </Text>

            <Text
              className={cn(
                "font-semibold md:text-right",
                transaction.amount < 0 && "text-red-400",
                transaction.amount > 0 && "text-accent-emerald",
                transaction.amount === 0 && "text-muted",
              )}
            >
              {formatKopecks(transaction.amount)}
            </Text>
          </div>
        );
      })}
    </div>
  );
}

function TransactionsSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="grid gap-4 md:grid-cols-[0.7fr_1fr_0.6fr_0.45fr] md:items-center"
        >
          <div className="flex items-center gap-3">
            <WidgetSkeleton className="size-10 rounded-2xl" />
            <WidgetSkeleton className="h-4 w-24" />
          </div>
          <WidgetSkeleton className="h-4 w-44 max-w-full" />
          <WidgetSkeleton className="h-4 w-20" />
          <WidgetSkeleton className="h-5 w-20 md:ml-auto" />
        </div>
      ))}
    </div>
  );
}
