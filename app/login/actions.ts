"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/supabase/server";

export type LoginState = {
  error?: string;
  message?: string;
};

export async function loginAction(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/");
}

export async function logoutAction(): Promise<void> {
  const supabase = await createClient();

  await supabase.auth.signOut();
  redirect("/login");
}

export async function signupAction(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  if (data.session) {
    redirect("/");
  }

  return {
    message: "Check your email to confirm your account, then sign in.",
  };
}
