import { ArrowUpRight, RefreshCw, TrendingUp } from "lucide-react";
import { Text } from "@/shared/text/Text";
import { Card } from "@/components/ui/Card";
import { IconButton } from "@/components/ui/IconButton";
import { dashboardSummary, goals, quickTransfers } from "@/lib/dashboard/mock-data";
import Link from "next/link";
import { QuickTransferCard } from "./QiuckTransferCard";

export function BottomRowCards() {
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
            {goals.slice(0, 1).map((goal) => (
              <div key={goal.name} className=" p-3">
                <div
                  className="absolute inset-y-0 left-0 bg-primary/30"
                  style={{ width: `${goal.progress}%` }}
                />

                <div className="relative z-10">
                  <Text className="text-sm text-muted">My Goal</Text>
                  <Text className="text-lg font-semibold">
                    {goal.progress}% Completed
                  </Text>
                  <Text className="text-sm text-muted">
                    {goal.saved} / {goal.target}
                  </Text>
                </div>
              </div>
            ))}
          </Card>

          <Card
            className="p-3"
          >
            <Text className="text-sm text-muted">Savings</Text>
            <div className="mt-3 flex flex-col items-start justify-between gap-3">
              <div className="flex gap-3">
                <Text className="text-2xl font-semibold">{dashboardSummary.savings}</Text>
                <Text as="span" className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-1.5 text-xs font-semibold text-primary">
                  <TrendingUp className="size-3" />
                  {dashboardSummary.savingsTrend}
                </Text>
              </div>
            </div>
          </Card>
        </div>
      </Card>

      <QuickTransferCard />
    </div>
  );
}
