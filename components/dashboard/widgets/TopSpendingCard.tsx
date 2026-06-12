import { ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { IconButton } from "@/components/ui/IconButton";
import { spendingCategories, spendingTotal } from "@/lib/dashboard/mock-data";

const segmentGap = 5;
const availableAngle = 180 - segmentGap * (spendingCategories.length - 1);
const spendingArcs = spendingCategories.map((segment, index) => {
  const previousPercentage = spendingCategories
    .slice(0, index)
    .reduce((total, item) => total + item.percentage, 0);
  const startAngle =
    180 + (previousPercentage / 100) * availableAngle + index * segmentGap;
  const endAngle = startAngle + (segment.percentage / 100) * availableAngle;

  return { ...segment, startAngle, endAngle };
});

function getArcPath(startAngle: number, endAngle: number, radius = 66) {
  const center = 80;
  const startRadians = (startAngle * Math.PI) / 180;
  const endRadians = (endAngle * Math.PI) / 180;
  const startX = center + radius * Math.cos(startRadians);
  const startY = center + radius * Math.sin(startRadians);
  const endX = center + radius * Math.cos(endRadians);
  const endY = center + radius * Math.sin(endRadians);

  return `M ${startX} ${startY} A ${radius} ${radius} 0 0 1 ${endX} ${endY}`;
}

export function TopSpendingCard() {
  return (
    <Card
      className="p-6"
      headerAction={
        <IconButton label="View spending details" variant="surface" size="sm">
          <ArrowUpRight />
        </IconButton>
      }
    >
      <h2 className="mb-6 text-lg font-semibold">Top spending</h2>

      <div className="relative flex h-54 w-full items-end justify-center">
        <svg
          aria-label="Top spending by category"
          className="absolute inset-x-0 top-0 h-24 w-full overflow-visible"
          role="img"
          viewBox="0 0 160 94"
        >
          {spendingArcs.map((segment) => (
            <g
              key={segment.label}
              className="origin-center cursor-pointer transition-transform duration-200 ease-out hover:scale-110 focus-within:scale-110"
            >
              <path
                d={getArcPath(segment.startAngle, segment.endAngle, 66)}
                fill="none"
                stroke={segment.color}
                strokeWidth="48"
                opacity="0.1"
              />
              <path
                d={getArcPath(segment.startAngle, segment.endAngle, 86)}
                fill="none"
                stroke={segment.color}
                strokeWidth="5"
                tabIndex={0}
              >
                <title>{`${segment.label}: ${segment.percentage}%`}</title>
              </path>
            </g>
          ))}
        </svg>

        <div className="w-full">
          <p className="pb-1 text-center text-2xl font-bold">{spendingTotal}</p>
          <div className="space-y-1">
            {spendingCategories.map((category) => (
              <div
                key={category.label}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-2 text-muted">
                  <span className={`size-1.5 rounded-full ${category.colorClass}`} />
                  <span>{category.label}</span>
                </div>
                <span>{category.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
