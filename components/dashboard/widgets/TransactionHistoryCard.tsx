"use client";

import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { Button } from "@/shared/button/Button";
import { Text } from "@/shared/text/Text";
import { Card } from "@/components/ui/Card";
import { IconButton } from "@/components/ui/IconButton";
import { transactions } from "@/lib/dashboard/mock-data";
import { cn } from "@/lib/utils/cn";

const tabs = ["All", "Income", "Spending"] as const;

type Tab = (typeof tabs)[number];

export function TransactionHistoryCard() {
  const [activeTab, setActiveTab] = useState<Tab>("All");
  const visibleTransactions = transactions.filter((transaction) => {
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
      className="flex h-full flex-col p-6"
      headerAction={
        <IconButton label="View all transactions" variant="surface" size="sm">
          <ArrowUpRight />
        </IconButton>
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

      <div className="flex flex-1 flex-col gap-4">
        {visibleTransactions.map((transaction) => (
          <div
            key={transaction.name}
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
    </Card>
  );
}
