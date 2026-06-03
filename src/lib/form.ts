/** Helpers for reading FormData values in server actions. */

export function str(form: FormData, key: string): string | undefined {
  const v = form.get(key);
  if (typeof v !== "string") return undefined;
  const t = v.trim();
  return t === "" ? undefined : t;
}

export function reqStr(form: FormData, key: string): string {
  return str(form, key) ?? "";
}

export function num(form: FormData, key: string, fallback = 0): number {
  const v = str(form, key);
  if (v === undefined) return fallback;
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

export function bool(form: FormData, key: string): boolean {
  const v = form.get(key);
  return v === "on" || v === "true" || v === "1";
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
