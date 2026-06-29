import { ArrowUpRight, TrendingUp } from "lucide-react";
import { Text } from "@/shared/text/Text";
import { Card } from "@/components/ui/Card";
import { IconButton } from "@/components/ui/IconButton";
import { dashboardSummary, goals } from "@/lib/dashboard/mock-data";
import Link from "next/link";
import { QuickTransferCard } from "./QiuckTransferCard";
import { WidgetEmptyState, WidgetSkeleton } from "./WidgetState";

type BottomRowCardsProps = {
  isLoading?: boolean;
  summary?: typeof dashboardSummary | null;
  savingsGoals?: typeof goals;
};

export function BottomRowCards({
  isLoading = false,
  summary = dashboardSummary,
  savingsGoals = goals,
}: BottomRowCardsProps) {
  const primaryGoal = savingsGoals[0];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

      <Card className="gap-3" headerAction={
        <Link href="/plan">
          <IconButton label="View goal details" variant="surface" size="sm">
            <ArrowUpRight />
          </IconButton>
        </Link>
      }>
        <Text as="h2" className="mb-2 text-lg font-semibold">Top spending</Text>
        <div className="grid grid-cols-2 gap-3">
          <Card className=" overflow-hidden p-0">
            {isLoading ? (
              <div className="p-3">
                <WidgetSkeleton className="h-4 w-16" />
                <WidgetSkeleton className="mt-3 h-6 w-28" />
                <WidgetSkeleton className="mt-3 h-4 w-24" />
              </div>
            ) : primaryGoal ? (
              <div className=" p-3">
                <div
                  className="absolute inset-y-0 left-0 bg-primary/30"
                  style={{ width: `${primaryGoal.progress}%` }}
                />

                <div className="relative z-10">
                  <Text className="text-sm text-muted">My Goal</Text>
                  <Text className="text-lg font-semibold">
                    {primaryGoal.progress}% Completed
                  </Text>
                  <Text className="text-sm text-muted">
                    {primaryGoal.saved} / {primaryGoal.target}
                  </Text>
                </div>
              </div>
            ) : (
              <WidgetEmptyState className="min-h-28 rounded-none border-0" />
            )}
          </Card>

          <Card
            className="p-3"
          >
            <Text className="text-sm text-muted">Savings</Text>
            {isLoading ? (
              <div className="mt-3 flex gap-3">
                <WidgetSkeleton className="h-8 w-24" />
                <WidgetSkeleton className="h-6 w-14 rounded-full" />
              </div>
            ) : !summary ? (
              <WidgetEmptyState className="mt-3 min-h-20" />
            ) : (
              <div className="mt-3 flex flex-col items-start justify-between gap-3">
                <div className="flex gap-3">
                  <Text className="text-2xl font-semibold">{summary.savings}</Text>
                  <Text as="span" className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-1.5 text-xs font-semibold text-primary">
                    <TrendingUp className="size-3" />
                    {summary.savingsTrend}
                  </Text>
                </div>
              </div>
            )}
          </Card>
        </div>
      </Card>

      <QuickTransferCard isLoading={isLoading} />
    </div>
  );
}
