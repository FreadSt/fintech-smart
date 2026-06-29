import type {
  MonobankConnectResponse,
  MonobankOverviewResponse,
  MonobankTransactionsResponse,
} from "./types";

type ApiErrorBody = {
  error?: string;
  retryAfterSeconds?: number;
};

export class MonobankApiError extends Error {
  retryAfterSeconds?: number;
  status: number;

  constructor(message: string, status: number, retryAfterSeconds?: number) {
    super(message);
    this.name = "MonobankApiError";
    this.status = status;
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

async function readJsonOrThrow<TResponse>(response: Response): Promise<TResponse> {
  const body = (await response.json()) as TResponse & ApiErrorBody;

  if (!response.ok) {
    throw new MonobankApiError(
      body.error ?? "Monobank request failed",
      response.status,
      body.retryAfterSeconds,
    );
  }

  return body;
}

export async function fetchMonobankOverview(): Promise<MonobankOverviewResponse> {
  const response = await fetch("/api/mono/balance", {
    method: "GET",
  });

  return readJsonOrThrow<MonobankOverviewResponse>(response);
}

export async function connectMonobankToken(
  token: string,
): Promise<MonobankConnectResponse> {
  const response = await fetch("/api/mono/connect", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token }),
  });

  return readJsonOrThrow<MonobankConnectResponse>(response);
}

export async function disconnectMonobankToken(): Promise<{ ok: boolean }> {
  const response = await fetch("/api/mono/connect", {
    method: "DELETE",
  });

  return readJsonOrThrow<{ ok: boolean }>(response);
}

export async function fetchMonobankTransactions(
  from: number,
  to: number,
  accountId?: string,
): Promise<MonobankTransactionsResponse> {
  const params = new URLSearchParams({
    from: String(from),
    to: String(to),
  });

  if (accountId) {
    params.set("accountId", accountId);
  }
  
  const response = await fetch(`/api/mono/transactions?${params.toString()}`, {
    method: "GET",
  });
  return readJsonOrThrow<MonobankTransactionsResponse>(response);
}
