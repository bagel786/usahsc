import Link from "next/link";
import { Plus, ArrowLeft } from "lucide-react";

export function PageTitle({
  title,
  subtitle,
  actionHref,
  actionLabel,
  backHref,
}: {
  title: string;
  subtitle?: string;
  actionHref?: string;
  actionLabel?: string;
  backHref?: string;
}) {
  return (
    <div className="mb-8">
      {backHref && (
        <Link
          href={backHref}
          className="mb-3 inline-flex items-center gap-1.5 text-sm text-muted hover:text-heading"
        >
          <ArrowLeft size={15} /> Back
        </Link>
      )}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold uppercase tracking-wide text-heading">
            {title}
          </h1>
          {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
        </div>
        {actionHref && actionLabel && (
          <Link
            href={actionHref}
            className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2.5 font-display text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-brand-light"
          >
            <Plus size={16} /> {actionLabel}
          </Link>
        )}
      </div>
    </div>
  );
}
