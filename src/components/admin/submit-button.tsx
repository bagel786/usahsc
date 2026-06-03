"use client";

import { useFormStatus } from "react-dom";
import { cn } from "@/lib/cn";

export function SubmitButton({
  children,
  variant = "primary",
  className,
  confirm,
}: {
  children: React.ReactNode;
  variant?: "primary" | "danger" | "secondary";
  className?: string;
  confirm?: string;
}) {
  const { pending } = useFormStatus();
  const styles = {
    primary: "bg-brand text-white hover:bg-brand-light",
    danger: "bg-surface-2 text-brand-light border border-brand/40 hover:bg-brand/10",
    secondary: "bg-surface-2 text-heading border border-line hover:border-electric/50",
  }[variant];

  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(e) => {
        if (confirm && !window.confirm(confirm)) e.preventDefault();
      }}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 font-display text-sm font-semibold uppercase tracking-wide transition-colors disabled:opacity-60",
        styles,
        className,
      )}
    >
      {pending ? "Saving…" : children}
    </button>
  );
}
