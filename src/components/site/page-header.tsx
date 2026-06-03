export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="border-b border-line/70 bg-ink-2">
      <div className="container-px py-12 sm:py-16">
        {eyebrow && (
          <p className="mb-2 font-display text-sm font-semibold uppercase tracking-[0.2em] text-brand">
            {eyebrow}
          </p>
        )}
        <h1 className="font-display text-4xl font-bold uppercase tracking-tight text-heading sm:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mt-4 max-w-2xl text-muted">{description}</p>
        )}
      </div>
    </div>
  );
}
