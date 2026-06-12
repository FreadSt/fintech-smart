import { ArrowUpRight, TrendingDown, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { IconButton } from "@/components/ui/IconButton";
import { dashboardSummary } from "@/lib/dashboard/mock-data";

type StatCardProps = {
  label: string;
  amount: string;
  trend: string;
  trendUp?: boolean;
};

function StatCard({ label, amount, trend, trendUp = true }: StatCardProps) {
  return (
    <Card
      className="flex flex-1 flex-col justify-between p-5"
      headerAction={
        <IconButton label={`View ${label.toLowerCase()}`} variant="surface" size="sm">
          <ArrowUpRight />
        </IconButton>
      }
    >
      <p className="text-sm text-muted">{label}</p>
      <div className="mt-3 flex items-end justify-between gap-3">
        <p className="text-2xl font-semibold tracking-tight">{amount}</p>
        <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2.5 py-1 text-xs font-semibold text-[#e6ff4b]">
          {trendUp ? (
            <TrendingUp className="size-3" />
          ) : (
            <TrendingDown className="size-3" />
          )}
          {trend}
        </span>
      </div>
    </Card>
  );
}

export function IncomeExpenseCards() {
  return (
    <div className="flex h-full flex-col gap-4">
      <StatCard
        label="Income"
        amount={dashboardSummary.income}
        trend={dashboardSummary.incomeTrend}
        trendUp
      />
      <StatCard
        label="Expense"
        amount={dashboardSummary.expense}
        trend={dashboardSummary.expenseTrend}
        trendUp={false}
      />
    </div>
  );
}
