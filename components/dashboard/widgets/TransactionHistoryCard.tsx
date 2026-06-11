"use client";

import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { IconButton } from "@/components/ui/IconButton";
import { cn } from "@/lib/utils/cn";

const tabs = ["All", "Income", "Spending"] as const;

type Tab = (typeof tabs)[number];

const transactions = [
  {
    name: "Paypal",
    date: "Today, 12:32 AM",
    amount: "-$12.89",
    positive: false,
    initial: "P",
  },
  {
    name: "Apple",
    date: "Yesterday, 09:15 PM",
    amount: "-$4.99",
    positive: false,
    initial: "A",
  },
  {
    name: "Adobe",
    date: "Mar 12, 08:00 AM",
    amount: "+$54.99",
    positive: true,
    initial: "Ad",
  },
  {
    name: "Walmart",
    date: "Mar 11, 06:42 PM",
    amount: "-$86.20",
    positive: false,
    initial: "W",
  },
  {
    name: "Chase",
    date: "Mar 10, 02:18 PM",
    amount: "+$1,200.00",
    positive: true,
    initial: "C",
  },
];

export function TransactionHistoryCard() {
  const [activeTab, setActiveTab] = useState<Tab>("All");

  return (
    <Card
      className="flex h-full flex-col p-6"
      headerAction={
        <IconButton label="View all transactions" variant="surface" size="sm">
          <ArrowUpRight />
        </IconButton>
      }
    >
      <h2 className="mb-4 text-lg font-semibold">Transaction history</h2>

      <div className="mb-5 inline-flex rounded-full border border-border bg-surface-elevated p-1">
        {tabs.map((tab) => (
          <button
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
          </button>
        ))}
      </div>

      <div className="flex flex-1 flex-col gap-4">
        {transactions.map((transaction) => (
          <div
            key={transaction.name}
            className="flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-2xl bg-surface-elevated text-xs font-semibold text-muted">
                {transaction.initial}
              </div>
              <div>
                <p className="text-sm font-medium">{transaction.name}</p>
                <p className="text-xs text-muted">{transaction.date}</p>
              </div>
            </div>
            <p
              className={cn(
                "text-sm font-semibold",
                transaction.positive ? "text-primary" : "text-foreground",
              )}
            >
              {transaction.amount}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}
