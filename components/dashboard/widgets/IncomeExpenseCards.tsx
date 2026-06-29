import { ArrowUpRight, TrendingDown, TrendingUp } from "lucide-react";
import { Text } from "@/shared/text/Text";
import { Card } from "@/components/ui/Card";
import { IconButton } from "@/components/ui/IconButton";
import { dashboardSummary } from "@/lib/dashboard/mock-data";
import Link from "next/link";
import { WidgetEmptyState, WidgetSkeleton } from "./WidgetState";

type StatCardProps = {
  label: string;
  amount: string;
  trend: string;
  trendUp?: boolean;
};

function StatCard({ label, amount, trend, trendUp = true }: StatCardProps) {
  return (
    <Card
      className="flex flex-1 flex-col justify-between p-3"
    >
      <Text className="text-sm text-muted">{label}</Text>
      <div className="mt-1 flex items-end justify-between gap-3">
        <Text className="text-2xl font-semibold tracking-tight">{amount}</Text>
        <Text as="span" className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2.5 py-1 text-xs font-semibold text-[#e6ff4b]">
          {trendUp ? (
            <TrendingUp className="size-3" />
          ) : (
            <TrendingDown className="size-3" />
          )}
          {trend}
        </Text>
      </div>
    </Card>
  );
}

type IncomeExpenseCardsProps = {
  isLoading?: boolean;
  summary?: typeof dashboardSummary | null;
};

export function IncomeExpenseCards({
  isLoading = false,
  summary = dashboardSummary,
}: IncomeExpenseCardsProps) {
  return (
    <div className="flex h-full flex-col">
      <Card 
        className="flex flex-col"
        headerAction={
          <Link href='/analytics'>
            <IconButton label="View more" variant="surface" size="sm">
              <ArrowUpRight />
            </IconButton>
          </Link>
        }
      >
        <div className="mb-6 flex items-center justify-between">
          <Text as="h2" className="text-lg font-semibold">Income & Expenses</Text>
        </div>
        {isLoading ? (
          <div className="flex flex-col gap-3">
            <StatCardSkeleton />
            <StatCardSkeleton />
          </div>
        ) : !summary ? (
          <WidgetEmptyState />
        ) : (
          <div className="flex flex-col gap-3">
            <StatCard
              label="Income"
              amount={summary.income}
              trend={summary.incomeTrend}
              trendUp
            />
            <StatCard
              label="Expense"
              amount={summary.expense}
              trend={summary.expenseTrend}
              trendUp={false}
            />
          </div>
        )}
      </Card>
    </div>
  );
}

function StatCardSkeleton() {
  return (
    <Card className="flex flex-1 flex-col justify-between p-3">
      <WidgetSkeleton className="h-4 w-20" />
      <div className="mt-3 flex items-end justify-between gap-3">
        <WidgetSkeleton className="h-8 w-28" />
        <WidgetSkeleton className="h-6 w-14 rounded-full" />
      </div>
    </Card>
  );
}
