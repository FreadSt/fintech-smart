import { CalendarDays, Target, TrendingUp } from "lucide-react";
import { Text } from "@/shared/text/Text";
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
        <Text className="text-sm text-muted">Targets</Text>
        <Text as="h1" className="text-2xl font-semibold tracking-tight">Plan</Text>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <Text as="h2" className="text-lg font-semibold">Savings goals</Text>
            <Target className="size-5 text-primary" />
          </div>
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
        </Card>

        <Card className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <Text as="h2" className="text-lg font-semibold">Monthly allocation</Text>
            <TrendingUp className="size-5 text-secondary" />
          </div>
          <div className="space-y-3">
            {budgetLegend.map((item) => (
              <div key={item.label} className="flex items-center justify-between rounded-2xl bg-surface-elevated p-4">
                <div className="flex items-center gap-2 text-sm text-muted">
                  <Text as="span" className={`size-2.5 rounded-full ${item.colorClass}`} />
                  {item.label}
                </div>
                <Text className="font-semibold">{item.amount}</Text>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <Text className="text-sm text-muted">Savings balance</Text>
          <Text className="mt-2 text-4xl font-semibold">{dashboardSummary.savings}</Text>
          <Text className="mt-3 inline-flex items-center gap-1 rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">
            <TrendingUp className="size-3" />
            {dashboardSummary.savingsTrend}
          </Text>
        </Card>
        <Card className="p-6">
          <div className="mb-5 flex items-center justify-between">
            <Text as="h2" className="text-lg font-semibold">Upcoming obligations</Text>
            <CalendarDays className="size-5 text-primary" />
          </div>
          <div className="space-y-3">
            {scheduledPayments.slice(0, 2).map((payment) => (
              <div key={payment.name} className="flex items-center justify-between text-sm">
                <Text as="span" className="text-muted">{payment.name}</Text>
                <Text as="span">{payment.amount}</Text>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
