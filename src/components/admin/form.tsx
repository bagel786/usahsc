import { cn } from "@/lib/cn";

export function Field({
  label,
  htmlFor,
  hint,
  children,
  className,
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label
        htmlFor={htmlFor}
        className="mb-1.5 block text-sm font-medium text-white"
      >
        {label}
      </label>
      {children}
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  );
}

const fieldStyles =
  "w-full rounded-lg border border-line bg-surface px-3.5 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-muted/60 focus:border-electric";

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(fieldStyles, props.className)} />;
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea {...props} className={cn(fieldStyles, "min-h-24", props.className)} />
  );
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={cn(fieldStyles, props.className)} />;
}

export function Checkbox({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="flex items-center gap-2 text-sm text-white">
      <input
        type="checkbox"
        {...props}
        className="h-4 w-4 rounded border-line bg-surface accent-brand"
      />
      {label}
    </label>
  );
}
