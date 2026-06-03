"use client";

import { useActionState } from "react";
import { Check } from "lucide-react";
import { Field, Input } from "@/components/admin/form";
import { SubmitButton } from "@/components/admin/submit-button";
import { changePassword, type AccountState } from "./actions";

export function AccountForm() {
  const [state, formAction] = useActionState<AccountState, FormData>(
    changePassword,
    {},
  );

  return (
    <form action={formAction} className="card max-w-md space-y-5 p-6">
      <Field label="Current password" htmlFor="currentPassword">
        <Input id="currentPassword" name="currentPassword" type="password" autoComplete="current-password" required />
      </Field>
      <Field label="New password" htmlFor="newPassword" hint="At least 8 characters.">
        <Input id="newPassword" name="newPassword" type="password" autoComplete="new-password" required />
      </Field>
      <Field label="Confirm new password" htmlFor="confirmPassword">
        <Input id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" required />
      </Field>

      {state.error && (
        <p className="rounded-lg border border-brand/40 bg-brand/10 px-3 py-2 text-sm text-brand-light">
          {state.error}
        </p>
      )}
      {state.ok && (
        <p className="flex items-center gap-1.5 rounded-lg border border-green-500/30 bg-green-500/10 px-3 py-2 text-sm text-green-400">
          <Check size={16} /> Password updated.
        </p>
      )}

      <SubmitButton>Update password</SubmitButton>
    </form>
  );
}
