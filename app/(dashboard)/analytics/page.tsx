import { ArrowUpRight, TrendingDown, TrendingUp } from "lucide-react";
import { Text } from "@/shared/text/Text";
import { Card } from "@/components/ui/Card";
import {
  budgetLegend,
  budgetMonths,
  budgetSegments,
  dashboardSummary,
  spendingCategories,
  spendingTotal,
} from "@/lib/dashboard/mock-data";

export default function AnalyticsPage() {
  const netCashflow = "$670.05";

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
        <Card className="p-5">
          <Text className="text-sm text-muted">Income</Text>
          <div className="mt-3 flex items-end justify-between gap-3">
            <Text className="text-3xl font-semibold">{dashboardSummary.income}</Text>
            <Text as="span" className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2.5 py-1 text-xs font-semibold text-primary">
              <TrendingUp className="size-3" />
              {dashboardSummary.incomeTrend}
            </Text>
          </div>
        </Card>
        <Card className="p-5">
          <Text className="text-sm text-muted">Expense</Text>
          <div className="mt-3 flex items-end justify-between gap-3">
            <Text className="text-3xl font-semibold">{dashboardSummary.expense}</Text>
            <Text as="span" className="inline-flex items-center gap-1 rounded-full bg-secondary/15 px-2.5 py-1 text-xs font-semibold text-secondary">
              <TrendingDown className="size-3" />
              {dashboardSummary.expenseTrend}
            </Text>
          </div>
        </Card>
        <Card className="p-5">
          <Text className="text-sm text-muted">Net cashflow</Text>
          <div className="mt-3 flex items-end justify-between gap-3">
            <Text className="text-3xl font-semibold">{netCashflow}</Text>
            <ArrowUpRight className="size-5 text-primary" />
          </div>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.4fr_0.8fr]">
        <Card className="p-6">
          <div className="mb-6 flex items-center justify-between gap-3">
            <Text as="h2" className="text-lg font-semibold">Budget performance</Text>
            <Text className="text-sm text-muted">Jan-Aug</Text>
          </div>
          <div className="flex h-64 items-end justify-between gap-3">
            {budgetSegments.map((segments, index) => (
              <div key={budgetMonths[index]} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex h-52 w-full flex-col justify-end overflow-hidden rounded-2xl bg-surface-elevated/60">
                  {segments.map((height, segmentIndex) => (
                    <div
                      key={segmentIndex}
                      className={`w-full ${budgetLegend[segmentIndex]?.colorClass ?? "bg-primary"}`}
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>
                <Text as="span" className="text-[11px] text-muted">{budgetMonths[index]}</Text>
              </div>
            ))}
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-4">
            {budgetLegend.map((item) => (
              <div key={item.label} className="rounded-2xl bg-surface-elevated p-3">
                <div className="flex items-center gap-2 text-xs text-muted">
                  <Text as="span" className={`size-2.5 rounded-full ${item.colorClass}`} />
                  {item.label}
                </div>
                <Text className="mt-2 text-sm font-semibold">{item.amount}</Text>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="mb-6">
            <Text as="h2" className="text-lg font-semibold">Top spending</Text>
            <Text className="mt-1 text-sm text-muted">{spendingTotal} tracked this cycle</Text>
          </div>
          <div className="space-y-4">
            {spendingCategories.map((category) => (
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
        </Card>
      </div>
    </div>
  );
}
