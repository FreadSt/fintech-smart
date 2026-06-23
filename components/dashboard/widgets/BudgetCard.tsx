'use client';

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Text } from "@/shared/text/Text";
import { Card } from "@/components/ui/Card";
import { IconButton } from "@/components/ui/IconButton";
import { budgetData, budgetLegend, type Period } from "@/lib/dashboard/mock-data";
import { PeriodSelect } from "@/components/dashboard/widgets/PeriodSelect";
import Link from "next/link";
const SEGMENT_KEYS = ['income', 'spent', 'scheduled', 'savings'] as const;

export function BudgetCard() {
  const [period, setPeriod] = useState<Period>('monthly');
  const { labels, entries } = budgetData[period];

  const maxValue = Math.max(...entries.flatMap(e => SEGMENT_KEYS.map(k => e[k])));

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
    </Card>
  );
}