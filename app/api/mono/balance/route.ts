import { NextResponse } from "next/server";
import {
  getAuthenticatedSupabase,
  getMonobankOverview,
  MonobankRequestError,
} from "@/lib/monobank/server";

export async function GET() {
  try {
    const { supabase, user } = await getAuthenticatedSupabase();
    const balance = await getMonobankOverview(supabase, user.id);

    return NextResponse.json(balance);
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
