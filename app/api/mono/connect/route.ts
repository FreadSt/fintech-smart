import { NextResponse, type NextRequest } from "next/server";
import {
  connectMonobank,
  disconnectMonobank,
  getAuthenticatedSupabase,
  MonobankRequestError,
} from "@/lib/monobank/server";

export async function POST(request: NextRequest) {
  try {
    const { user } = await getAuthenticatedSupabase();
    const body = (await request.json()) as { token?: string };
    const token = body.token?.trim();

    if (!token) {
      return NextResponse.json(
        { error: "Monobank X-Token is required" },
        { status: 400 },
      );
    }

    const result = await connectMonobank(user, token);

    return NextResponse.json(result);
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

export async function DELETE() {
  try {
    const { user } = await getAuthenticatedSupabase();

    await disconnectMonobank(user.id);

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof MonobankRequestError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status },
      );
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}
