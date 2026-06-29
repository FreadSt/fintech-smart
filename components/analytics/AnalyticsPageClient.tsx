"use client";

import { ArrowUpRight, TrendingDown, TrendingUp } from "lucide-react";
import type { ReactNode } from "react";
import { Card } from "@/components/ui/Card";
import { WidgetEmptyState, WidgetSkeleton } from "@/components/dashboard/widgets/WidgetState";
import { Text } from "@/shared/text/Text";
import {
  getDefaultStatementRange,
  useMonobankOverview,
  useMonobankTransactions,
} from "@/components/cards/mono/useMonobankConnection";
import {
  buildBudgetData,
  buildDashboardSummary,
  buildSpendingCategories,
} from "@/lib/monobank/view/dashboard";
import { budgetLegend } from "@/lib/dashboard/mock-data";

const range = getDefaultStatementRange();

export function AnalyticsPageClient() {
  const overviewQuery = useMonobankOverview();
  const transactionsQuery = useMonobankTransactions(range.from, range.to);
  const transactions = transactionsQuery.data?.transactions ?? [];
  const summary = overviewQuery.data
    ? buildDashboardSummary(
        overviewQuery.data.accounts,
        overviewQuery.data.jars,
        transactions,
      )
    : null;
  const spending = buildSpendingCategories(transactions);
  const budget = buildBudgetData(transactions);
  const monthlyBudget = budget?.monthly;
  const isLoading = overviewQuery.isLoading || transactionsQuery.isLoading;

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div>
          <Text className="text-sm text-muted">Overview</Text>
          <Text as="h1" className="text-2xl font-semibold tracking-tight">Analytics</Text>
        </div>
        <Text as="span" className="w-fit rounded-full border border-border bg-surface px-4 py-2 text-sm text-muted">
          Monthly report
        </Text>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          icon={<TrendingUp className="size-3" />}
          isLoading={isLoading}
          label="Income"
          value={summary?.income}
        />
        <MetricCard
          icon={<TrendingDown className="size-3" />}
          isLoading={isLoading}
          label="Expense"
          value={summary?.expense}
        />
        <MetricCard
          icon={<ArrowUpRight className="size-5 text-primary" />}
          isLoading={isLoading}
          label="Net cashflow"
          value="See currencies"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.4fr_0.8fr]">
        <Card className="p-6">
          <div className="mb-6 flex items-center justify-between gap-3">
            <Text as="h2" className="text-lg font-semibold">Budget performance</Text>
            <Text className="text-sm text-muted">Recent months</Text>
          </div>
          {isLoading ? (
            <ChartSkeleton />
          ) : !monthlyBudget || monthlyBudget.entries.length === 0 ? (
            <WidgetEmptyState className="h-64" />
          ) : (
            <>
              <div className="flex h-64 items-end justify-between gap-3">
                {monthlyBudget.entries.map((entry, index) => {
                  const max = Math.max(
                    ...monthlyBudget.entries.flatMap((item) => [
                      item.income,
                      item.spent,
                      item.scheduled,
                      item.savings,
                    ]),
                    1,
                  );

                  return (
                    <div key={monthlyBudget.labels[index]} className="flex flex-1 flex-col items-center gap-2">
                      <div className="flex h-52 w-full flex-col justify-end overflow-hidden rounded-2xl bg-surface-elevated/60">
                        {[entry.income, entry.spent, entry.scheduled, entry.savings].map((height, segmentIndex) => (
                          <div
                            key={segmentIndex}
                            className={`w-full ${budgetLegend[segmentIndex]?.colorClass ?? "bg-primary"}`}
                            style={{ height: `${(height / max) * 100}%` }}
                          />
                        ))}
                      </div>
                      <Text as="span" className="text-[11px] text-muted">{monthlyBudget.labels[index]}</Text>
                    </div>
                  );
                })}
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-4">
                {budgetLegend.map((item) => (
                  <div key={item.label} className="rounded-2xl bg-surface-elevated p-3">
                    <div className="flex items-center gap-2 text-xs text-muted">
                      <Text as="span" className={`size-2.5 rounded-full ${item.colorClass}`} />
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </Card>

        <Card className="p-6">
          <div className="mb-6">
            <Text as="h2" className="text-lg font-semibold">Top spending</Text>
            <Text className="mt-1 text-sm text-muted">{spending.total} tracked this cycle</Text>
          </div>
          {isLoading ? (
            <ListSkeleton />
          ) : spending.categories.length === 0 ? (
            <WidgetEmptyState />
          ) : (
            <div className="space-y-4">
              {spending.categories.map((category) => (
                <div key={category.label}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <Text as="span" className="text-muted">{category.label}</Text>
                    <Text as="span">{category.amount}</Text>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-surface-elevated">
                    <div
                      className={`h-full rounded-full ${category.colorClass}`}
                      style={{ width: `${category.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

type MetricCardProps = {
  icon: ReactNode;
  isLoading: boolean;
  label: string;
  value?: string;
};

function MetricCard({ icon, isLoading, label, value }: MetricCardProps) {
  return (
    <Card className="p-5">
      <Text className="text-sm text-muted">{label}</Text>
      <div className="mt-3 flex items-end justify-between gap-3">
        {isLoading ? (
          <WidgetSkeleton className="h-9 w-32" />
        ) : (
          <Text className="text-3xl font-semibold">{value ?? "No Data yet"}</Text>
        )}
        {icon}
      </div>
    </Card>
  );
}

function ChartSkeleton() {
  return (
    <div className="flex h-64 items-end justify-between gap-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <WidgetSkeleton key={index} className="h-40 flex-1 rounded-2xl" />
      ))}
    </div>
  );
}

function ListSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <WidgetSkeleton key={index} className="h-8 rounded-full" />
      ))}
    </div>
  );
}
