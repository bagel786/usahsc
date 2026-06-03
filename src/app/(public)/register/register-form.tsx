"use client";

import { useActionState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Field, Input, Textarea, Select } from "@/components/admin/form";
import { SubmitButton } from "@/components/admin/submit-button";
import { submitRegistration, type FormState } from "./actions";

const ROLES = ["Player", "Coach", "School representative", "Parent", "Other"];

export function RegisterForm() {
  const [state, formAction] = useActionState<FormState, FormData>(
    submitRegistration,
    {},
  );

  if (state.ok) {
    return (
      <div className="card flex flex-col items-center gap-3 p-10 text-center">
        <CheckCircle2 size={44} className="text-green-400" />
        <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-heading">
          Thank you!
        </h2>
        <p className="max-w-md text-muted">
          Your interest has been submitted. The USAHSC team will be in touch soon.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="card space-y-5 p-6 sm:p-8">
      {/* Honeypot */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full name" htmlFor="name">
          <Input id="name" name="name" required placeholder="Your name" />
        </Field>
        <Field label="School" htmlFor="school">
          <Input id="school" name="school" placeholder="Your high school" />
        </Field>
        <Field label="Email" htmlFor="email">
          <Input id="email" name="email" type="email" required placeholder="you@email.com" />
        </Field>
        <Field label="Phone" htmlFor="phone">
          <Input id="phone" name="phone" type="tel" placeholder="(512) 555-0123" />
        </Field>
      </div>

      <Field label="I am a…" htmlFor="role">
        <Select id="role" name="role" defaultValue="">
          <option value="">Select a role</option>
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </Select>
      </Field>

      <Field label="Message" htmlFor="message" hint="Tell us about your team or interest.">
        <Textarea id="message" name="message" placeholder="Optional message" />
      </Field>

      {state.error && (
        <p className="rounded-lg border border-brand/40 bg-brand/10 px-3 py-2 text-sm text-brand">
          {state.error}
        </p>
      )}

      <SubmitButton>Submit registration</SubmitButton>
    </form>
  );
}
