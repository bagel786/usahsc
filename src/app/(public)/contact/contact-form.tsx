"use client";

import { useActionState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Field, Input, Textarea } from "@/components/admin/form";
import { SubmitButton } from "@/components/admin/submit-button";
import { submitContact, type FormState } from "./actions";

export function ContactForm() {
  const [state, formAction] = useActionState<FormState, FormData>(
    submitContact,
    {},
  );

  if (state.ok) {
    return (
      <div className="card flex flex-col items-center gap-3 p-10 text-center">
        <CheckCircle2 size={44} className="text-green-400" />
        <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-heading">
          Message sent
        </h2>
        <p className="max-w-md text-muted">
          Thanks for reaching out — we&apos;ll get back to you as soon as we can.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="card space-y-5 p-6 sm:p-8">
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" htmlFor="name">
          <Input id="name" name="name" required placeholder="Your name" />
        </Field>
        <Field label="Email" htmlFor="email">
          <Input id="email" name="email" type="email" required placeholder="you@email.com" />
        </Field>
      </div>
      <Field label="Message" htmlFor="message">
        <Textarea id="message" name="message" required placeholder="How can we help?" className="min-h-32" />
      </Field>

      {state.error && (
        <p className="rounded-lg border border-brand/40 bg-brand/10 px-3 py-2 text-sm text-brand">
          {state.error}
        </p>
      )}

      <SubmitButton>Send message</SubmitButton>
    </form>
  );
}
