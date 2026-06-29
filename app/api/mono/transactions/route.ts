import { NextResponse, type NextRequest } from "next/server";
import {
  assertMonobankAccountBelongsToUser,
  fetchMonobankStatement,
  getAuthenticatedSupabase,
  getCachedMonobankTransactions,
  getDefaultMonobankAccountId,
  getMonobankConnectionToken,
  getStatementRetryAfterSeconds,
  markStatementSynced,
  MonobankRequestError,
  reserveStatementSync,
  saveMonobankTransactions,
} from "@/lib/monobank/server";
import type { MonobankTransactionsResponse } from "@/lib/monobank/types";

const MAX_STATEMENT_RANGE_SECONDS = 31 * 24 * 60 * 60 + 60 * 60;

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
    const requestedAccountId = searchParams.get("accountId") ?? undefined;
    const from = parseUnixParam(searchParams.get("from"));
    const to = parseUnixParam(searchParams.get("to"));

    if (from === null || to === null || from > to) {
      return NextResponse.json(
        { error: "Invalid from or to query params" },
        { status: 400 },
      );
    }

    if (to - from > MAX_STATEMENT_RANGE_SECONDS) {
      return NextResponse.json(
        { error: "Statement range cannot exceed 31 days and 1 hour" },
        { status: 400 },
      );
    }

    const { supabase, user } = await getAuthenticatedSupabase();

    if (!requestedAccountId) {
      const cachedTransactions = await getCachedMonobankTransactions(
        supabase,
        user.id,
        from,
        to,
      );

      if (cachedTransactions.length > 0) {
        const response: MonobankTransactionsResponse = {
          transactions: cachedTransactions,
          source: "db",
        };

        return NextResponse.json(response);
      }
    }

    const resolvedAccountId =
      requestedAccountId ??
      (await getDefaultMonobankAccountId(supabase, user.id));

    await assertMonobankAccountBelongsToUser(
      supabase,
      user.id,
      resolvedAccountId,
    );

    const cachedTransactions = await getCachedMonobankTransactions(
      supabase,
      user.id,
      from,
      to,
      resolvedAccountId,
    );

    if (cachedTransactions.length > 0) {
      const response: MonobankTransactionsResponse = {
        transactions: cachedTransactions,
        source: "db",
      };

      return NextResponse.json(response);
    }

    const retryAfterSeconds = await getStatementRetryAfterSeconds(
      supabase,
      user.id,
    );

    if (retryAfterSeconds > 0) {
      throw new MonobankRequestError(
        "Monobank sync is cooling down",
        429,
        retryAfterSeconds,
      );
    }

    await reserveStatementSync(user.id);

    const token = await getMonobankConnectionToken(supabase, user.id);
    const statement = await fetchMonobankStatement(
      token,
      resolvedAccountId,
      from,
      to,
    );
    const transactions = await saveMonobankTransactions(
      supabase,
      user.id,
      resolvedAccountId,
      statement,
    );
    await markStatementSynced(user.id);

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
