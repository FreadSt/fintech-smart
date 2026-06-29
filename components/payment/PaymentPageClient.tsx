"use client";

import { CalendarClock, CreditCard, SendHorizontal, Wallet } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { WidgetEmptyState, WidgetSkeleton } from "@/components/dashboard/widgets/WidgetState";
import { Text } from "@/shared/text/Text";
import { formatKopecks, getCurrencyCode } from "@/lib/monobank/money";
import {
  getDefaultStatementRange,
  useMonobankOverview,
  useMonobankTransactions,
} from "@/components/cards/mono/useMonobankConnection";

const range = getDefaultStatementRange();

export function PaymentPageClient() {
  const overviewQuery = useMonobankOverview();
  const transactionsQuery = useMonobankTransactions(range.from, range.to);
  const transactions = transactionsQuery.data?.transactions ?? [];
  const quickTransfers = [...new Set(
    transactions
      .map((transaction) => transaction.counter_name)
      .filter((name): name is string => Boolean(name)),
  )].slice(0, 3);
  const scheduledPayments = transactions
    .filter((transaction) => transaction.amount < 0)
    .slice(0, 3);
  const isLoading = overviewQuery.isLoading || transactionsQuery.isLoading;

  return (
    <div className="space-y-5">
      <div>
        <Text className="text-sm text-muted">Move money</Text>
        <Text as="h1" className="text-2xl font-semibold tracking-tight">Payment</Text>
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <Text as="h2" className="text-lg font-semibold">Quick transfer</Text>
            <SendHorizontal className="size-5 text-primary" />
          </div>
          {isLoading ? (
            <GridSkeleton />
          ) : quickTransfers.length === 0 ? (
            <WidgetEmptyState />
          ) : (
            <div className="grid gap-3 sm:grid-cols-3">
              {quickTransfers.map((name) => (
                <div key={name} className="rounded-2xl bg-surface-elevated p-4">
                  <div className="flex size-11 items-center justify-center rounded-full border border-border text-xs font-semibold">
                    {getInitials(name)}
                  </div>
                  <Text className="mt-3 text-sm font-medium">{name}</Text>
                  <Text className="mt-1 text-sm text-muted">Recent counterparty</Text>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <Text as="h2" className="text-lg font-semibold">Payment methods</Text>
            <Wallet className="size-5 text-secondary" />
          </div>
          {isLoading ? (
            <ListSkeleton />
          ) : (overviewQuery.data?.accounts.length ?? 0) === 0 ? (
            <WidgetEmptyState />
          ) : (
            <div className="space-y-3">
              {overviewQuery.data?.accounts.map((method) => (
                <div
                  key={method.monobank_account_id}
                  className="flex items-center justify-between gap-4 rounded-2xl bg-surface-elevated p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-full bg-background">
                      <CreditCard className="size-4" />
                    </div>
                    <div>
                      <Text className="text-sm font-medium">
                        {method.account_type} *{getLastFour(method.masked_pan[0])}
                      </Text>
                      <Text className="text-xs text-muted">
                        {getCurrencyCode(method.currency_code)}
                      </Text>
                    </div>
                  </div>
                  <div className="text-right">
                    <Text className="text-sm">
                      {method.is_default ? "Primary" : "Active"}
                    </Text>
                    <Text className="text-xs text-muted">
                      {formatKopecks(method.balance, method.currency_code)}
                    </Text>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <Card className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <Text as="h2" className="text-lg font-semibold">Scheduled payments</Text>
          <CalendarClock className="size-5 text-primary" />
        </div>
        {isLoading ? (
          <GridSkeleton />
        ) : scheduledPayments.length === 0 ? (
          <WidgetEmptyState />
        ) : (
          <div className="grid gap-3 md:grid-cols-3">
            {scheduledPayments.map((payment) => (
              <div key={payment.monobank_transaction_id} className="rounded-2xl bg-surface-elevated p-4">
                <div className="flex items-center justify-between gap-3">
                  <Text className="font-medium">{payment.description}</Text>
                  <Text as="span" className="rounded-full bg-background px-3 py-1 text-xs text-muted">
                    {payment.is_hold ? "Hold" : "Paid"}
                  </Text>
                </div>
                <Text className="mt-4 text-2xl font-semibold">
                  {formatKopecks(payment.amount, payment.currency_code)}
                </Text>
                <Text className="mt-1 text-sm text-muted">
                  {formatDate(payment.transaction_time)}
                </Text>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

function GridSkeleton() {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <WidgetSkeleton key={index} className="h-32 rounded-2xl" />
      ))}
    </div>
  );
}

function ListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <WidgetSkeleton key={index} className="h-18 rounded-2xl" />
      ))}
    </div>
  );
}

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function getLastFour(maskedPan?: string): string {
  return maskedPan?.replace(/\D/g, "").slice(-4).padStart(4, "0") ?? "0000";
}

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("uk-UA", {
    day: "2-digit",
    month: "short",
  });
}
