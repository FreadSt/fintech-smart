import { NextResponse, type NextRequest } from "next/server";
import {
  assertMonobankAccountBelongsToUser,
  fetchMonobankStatement,
  getAuthenticatedSupabase,
  getCachedMonobankTransactions,
  getMonobankConnectionToken,
  MonobankRequestError,
  saveMonobankTransactions,
} from "@/lib/monobank/server";
import type { MonobankTransactionsResponse } from "@/lib/monobank/types";

function parseUnixParam(value: string | null): number | null {
  if (!value) {
    return null;
  }

  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : null;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const accountId = searchParams.get("accountId") ?? undefined;
    const from = parseUnixParam(searchParams.get("from"));
    const to = parseUnixParam(searchParams.get("to"));

    if (from === null || to === null || from > to) {
      return NextResponse.json(
        { error: "Invalid from or to query params" },
        { status: 400 },
      );
    }

    const { supabase, user } = await getAuthenticatedSupabase();

    if (accountId) {
      await assertMonobankAccountBelongsToUser(supabase, user.id, accountId);
    }

    const cachedTransactions = await getCachedMonobankTransactions(
      supabase,
      user.id,
      from,
      to,
      accountId,
    );

    if (cachedTransactions.length > 0 || !accountId) {
      const response: MonobankTransactionsResponse = {
        transactions: cachedTransactions,
        source: "db",
      };

      return NextResponse.json(response);
    }

    const token = await getMonobankConnectionToken(supabase, user.id);
    const statement = await fetchMonobankStatement(token, accountId, from, to);
    const transactions = await saveMonobankTransactions(
      supabase,
      user.id,
      accountId,
      statement,
    );

    const response: MonobankTransactionsResponse = {
      transactions,
      source: "monobank",
    };

    return NextResponse.json(response);
  } catch (error) {
    if (error instanceof MonobankRequestError) {
      return NextResponse.json(
        {
          error: error.message,
          retryAfterSeconds: error.retryAfterSeconds,
        },
        { status: error.status },
      );
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}
