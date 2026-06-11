"use client";

import { useActionState } from "react";
import type { LoginState } from "@/app/login/actions";

type LoginFormProps = {
  action: (
    prevState: LoginState,
    formData: FormData,
  ) => Promise<LoginState>;
};

const initialState: LoginState = {};

export function LoginForm({ action }: LoginFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm text-muted">
          Email
        </label>
        <input
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
        <label htmlFor="password" className="text-sm text-muted">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="h-11 rounded-2xl border border-border bg-surface-elevated px-4 text-sm outline-none focus:border-primary/50"
          placeholder="••••••••"
        />
      </div>

      {state.error ? (
        <p className="text-sm text-red-400" role="alert">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="mt-2 h-11 rounded-full bg-primary text-sm font-semibold text-black transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {isPending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
