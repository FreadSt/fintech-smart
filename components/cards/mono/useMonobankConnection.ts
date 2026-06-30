"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  MonobankApiError,
  connectMonobankToken,
  disconnectMonobankToken,
  fetchMonobankOverview,
  fetchMonobankTransactions,
} from "@/lib/monobank/client";
import type { MonobankAccount } from "@/lib/monobank/types";
import type { MonobankJar, MonobankTransaction } from "@/lib/monobank/types";
import {
  buildBudgetData,
  buildDashboardSummary,
  buildSpendingCategories,
  getBudgetCurrencyCode,
  getDefaultAccount,
  toBankCard,
  toGoalItems,
  toQuickTransfers,
  toTransactionItems,
} from "@/lib/monobank/view/dashboard";

const DAY_SECONDS = 24 * 60 * 60;
const SELECTED_ACCOUNT_STORAGE_KEY = "finflex:selected-monobank-card";
const emptyAccounts: MonobankAccount[] = [];
const emptyJars: MonobankJar[] = [];
const emptyTransactions: MonobankTransaction[] = [];

export function getDefaultStatementRange() {
  const to = Math.floor(Date.now() / 1000);
  const from = to - 31 * DAY_SECONDS;

  return { from, to };
}

export function useDefaultStatementRange() {
  return useMemo(() => getDefaultStatementRange(), []);
}

export function useMonobankOverview() {
  return useQuery({
    queryKey: ["monobank-overview"],
    queryFn: fetchMonobankOverview,
  });
}

export function useConnectMonobank() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: connectMonobankToken,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["monobank-overview"] });
      await queryClient.invalidateQueries({
        queryKey: ["monobank-transactions"],
      });
    },
  });
}

export function useDisconnectMonobank() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: disconnectMonobankToken,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["monobank-overview"] });
      await queryClient.invalidateQueries({
        queryKey: ["monobank-transactions"],
      });
    },
  });
}

export function useMonobankTransactions(
  from: number,
  to: number,
  accountId?: string,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: ["monobank-transactions", accountId ?? "default", from, to],
    queryFn: () => fetchMonobankTransactions(from, to, accountId),
    enabled: options?.enabled ?? true,
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => {
      if (error instanceof MonobankApiError && error.status === 429) {
        return false;
      }

      return failureCount < 1;
    },
    gcTime: 10 * 60_000,
    staleTime: 5 * 60_000,
  });
}

export function useSelectedMonobankAccount(accounts: MonobankAccount[]) {
  const [selectedAccountId, setSelectedAccountIdState] = useState(() => {
    if (typeof window === "undefined") {
      return "";
    }

    return window.localStorage.getItem(SELECTED_ACCOUNT_STORAGE_KEY) ?? "";
  });
  const defaultAccount = getDefaultAccount(accounts);
  const activeAccountId = accounts.some(
    (account) => account.monobank_account_id === selectedAccountId,
  )
    ? selectedAccountId
    : (defaultAccount?.monobank_account_id ?? "");
  const activeAccount = accounts.find(
    (account) => account.monobank_account_id === activeAccountId,
  );

  function setSelectedAccountId(accountId: string) {
    if (typeof window !== "undefined") {
      if (accountId) {
        window.localStorage.setItem(SELECTED_ACCOUNT_STORAGE_KEY, accountId);
      } else {
        window.localStorage.removeItem(SELECTED_ACCOUNT_STORAGE_KEY);
      }
    }

    setSelectedAccountIdState(accountId);
  }

  return {
    activeAccount,
    activeAccountId,
    selectedAccountId,
    setSelectedAccountId,
  };
}

export function useMonobankDashboardData() {
  const overviewQuery = useMonobankOverview();
  const range = useDefaultStatementRange();
  const transactionsQuery = useMonobankTransactions(range.from, range.to);
  const overview = overviewQuery.data;
  const transactions = transactionsQuery.data?.transactions ?? emptyTransactions;
  const accounts = overview?.accounts ?? emptyAccounts;
  const jars = overview?.jars ?? emptyJars;
  const clientName = overview?.connection?.client_name;
  const selectedAccount = useSelectedMonobankAccount(accounts);

  const derived = useMemo(() => {
    const bankCards = accounts.map((account, index) =>
      toBankCard(account, index, clientName),
    );

    return {
      bankCards,
      budget: buildBudgetData(transactions),
      budgetCurrencyCode: getBudgetCurrencyCode(transactions),
      goals: toGoalItems(jars),
      quickTransfers: toQuickTransfers(transactions),
      spending: buildSpendingCategories(transactions),
      summary: overview ? buildDashboardSummary(accounts, jars, transactions) : null,
      transactionItems: toTransactionItems(transactions),
    };
  }, [accounts, clientName, jars, overview, transactions]);

  return {
    ...derived,
    accounts,
    isLoading: overviewQuery.isLoading || transactionsQuery.isLoading,
    overview,
    overviewQuery,
    range,
    selectedAccount,
    transactions,
    transactionsQuery,
  };
}
