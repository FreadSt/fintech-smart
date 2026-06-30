"use client";

import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { Button } from "@/shared/button/Button";
import { Text } from "@/shared/text/Text";
import { Card } from "@/components/ui/Card";
import { IconButton } from "@/components/ui/IconButton";
import { cn } from "@/lib/utils/cn";
import Link from "next/link";
import { WidgetEmptyState, WidgetSkeleton } from "./WidgetState";

const tabs = ["All", "Income", "Spending"] as const;

type Tab = (typeof tabs)[number];

type Transaction = {
  name: string;
  date: string;
  amount: string;
  positive: boolean;
  initial: string;
};

type TransactionHistoryCardProps = {
  isLoading?: boolean;
  items?: Transaction[];
};

export function TransactionHistoryCard({
  isLoading = false,
  items = [],
}: TransactionHistoryCardProps) {
  const [activeTab, setActiveTab] = useState<Tab>("All");
  const visibleTransactions = items.filter((transaction) => {
    if (activeTab === "Income") {
      return transaction.positive;
    }

    if (activeTab === "Spending") {
      return !transaction.positive;
    }

    return true;
  });

  return (
    <Card
      className="flex h-full flex-col p-6 overflow-y-auto"
      headerAction={
        <Link href="/transactions">
        <IconButton 
          label="View all transactions" 
          variant="surface" 
          size="sm"
          >
          <ArrowUpRight />
        </IconButton>
        </Link>
      }
    >
      <Text as="h2" className="mb-4 text-lg font-semibold">Transaction history</Text>

      <div className="mb-5 inline-flex rounded-full border border-border bg-surface-elevated p-1">
        {tabs.map((tab) => (
          <Button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={cn(
              "rounded-full px-4 py-1.5 text-xs font-medium transition-colors",
              activeTab === tab
                ? "bg-primary text-black"
                : "text-muted hover:text-foreground",
            )}
          >
            {tab}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <TransactionHistorySkeleton />
      ) : visibleTransactions.length === 0 ? (
        <WidgetEmptyState className="flex-1" />
      ) : (
        <div className="flex flex-1 flex-col gap-4">
          {visibleTransactions.map((transaction) => (
            <div
              key={`${transaction.name}-${transaction.date}`}
              className="flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-2xl bg-surface-elevated text-xs font-semibold text-muted">
                  {transaction.initial}
                </div>
                <div>
                  <Text className="text-sm font-medium">{transaction.name}</Text>
                  <Text className="text-xs text-muted">{transaction.date}</Text>
                </div>
              </div>
              <Text
                className={cn(
                  "text-sm font-semibold",
                  transaction.positive ? "text-primary" : "text-foreground",
                )}
              >
                {transaction.amount}
              </Text>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

function TransactionHistorySkeleton() {
  return (
    <div className="flex flex-1 flex-col gap-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <WidgetSkeleton className="size-10 rounded-2xl" />
            <div className="space-y-2">
              <WidgetSkeleton className="h-4 w-24" />
              <WidgetSkeleton className="h-3 w-20" />
            </div>
          </div>
          <WidgetSkeleton className="h-4 w-14" />
        </div>
      ))}
    </div>
  );
}
