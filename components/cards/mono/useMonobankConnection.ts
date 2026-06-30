"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  MonobankApiError,
  connectMonobankToken,
  disconnectMonobankToken,
  fetchMonobankOverview,
  fetchMonobankTransactions,
} from "@/lib/monobank/client";

const DAY_SECONDS = 24 * 60 * 60;

export function getDefaultStatementRange() {
  const to = Math.floor(Date.now() / 1000);
  const from = to - 31 * DAY_SECONDS;

  return { from, to };
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
