'use client';

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/shared/button/Button";
import type { Period } from "@/lib/dashboard/mock-data";
import { DropdownMenu, DropdownMenuItem } from "@/shared/menu-dropdown/DropdownMenu";

const PERIOD_LABELS: Record<Period, string> = {
  daily:   'Daily',
  weekly:  'Weekly',
  monthly: 'Monthly',
};

const PERIODS = Object.keys(PERIOD_LABELS) as Period[];

interface PeriodSelectProps {
  value: Period;
  onChange: (period: Period) => void;
}

export function PeriodSelect({ value, onChange }: PeriodSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <Button
        type="button"
        className="inline-flex items-center gap-1 rounded-full border border-border bg-surface-elevated px-3 py-1.5 text-xs text-muted"
        onClick={() => setOpen(prev => !prev)}
      >
        {PERIOD_LABELS[value]}
        <ChevronDown
          className={cn("size-3.5 transition-transform duration-200", open && "rotate-180")}
        />
      </Button>

      <DropdownMenu open={open} className="right-0 top-full mt-2 min-w-[8rem]">
        {PERIODS.map((period) => (
          <DropdownMenuItem
            key={period}
            active={value === period}
            onClick={() => { onChange(period); setOpen(false); }}
          >
            {PERIOD_LABELS[period]}
          </DropdownMenuItem>
        ))}
      </DropdownMenu>
    </div>
  );
}