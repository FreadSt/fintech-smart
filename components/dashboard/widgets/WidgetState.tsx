import type { ComponentPropsWithoutRef } from "react";
import { Text } from "@/shared/text/Text";
import { cn } from "@/lib/utils/cn";

type WidgetSkeletonProps = ComponentPropsWithoutRef<"div">;

export function WidgetSkeleton({ className, ...props }: WidgetSkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "animate-pulse rounded-md bg-surface-elevated/80",
        className,
      )}
      {...props}
    />
  );
}

type WidgetEmptyStateProps = {
  className?: string;
};

export function WidgetEmptyState({ className }: WidgetEmptyStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-32 items-center justify-center rounded-card border border-dashed border-border bg-surface-elevated/50 p-6 text-center",
        className,
      )}
    >
      <Text className="text-sm font-medium text-muted">No Data yet</Text>
    </div>
  );
}
