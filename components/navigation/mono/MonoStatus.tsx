import Link from "next/link";
import { Text } from "@/shared/text/Text";
import { createClient } from "@/supabase/server";

function formatSyncTime(value: string | null): string {
  if (!value) {
    return "Never synced";
  }

  return new Date(value).toLocaleString("uk-UA", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export async function MonoStatus() {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return null;
  }

  const { data: integration, error: integrationError } = await supabase
    .from("monobank_integrations")
    .select("last_client_info_sync_at,last_statement_sync_at")
    .eq("user_id", user.id)
    .maybeSingle();

  if (integrationError) {
    return null;
  }

  if (!integration) {
    return (
      <Link
        href="/cards"
        className="hidden rounded-full border border-border bg-surface px-3 py-2 text-xs font-medium text-muted transition-colors hover:text-foreground lg:block"
      >
        Connect Monobank
      </Link>
    );
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("monobank_client_name")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    return null;
  }

  return (
    <div className="hidden min-w-0 rounded-full border border-border bg-surface px-3 py-1.5 lg:block">
      <Text className="max-w-40 truncate text-xs font-medium">
        {profile?.monobank_client_name ?? "Monobank"}
      </Text>
      <Text className="text-[11px] text-muted">
        {formatSyncTime(
          integration.last_statement_sync_at ??
            integration.last_client_info_sync_at,
        )}
      </Text>
    </div>
  );
}
