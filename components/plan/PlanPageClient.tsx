"use client";

import { CalendarDays, Target, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { WidgetEmptyState, WidgetSkeleton } from "@/components/dashboard/widgets/WidgetState";
import { Text } from "@/shared/text/Text";
import { formatKopecks } from "@/lib/monobank/money";
import {
  useDefaultStatementRange,
  useMonobankOverview,
  useMonobankTransactions,
} from "@/components/cards/mono/useMonobankConnection";
import { toGoalItems } from "@/lib/monobank/view/dashboard";

export function PlanPageClient() {
  const overviewQuery = useMonobankOverview();
  const range = useDefaultStatementRange();
  const transactionsQuery = useMonobankTransactions(range.from, range.to);
  const goals = toGoalItems(overviewQuery.data?.jars ?? []);
  const savingsByCurrency = new Map<number, number>();

  for (const jar of overviewQuery.data?.jars ?? []) {
    savingsByCurrency.set(
      jar.currency_code,
      (savingsByCurrency.get(jar.currency_code) ?? 0) + jar.balance,
    );
  }

  const savingsBalance = [...savingsByCurrency.entries()]
    .map(([currencyCode, amount]) => formatKopecks(amount, currencyCode))
    .join(" / ");
  const recentObligations = (transactionsQuery.data?.transactions ?? [])
    .filter((transaction) => transaction.amount < 0)
    .slice(0, 2);
  const isLoading = overviewQuery.isLoading || transactionsQuery.isLoading;

  return (
    <div className="space-y-5">
      <div>
        <Text className="text-sm text-muted">Targets</Text>
        <Text as="h1" className="text-2xl font-semibold tracking-tight">Plan</Text>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <Text as="h2" className="text-lg font-semibold">Savings goals</Text>
            <Target className="size-5 text-primary" />
          </div>
          {isLoading ? (
            <ListSkeleton />
          ) : goals.length === 0 ? (
            <WidgetEmptyState />
          ) : (
            <div className="space-y-5">
              {goals.map((goal) => (
                <div key={goal.name}>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <div>
                      <Text className="font-medium">{goal.name}</Text>
                      <Text className="text-sm text-muted">
                        {goal.saved} of {goal.target}
                      </Text>
                    </div>
                    <Text as="span" className="text-sm font-semibold">{goal.progress}%</Text>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-surface-elevated">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <Text as="h2" className="text-lg font-semibold">Savings by jar</Text>
            <TrendingUp className="size-5 text-secondary" />
          </div>
          {isLoading ? (
            <ListSkeleton />
          ) : goals.length === 0 ? (
            <WidgetEmptyState />
          ) : (
            <div className="space-y-3">
              {goals.map((goal) => (
                <div key={goal.name} className="flex items-center justify-between rounded-2xl bg-surface-elevated p-4">
                  <Text className="text-sm text-muted">{goal.name}</Text>
                  <Text className="font-semibold">{goal.saved}</Text>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <Text className="text-sm text-muted">Savings balance</Text>
          <Text className="mt-2 text-4xl font-semibold">
            {savingsBalance || "No Data yet"}
          </Text>
          <Text className="mt-3 inline-flex items-center gap-1 rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">
            <TrendingUp className="size-3" />
            {goals.length}
          </Text>
        </Card>
        <Card className="p-6">
          <div className="mb-5 flex items-center justify-between">
            <Text as="h2" className="text-lg font-semibold">Recent obligations</Text>
            <CalendarDays className="size-5 text-primary" />
          </div>
          {isLoading ? (
            <ListSkeleton />
          ) : recentObligations.length === 0 ? (
            <WidgetEmptyState />
          ) : (
            <div className="space-y-3">
              {recentObligations.map((payment) => (
                <div key={payment.monobank_transaction_id} className="flex items-center justify-between text-sm">
                  <Text as="span" className="text-muted">{payment.description}</Text>
                  <Text as="span">{formatKopecks(payment.amount, payment.currency_code)}</Text>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

function ListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <WidgetSkeleton key={index} className="h-14 rounded-2xl" />
      ))}
    </div>
  );
}
