import { cn } from "@/lib/cn";

type Props = {
  name: string;
  logoUrl?: string | null;
  color?: string | null;
  size?: number;
  className?: string;
};

function initials(name: string) {
  return name
    .replace(/\b(cricket|high school|hs)\b/gi, "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

/**
 * Renders a team logo, falling back to a colored initials badge when no
 * image is available (e.g. Round Rock until a logo is uploaded in admin).
 */
export function TeamLogo({ name, logoUrl, color, size = 64, className }: Props) {
  if (logoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={logoUrl}
        alt={`${name} logo`}
        width={size}
        height={size}
        className={cn("object-contain", className)}
        style={{ width: size, height: size }}
        loading="lazy"
      />
    );
  }
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full font-display font-bold text-white ring-2 ring-white/15",
        className,
      )}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.34,
        background: `linear-gradient(135deg, ${color ?? "#e11d2a"}, #0a0f1d)`,
      }}
      aria-label={`${name} logo`}
    >
      {initials(name)}
    </span>
  );
}
