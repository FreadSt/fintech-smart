"use client";

import { ArrowUpRight, TrendingUp } from "lucide-react";
import { useState } from "react";
import { Text } from "@/shared/text/Text";
import { Card } from "@/components/ui/Card";
import { IconButton } from "@/components/ui/IconButton";
import Link from "next/link";
import { WidgetEmptyState, WidgetSkeleton } from "./WidgetState";

const skeletonSparkline = [28, 42, 36, 52, 44, 58, 48, 62, 54, 68];

type BalanceSummary = {
  totalBalance: string;
  balanceTrend: string;
  balanceDelta: string;
};

type BalanceOption = {
  currencyCode: number;
  label: string;
  value: string;
};

type SelectedCardInfo = {
  balance: string;
  label: string;
  lastFour: string;
  network: string;
};

type TotalBalanceCardProps = {
  balanceOptions?: BalanceOption[];
  isLoading?: boolean;
  selectedCard?: SelectedCardInfo | null;
  summary?: BalanceSummary | null;
  sparkline?: number[];
};

export function TotalBalanceCard({
  balanceOptions = [],
  isLoading = false,
  selectedCard,
  summary = null,
  sparkline = [],
}: TotalBalanceCardProps) {
  const [selectedCurrencyCode, setSelectedCurrencyCode] = useState(
    balanceOptions[0]?.currencyCode ?? 980,
  );
  const selectedBalance =
    balanceOptions.find(
      (option) => option.currencyCode === selectedCurrencyCode,
    ) ?? balanceOptions[0];
  const hasData = Boolean(summary) && (Boolean(selectedCard) || sparkline.length > 0);

  return (
    <Card
      variant="gradient-balance"
      className="flex min-h-full flex-col justify-between p-6"
      headerAction={
        <Link href="/cards">
          <IconButton
            label="View balance details"
            variant="surface"
            size="sm"
            className="border-black/10 bg-black/10 text-black hover:bg-black/20"
          >
            <ArrowUpRight />
          </IconButton>
        </Link>
        
      }
    >
      {isLoading ? (
        <TotalBalanceSkeleton />
      ) : !hasData || !summary ? (
        <WidgetEmptyState className="min-h-56 border-black/15 bg-black/10" />
      ) : (
        <>
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <Text className="text-sm font-medium text-black/70">Total Balance</Text>
              {balanceOptions.length > 1 ? (
                <select
                  aria-label="Choose balance currency"
                  className="rounded-full border border-black/10 bg-black/10 px-3 py-1 text-xs font-semibold text-black outline-none"
                  value={selectedBalance?.currencyCode ?? selectedCurrencyCode}
                  onChange={(event) =>
                    setSelectedCurrencyCode(Number(event.target.value))
                  }
                >
                  {balanceOptions.map((option) => (
                    <option key={option.currencyCode} value={option.currencyCode}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : null}
            </div>
            <Text className="mt-2 text-4xl font-light tracking-tight md:text-[5.5rem]">
              {selectedBalance?.value ?? summary.totalBalance}
            </Text>
          </div>

          <div className="flex items-end justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              <Text as="span" className="inline-flex items-center gap-1 rounded-full bg-black px-3 py-1 text-xs font-semibold text-primary">
                <TrendingUp className="size-3" />
                {summary.balanceTrend}
              </Text>
              <Text as="span" className="inline-flex items-center rounded-full bg-black px-3 py-1 text-xs font-semibold text-primary">
                {summary.balanceDelta}
              </Text>
            </div>

            {selectedCard ? (
              <div className="min-w-36 rounded-2xl bg-black/10 p-3 text-right">
                <Text className="text-xs font-semibold text-black/60">
                  {selectedCard.label}
                </Text>
                <Text className="mt-1 text-lg font-semibold text-black">
                  {selectedCard.balance}
                </Text>
                <Text className="text-xs text-black/60">
                  *{selectedCard.lastFour} · {selectedCard.network}
                </Text>
              </div>
            ) : (
              <div className="flex h-16 items-end gap-1">
                {sparkline.map((height, index) => (
                  <div
                    key={index}
                    className="w-1.5 rounded-full bg-black/25"
                    style={{ height }}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </Card>
  );
}

function TotalBalanceSkeleton() {
  return (
    <>
      <div>
        <WidgetSkeleton className="h-4 w-28 bg-black/15" />
        <WidgetSkeleton className="mt-4 h-16 w-64 max-w-full bg-black/15 md:h-24" />
      </div>
      <div className="flex items-end justify-between gap-4">
        <div className="flex gap-2">
          <WidgetSkeleton className="h-7 w-16 rounded-full bg-black/15" />
          <WidgetSkeleton className="h-7 w-24 rounded-full bg-black/15" />
        </div>
        <div className="flex h-16 items-end gap-1">
          {skeletonSparkline.map((height, index) => (
            <WidgetSkeleton
              key={index}
              className="w-1.5 rounded-full bg-black/15"
              style={{ height }}
            />
          ))}
        </div>
      </div>
    </>
  );
}
