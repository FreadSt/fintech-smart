'use client';

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Text } from "@/shared/text/Text";
import { Card } from "@/components/ui/Card";
import { IconButton } from "@/components/ui/IconButton";
import { formatKopecks } from "@/lib/monobank/money";
import type { BudgetData, Period } from "@/lib/monobank/view/dashboard";
import { PeriodSelect } from "@/components/dashboard/widgets/PeriodSelect";
import Link from "next/link";
import { WidgetEmptyState, WidgetSkeleton } from "./WidgetState";
const SEGMENT_KEYS = ['income', 'spent', 'scheduled', 'savings'] as const;
const emptyBudgetData: BudgetData = {
  daily: { labels: [], entries: [] },
  weekly: { labels: [], entries: [] },
  monthly: { labels: [], entries: [] },
};
const budgetLegend = [
  { label: "Income", colorClass: "bg-primary" },
  { label: "Spent", colorClass: "bg-[#9db800]" },
  { label: "Scheduled", colorClass: "bg-[#6b7a00]" },
  { label: "Savings", colorClass: "bg-accent-emerald" },
];
const skeletonLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

type BudgetCardProps = {
  isLoading?: boolean;
  currencyCode?: number;
  data?: BudgetData;
};

export function BudgetCard({
  currencyCode = 980,
  isLoading = false,
  data = emptyBudgetData,
}: BudgetCardProps) {
  const [period, setPeriod] = useState<Period>('monthly');
  const { labels, entries } = data[period];
  const visibleSegmentKeys = SEGMENT_KEYS.filter((key) =>
    entries.some((entry) => entry[key] > 0),
  );
  const values = entries.flatMap((entry) =>
    visibleSegmentKeys.map((key) => entry[key]),
  );

  const maxValue = values.length > 0 ? Math.max(...values) : 0;
  const hasData = labels.length > 0 && entries.length > 0 && maxValue > 0;

  return (
    <Card
      className="p-6"
      headerAction={
        <div className="inline-flex gap-2">
          <PeriodSelect value={period} onChange={setPeriod} />
          <Link href="/analytics">
            <IconButton label="View budget details" variant="surface" size="sm">
              <ArrowUpRight />
            </IconButton>
          </Link>
        </div>
      }
    >
      <div className="mb-6">
        <Text as="h2" className="text-lg font-semibold">Budget</Text>
      </div>

      {isLoading ? (
        <BudgetSkeleton />
      ) : !hasData ? (
        <WidgetEmptyState className="h-44" />
      ) : (
        <>
          <div className="flex h-44 items-end justify-between gap-3">
            {entries.map((entry, colIdx) => (
              <div key={labels[colIdx]} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex h-36 w-full flex-col justify-end gap-1 rounded-md bg-surface-elevated/60">
                  {visibleSegmentKeys.map((key) => {
                    const segmentIndex = SEGMENT_KEYS.indexOf(key);
                    const legend = budgetLegend[segmentIndex];
                    const value = entry[key];
                    const tooltip = `${legend?.label ?? key}: ${formatKopecks(
                      value,
                      currencyCode,
                    )}`;

                    return (
                      <div
                        key={key}
                        className={`group relative w-full rounded-md ${legend?.colorClass ?? 'bg-primary'}`}
                        style={{ height: `${(value / maxValue) * 100}%` }}
                        title={tooltip}
                      >
                        <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded-md border border-border bg-surface px-2 py-1 text-[11px] font-medium text-foreground shadow-xl group-hover:block group-focus-visible:block">
                          {tooltip}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <Text as="span" className="text-[11px] text-muted">{labels[colIdx]}</Text>
              </div>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap gap-4">
            {visibleSegmentKeys.map((key) => {
              const item = budgetLegend[SEGMENT_KEYS.indexOf(key)];

              return item ? (
                <div key={item.label} className="flex items-center gap-2 text-xs text-muted">
                  <Text as="span" className={`size-2.5 rounded-full ${item.colorClass}`} />
                  {item.label}
                </div>
              ) : null;
            })}
          </div>
        </>
      )}
    </Card>
  );
}

function BudgetSkeleton() {
  return (
    <>
      <div className="flex h-44 items-end justify-between gap-3">
        {skeletonLabels.map((label, index) => (
          <div key={label} className="flex flex-1 flex-col items-center gap-2">
            <div className="flex h-36 w-full items-end rounded-md bg-surface-elevated/60">
              <WidgetSkeleton
                className="w-full rounded-md"
                style={{ height: `${45 + (index % 4) * 12}%` }}
              />
            </div>
            <WidgetSkeleton className="h-3 w-8" />
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap gap-4">
        {budgetLegend.map((item) => (
          <WidgetSkeleton key={item.label} className="h-4 w-20" />
        ))}
      </div>
    </>
  );
}
