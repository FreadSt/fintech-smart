"use client";

import { useActionState } from "react";
import Link from "next/link";
import type { LoginState } from "@/app/auth/login/actions";
import { Button } from "@/shared/button/Button";
import { Input } from "@/shared/input/Input";
import { Text } from "@/shared/text/Text";

type LoginFormProps = {
  action: (
    prevState: LoginState,
    formData: FormData,
  ) => Promise<LoginState>;
  mode?: "login" | "signup";
};

const initialState: LoginState = {};

export function LoginForm({ action, mode = "login" }: LoginFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialState);
  const isSignup = mode === "signup";

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Text as="label" htmlFor="email" className="text-sm text-muted">
          Email
        </Text>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="h-11 rounded-2xl border border-border bg-surface-elevated px-4 text-sm outline-none focus:border-primary/50"
          placeholder="demo@finflex.app"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Text as="label" htmlFor="password" className="text-sm text-muted">
          Password
        </Text>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete={isSignup ? "new-password" : "current-password"}
          required
          minLength={isSignup ? 6 : undefined}
          className="h-11 rounded-2xl border border-border bg-surface-elevated px-4 text-sm outline-none focus:border-primary/50"
          placeholder="********"
        />
      </div>

      {state.error ? (
        <Text className="text-sm text-red-400" role="alert">
          {state.error}
        </Text>
      ) : null}

      {state.message ? (
        <Text className="text-sm text-accent-emerald" role="status">
          {state.message}
        </Text>
      ) : null}

      <Button
        type="submit"
        disabled={isPending}
        className="mt-2 h-11 rounded-full bg-primary text-sm font-semibold text-black transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {isPending
          ? isSignup
            ? "Creating account..."
            : "Signing in..."
          : isSignup
            ? "Create account"
            : "Sign in"}
      </Button>

      <Text className="text-center text-sm text-muted">
        {isSignup ? "Already have an account?" : "New to FinFlex?"}{" "}
        <Link
          href={isSignup ? "/login" : "/signup"}
          className="font-medium text-primary hover:opacity-80"
        >
          {isSignup ? "Sign in" : "Create an account"}
        </Link>
      </Text>
    </form>
  );
}
