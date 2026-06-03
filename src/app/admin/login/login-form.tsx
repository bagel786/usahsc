"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { LogIn } from "lucide-react";
import { authenticate, type LoginState } from "./actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3 font-display font-semibold uppercase tracking-wide text-white shadow-glow transition-colors hover:bg-brand-light disabled:opacity-60"
    >
      <LogIn size={18} /> {pending ? "Signing in…" : "Sign in"}
    </button>
  );
}

export function LoginForm() {
  const [state, formAction] = useActionState<LoginState, FormData>(
    authenticate,
    {},
  );

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-muted" htmlFor="username">
          Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          required
          className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-white outline-none focus:border-electric"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-muted" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-white outline-none focus:border-electric"
        />
      </div>

      {state.error && (
        <p className="rounded-lg border border-brand/40 bg-brand/10 px-3 py-2 text-sm text-brand-light">
          {state.error}
        </p>
      )}

      <SubmitButton />
    </form>
  );
}
