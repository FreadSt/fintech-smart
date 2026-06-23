'use client';

import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { Text } from "@/shared/text/Text";
import { Card } from "@/components/ui/Card";
import { IconButton } from "@/components/ui/IconButton";
import { quickTransfers } from "@/lib/dashboard/mock-data";

interface QuickTransfer {
  initials: string;
}

interface QuickTransferCardProps {
  transfers?: QuickTransfer[];
  refreshDuration?: number;
}

export function QuickTransferCard({
  transfers = quickTransfers,
  refreshDuration = 1800,
}: QuickTransferCardProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), refreshDuration);
  };

  return (
    <Card
      className="p-5"
      headerAction={
        <IconButton
          label="Refresh transfers"
          variant="surface"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw className={isRefreshing ? "animate-spin" : ""} />
        </IconButton>
      }
    >
      <Text className="mb-6 text-sm text-muted">Quick Transfer</Text>
      <div className="flex gap-3 justify-around">
        {isRefreshing
          ? transfers.map((_, index) => (
              <div
                key={index}
                className="size-15 animate-pulse rounded-full bg-surface-elevated"
                style={{ marginLeft: index === 0 ? 0 : -8 }}
              />
            ))
          : transfers.map((transfer, index) => (
              <div
                key={transfer.initials}
                className="flex size-15 items-center justify-center rounded-full border border-border bg-surface-elevated text-xs font-semibold"
                style={{ marginLeft: index === 0 ? 0 : -8 }}
              >
                {transfer.initials}
              </div>
            ))}
      </div>
    </Card>
  );
}