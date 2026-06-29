'use client';

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Text } from "@/shared/text/Text";
import { Card } from "@/components/ui/Card";
import { IconButton } from "@/components/ui/IconButton";
import { budgetData, budgetLegend, type Period } from "@/lib/dashboard/mock-data";
import { PeriodSelect } from "@/components/dashboard/widgets/PeriodSelect";
import Link from "next/link";
import { WidgetEmptyState, WidgetSkeleton } from "./WidgetState";
const SEGMENT_KEYS = ['income', 'spent', 'scheduled', 'savings'] as const;

type BudgetCardProps = {
  isLoading?: boolean;
  data?: typeof budgetData;
};

export function BudgetCard({
  isLoading = false,
  data = budgetData,
}: BudgetCardProps) {
  const [period, setPeriod] = useState<Period>('monthly');
  const { labels, entries } = data[period];
  const values = entries.flatMap(e => SEGMENT_KEYS.map(k => e[k]));

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
                <div className="flex h-36 w-full flex-col justify-end gap-1 overflow-hidden rounded-md bg-surface-elevated/60">
                  {SEGMENT_KEYS.map((key, segIdx) => (
                    <div
                      key={key}
                      className={`w-full rounded-md ${budgetLegend[segIdx]?.colorClass ?? 'bg-primary'}`}
                      style={{ height: `${(entry[key] / maxValue) * 100}%` }}
                    />
                  ))}
                </div>
                <Text as="span" className="text-[11px] text-muted">{labels[colIdx]}</Text>
              </div>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap gap-4">
            {budgetLegend.map((item) => (
              <div key={item.label} className="flex items-center gap-2 text-xs text-muted">
                <Text as="span" className={`size-2.5 rounded-full ${item.colorClass}`} />
                {item.label}
              </div>
            ))}
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
        {budgetData.monthly.labels.map((label, index) => (
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
