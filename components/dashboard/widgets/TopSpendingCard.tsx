import { ArrowUpRight } from "lucide-react";
import { Text } from "@/shared/text/Text";
import { Card } from "@/components/ui/Card";
import { IconButton } from "@/components/ui/IconButton";
import { spendingCategories, spendingTotal } from "@/lib/dashboard/mock-data";
import Link from "next/link";
import { WidgetEmptyState, WidgetSkeleton } from "./WidgetState";

const segmentGap = 5;

type SpendingCategory = (typeof spendingCategories)[number];

function getSpendingArcs(categories: SpendingCategory[]) {
  const availableAngle = 180 - segmentGap * (categories.length - 1);

  return categories.map((segment, index) => {
    const previousPercentage = categories
      .slice(0, index)
      .reduce((total, item) => total + item.percentage, 0);
    const startAngle =
      180 + (previousPercentage / 100) * availableAngle + index * segmentGap;
    const endAngle = startAngle + (segment.percentage / 100) * availableAngle;

    return { ...segment, startAngle, endAngle };
  });
}

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

type TopSpendingCardProps = {
  isLoading?: boolean;
  categories?: SpendingCategory[];
  total?: string;
};

export function TopSpendingCard({
  isLoading = false,
  categories = spendingCategories,
  total = spendingTotal,
}: TopSpendingCardProps) {
  const spendingArcs = getSpendingArcs(categories);

  return (
    <Card
      className="p-6"
      headerAction={
        <Link href="/analytics">
          <IconButton label="View spending details" variant="surface" size="sm">
            <ArrowUpRight />
          </IconButton>
        </Link>
      }
    >
      <Text as="h2" className="mb-6 text-lg font-semibold">Top spending</Text>

      {isLoading ? (
        <TopSpendingSkeleton />
      ) : categories.length === 0 ? (
        <WidgetEmptyState className="h-54" />
      ) : (
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
            <Text className="pb-1 text-center text-2xl font-bold">{total}</Text>
            <div className="space-y-1">
              {categories.map((category) => (
                <div
                  key={category.label}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-2 text-muted">
                    <Text as="span" className={`size-1.5 rounded-full ${category.colorClass}`} />
                    <Text as="span">{category.label}</Text>
                  </div>
                  <Text as="span">{category.percentage}%</Text>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

function TopSpendingSkeleton() {
  return (
    <div className="flex h-54 flex-col justify-end">
      <WidgetSkeleton className="mx-auto mb-6 h-24 w-44 rounded-t-full" />
      <WidgetSkeleton className="mx-auto mb-3 h-8 w-24" />
      <div className="space-y-2">
        {spendingCategories.map((category) => (
          <div key={category.label} className="flex items-center justify-between">
            <WidgetSkeleton className="h-4 w-28" />
            <WidgetSkeleton className="h-4 w-8" />
          </div>
        ))}
      </div>
    </div>
  );
}
