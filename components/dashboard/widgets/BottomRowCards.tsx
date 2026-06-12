import { ArrowUpRight, RefreshCw, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { IconButton } from "@/components/ui/IconButton";
import { dashboardSummary, goals, quickTransfers } from "@/lib/dashboard/mock-data";

export function BottomRowCards() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <Card
        className="overflow-hidden p-0"
        headerAction={
          <IconButton
            label="View goal details"
            variant="surface"
            size="sm"
            className="right-4 top-4"
          >
            <ArrowUpRight />
          </IconButton>
        }
      >
        {goals.slice(0, 1).map((goal) => (
          <div key={goal.name} className="relative p-5">
            <div
              className="absolute inset-0 bg-primary/30"
              style={{ width: `${goal.progress}%` }}
            />
            <div className="relative">
              <p className="text-sm text-muted">My Goal</p>
              <p className="mt-2 text-lg font-semibold">{goal.progress}% Completed</p>
              <p className="mt-1 text-sm text-muted">
                {goal.saved} / {goal.target}
              </p>
            </div>
          </div>
        ))}
      </Card>

      <Card
        className="p-5"
        headerAction={
          <IconButton label="View savings details" variant="surface" size="sm">
            <ArrowUpRight />
          </IconButton>
        }
      >
        <p className="text-sm text-muted">Savings</p>
        <div className="mt-3 flex items-end justify-between gap-3">
          <p className="text-2xl font-semibold">{dashboardSummary.savings}</p>
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2.5 py-1 text-xs font-semibold text-primary">
            <TrendingUp className="size-3" />
            {dashboardSummary.savingsTrend}
          </span>
        </div>
      </Card>

      <Card
        className="p-5"
        headerAction={
          <IconButton label="Refresh transfers" variant="surface" size="sm">
            <RefreshCw />
          </IconButton>
        }
      >
        <p className="mb-4 text-sm text-muted">Quick Transfer</p>
        <div className="flex items-center gap-3">
          {quickTransfers.map((transfer, index) => (
            <div
              key={transfer.initials}
              className="flex size-11 items-center justify-center rounded-full border border-border bg-surface-elevated text-xs font-semibold"
              style={{ marginLeft: index === 0 ? 0 : -8 }}
            >
              {transfer.initials}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
