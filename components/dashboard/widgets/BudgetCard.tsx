import { ArrowUpRight, ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { IconButton } from "@/components/ui/IconButton";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"];
const barSegments = [
  [55, 25, 12, 8],
  [48, 30, 14, 8],
  [62, 18, 12, 8],
  [44, 28, 18, 10],
  [58, 22, 12, 8],
  [52, 26, 14, 8],
  [66, 16, 10, 8],
  [50, 24, 16, 10],
];

const legend = [
  { label: "Income", color: "bg-primary" },
  { label: "Spent", color: "bg-[#9db800]" },
  { label: "Scheduled", color: "bg-[#6b7a00]" },
  { label: "Savings", color: "bg-accent-emerald" },
];

export function BudgetCard() {
  return (
    <Card
      className="p-6"
      headerAction={
        <IconButton label="View budget details" variant="surface" size="sm">
          <ArrowUpRight />
        </IconButton>
      }
    >
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Budget</h2>
        <button
          type="button"
          className="inline-flex items-center gap-1 rounded-full border border-border bg-surface-elevated px-3 py-1.5 text-xs text-muted"
        >
          Monthly
          <ChevronDown className="size-3.5" />
        </button>
      </div>

      <div className="flex h-44 items-end justify-between gap-3">
        {barSegments.map((segments, index) => (
          <div key={months[index]} className="flex flex-1 flex-col items-center gap-2">
            <div className="flex h-36 w-full flex-col justify-end overflow-hidden rounded-2xl bg-surface-elevated/60">
              {segments.map((height, segmentIndex) => (
                <div
                  key={segmentIndex}
                  className={`w-full ${legend[segmentIndex]?.color ?? "bg-primary"}`}
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
            <span className="text-[11px] text-muted">{months[index]}</span>
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap gap-4">
        {legend.map((item) => (
          <div key={item.label} className="flex items-center gap-2 text-xs text-muted">
            <span className={`size-2.5 rounded-full ${item.color}`} />
            {item.label}
          </div>
        ))}
      </div>
    </Card>
  );
}
