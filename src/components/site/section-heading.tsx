import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function SectionHeading({
  eyebrow,
  title,
  href,
  linkLabel,
}: {
  eyebrow?: string;
  title: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="mb-8 flex items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <p className="mb-1.5 font-display text-sm font-semibold uppercase tracking-[0.2em] text-brand">
            {eyebrow}
          </p>
        )}
        <h2 className="section-title">{title}</h2>
      </div>
      {href && linkLabel && (
        <Link
          href={href}
          className="hidden shrink-0 items-center gap-1.5 text-sm font-semibold uppercase tracking-wide text-electric hover:text-heading sm:flex"
        >
          {linkLabel} <ArrowRight size={16} />
        </Link>
      )}
    </div>
  );
}
