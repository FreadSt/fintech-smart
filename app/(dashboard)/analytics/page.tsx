import { ArrowUpRight, TrendingDown, TrendingUp } from "lucide-react";
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
          <p className="text-sm text-muted">Overview</p>
          <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
        </div>
        <span className="w-fit rounded-full border border-border bg-surface px-4 py-2 text-sm text-muted">
          Monthly report
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-5">
          <p className="text-sm text-muted">Income</p>
          <div className="mt-3 flex items-end justify-between gap-3">
            <p className="text-3xl font-semibold">{dashboardSummary.income}</p>
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2.5 py-1 text-xs font-semibold text-primary">
              <TrendingUp className="size-3" />
              {dashboardSummary.incomeTrend}
            </span>
          </div>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-muted">Expense</p>
          <div className="mt-3 flex items-end justify-between gap-3">
            <p className="text-3xl font-semibold">{dashboardSummary.expense}</p>
            <span className="inline-flex items-center gap-1 rounded-full bg-secondary/15 px-2.5 py-1 text-xs font-semibold text-secondary">
              <TrendingDown className="size-3" />
              {dashboardSummary.expenseTrend}
            </span>
          </div>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-muted">Net cashflow</p>
          <div className="mt-3 flex items-end justify-between gap-3">
            <p className="text-3xl font-semibold">{netCashflow}</p>
            <ArrowUpRight className="size-5 text-primary" />
          </div>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.4fr_0.8fr]">
        <Card className="p-6">
          <div className="mb-6 flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">Budget performance</h2>
            <p className="text-sm text-muted">Jan-Aug</p>
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
                <span className="text-[11px] text-muted">{budgetMonths[index]}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-4">
            {budgetLegend.map((item) => (
              <div key={item.label} className="rounded-2xl bg-surface-elevated p-3">
                <div className="flex items-center gap-2 text-xs text-muted">
                  <span className={`size-2.5 rounded-full ${item.colorClass}`} />
                  {item.label}
                </div>
                <p className="mt-2 text-sm font-semibold">{item.amount}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold">Top spending</h2>
            <p className="mt-1 text-sm text-muted">{spendingTotal} tracked this cycle</p>
          </div>
          <div className="space-y-4">
            {spendingCategories.map((category) => (
              <div key={category.label}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-muted">{category.label}</span>
                  <span>{category.amount}</span>
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
