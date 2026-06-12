import { CalendarDays, Target, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/Card";
import {
  budgetLegend,
  dashboardSummary,
  goals,
  scheduledPayments,
} from "@/lib/dashboard/mock-data";

export default function PlanPage() {
  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm text-muted">Targets</p>
        <h1 className="text-2xl font-semibold tracking-tight">Plan</h1>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Savings goals</h2>
            <Target className="size-5 text-primary" />
          </div>
          <div className="space-y-5">
            {goals.map((goal) => (
              <div key={goal.name}>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium">{goal.name}</p>
                    <p className="text-sm text-muted">
                      {goal.saved} of {goal.target}
                    </p>
                  </div>
                  <span className="text-sm font-semibold">{goal.progress}%</span>
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
        </Card>

        <Card className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Monthly allocation</h2>
            <TrendingUp className="size-5 text-secondary" />
          </div>
          <div className="space-y-3">
            {budgetLegend.map((item) => (
              <div key={item.label} className="flex items-center justify-between rounded-2xl bg-surface-elevated p-4">
                <div className="flex items-center gap-2 text-sm text-muted">
                  <span className={`size-2.5 rounded-full ${item.colorClass}`} />
                  {item.label}
                </div>
                <p className="font-semibold">{item.amount}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <p className="text-sm text-muted">Savings balance</p>
          <p className="mt-2 text-4xl font-semibold">{dashboardSummary.savings}</p>
          <p className="mt-3 inline-flex items-center gap-1 rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">
            <TrendingUp className="size-3" />
            {dashboardSummary.savingsTrend}
          </p>
        </Card>
        <Card className="p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Upcoming obligations</h2>
            <CalendarDays className="size-5 text-primary" />
          </div>
          <div className="space-y-3">
            {scheduledPayments.slice(0, 2).map((payment) => (
              <div key={payment.name} className="flex items-center justify-between text-sm">
                <span className="text-muted">{payment.name}</span>
                <span>{payment.amount}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
