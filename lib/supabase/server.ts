import { redirect } from "next/navigation";
import { createClient } from "@/supabase/server";

export async function getServerSupabase() {
  return createClient();
}

export async function requireUser() {
  const supabase = await getServerSupabase();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  return { supabase, user };
}
