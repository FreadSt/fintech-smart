import "server-only";

import { createClient } from "@supabase/supabase-js";
import { getSupabaseBrowserEnv, getSupabaseServiceRoleKey } from "./env";

export function createAdminClient() {
  const { url } = getSupabaseBrowserEnv();

  return createClient(url, getSupabaseServiceRoleKey(), {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
