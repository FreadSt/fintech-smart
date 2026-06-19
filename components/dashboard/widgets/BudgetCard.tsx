import { ArrowUpRight, ChevronDown } from "lucide-react";
import { Button } from "@/shared/button/Button";
import { Text } from "@/shared/text/Text";
import { Card } from "@/components/ui/Card";
import { IconButton } from "@/components/ui/IconButton";
import { budgetLegend, budgetMonths, budgetSegments } from "@/lib/dashboard/mock-data";

export function BudgetCard() {
  return (
    <Card
      className="p-6"
      headerAction={
        <div className="inline-flex gap-2">
          <Button
            type="button"
            className="inline-flex items-center gap-1 rounded-full border border-border bg-surface-elevated px-3 py-1.5 text-xs text-muted"
          >
            Monthly
            <ChevronDown className="size-3.5" />
          </Button>
          <IconButton label="View budget details" variant="surface" size="sm">
            <ArrowUpRight />
          </IconButton>
        </div>
      }
    >
      <div className="mb-6 flex items-center justify-between">
        <Text as="h2" className="text-lg font-semibold">Budget</Text>
      </div>

      <div className="flex h-44 items-end justify-between gap-3">
        {budgetSegments.map((segments, index) => (
          <div key={budgetMonths[index]} className="flex flex-1 flex-col items-center gap-2">
            <div className="flex h-36 w-full flex-col justify-end overflow-hidden rounded-md bg-surface-elevated/60 gap-1">
              {segments.map((height, segmentIndex) => (
                <div
                  key={segmentIndex}
                  className={`w-full rounded-md ${budgetLegend[segmentIndex]?.colorClass ?? "bg-primary"}`}
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
            <Text as="span" className="text-[11px] text-muted">{budgetMonths[index]}</Text>
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
