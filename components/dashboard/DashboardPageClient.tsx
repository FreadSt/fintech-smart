"use client";

import { useState } from "react";
import { BottomRowCards } from "@/components/dashboard/widgets/BottomRowCards";
import { BudgetCard } from "@/components/dashboard/widgets/BudgetCard";
import { CreditCardWidget } from "@/components/dashboard/widgets/CreditCardWidget";
import { IncomeExpenseCards } from "@/components/dashboard/widgets/IncomeExpenseCards";
import { TopSpendingCard } from "@/components/dashboard/widgets/TopSpendingCard";
import { TotalBalanceCard } from "@/components/dashboard/widgets/TotalBalanceCard";
import { TransactionHistoryCard } from "@/components/dashboard/widgets/TransactionHistoryCard";
import {
  getDefaultStatementRange,
  useMonobankOverview,
  useMonobankTransactions,
} from "@/components/cards/mono/useMonobankConnection";
import {
  buildBudgetData,
  buildDashboardSummary,
  buildSpendingCategories,
  toBankCard,
  toGoalItems,
  toQuickTransfers,
  toTransactionItems,
} from "@/lib/monobank/view/dashboard";
import type { Period } from "@/lib/dashboard/mock-data";
import { formatKopecks, getCurrencyCode } from "@/lib/monobank/money";

const emptyBudgetData: Record<Period, { labels: string[]; entries: [] }> = {
  daily: { labels: [], entries: [] },
  weekly: { labels: [], entries: [] },
  monthly: { labels: [], entries: [] },
};

export function DashboardPageClient() {
  const [selectedCardId] = useState(() => {
    if (typeof window === "undefined") {
      return "";
    }

    return window.localStorage.getItem("finflex:selected-monobank-card") ?? "";
  });
  const overviewQuery = useMonobankOverview();
  const range = getDefaultStatementRange();
  const transactionsQuery = useMonobankTransactions(range.from, range.to);
  const overview = overviewQuery.data;
  const transactions = transactionsQuery.data?.transactions ?? [];
  const isLoading = overviewQuery.isLoading || transactionsQuery.isLoading;
  const summary = overview
    ? buildDashboardSummary(overview.accounts, overview.jars, transactions)
    : null;
  const bankCards = (overview?.accounts ?? []).map((account, index) =>
    toBankCard(account, index, overview?.connection?.client_name),
  );
  const selectedCard =
    bankCards.find((card) => card.id === selectedCardId) ?? bankCards[0];
  const balanceOptions = buildBalanceOptions(overview?.accounts ?? []);
  const spending = buildSpendingCategories(transactions);
  const budgetData = buildBudgetData(transactions);
  const goals = toGoalItems(overview?.jars ?? []);
  const transactionItems = toTransactionItems(transactions);
  const quickTransfers = toQuickTransfers(transactions);

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-12 xl:grid-rows-[auto_auto_auto] xl:gap-5">
      <div className="xl:col-span-5 xl:row-start-1">
        <TotalBalanceCard
          balanceOptions={balanceOptions}
          isLoading={isLoading}
          selectedCard={
            selectedCard
              ? {
                  balance: selectedCard.balance,
                  label: selectedCard.type,
                  lastFour: selectedCard.lastFour,
                  network: selectedCard.network,
                }
              : null
          }
          summary={summary}
        />
      </div>
      <div className="xl:col-span-3 xl:row-start-1">
        <IncomeExpenseCards isLoading={isLoading} summary={summary} />
      </div>
      <div className="xl:col-span-4 xl:row-start-1">
        <CreditCardWidget isLoading={isLoading} userCards={bankCards} />
      </div>

      <div className="xl:col-span-5 xl:row-start-2">
        <BudgetCard
          isLoading={isLoading}
          data={budgetData ?? emptyBudgetData}
        />
      </div>
      <div className="xl:col-span-3 xl:row-start-2">
        <TopSpendingCard
          isLoading={isLoading}
          categories={spending.categories}
          total={spending.total}
        />
      </div>
      <div className="xl:col-span-4 xl:row-span-2 xl:row-start-2">
        <TransactionHistoryCard
          isLoading={isLoading}
          items={transactionItems}
        />
      </div>

      <div className="xl:col-span-8 xl:row-start-3">
        <BottomRowCards
          isLoading={isLoading}
          summary={summary}
          savingsGoals={goals}
          quickTransfers={quickTransfers}
        />
      </div>
    </div>
  );
}

function buildBalanceOptions(
  accounts: { balance: number; currency_code: number }[],
) {
  const byCurrency = new Map<number, number>();

  for (const account of accounts) {
    byCurrency.set(
      account.currency_code,
      (byCurrency.get(account.currency_code) ?? 0) + account.balance,
    );
  }

  return [...byCurrency.entries()]
    .sort(([a], [b]) => a - b)
    .map(([currencyCode, value]) => ({
      currencyCode,
      label: getCurrencyCode(currencyCode),
      value: formatKopecks(value, currencyCode),
    }));
}
