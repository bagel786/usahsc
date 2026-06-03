"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { NAV_LINKS } from "@/lib/nav";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import type { SiteSettings } from "@/lib/content";

export function SiteHeader({ settings }: { settings: SiteSettings }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-ink-2/85 backdrop-blur-md">
      <div className="container-px flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <Image
            src="/brand/logo-square.png"
            alt={settings.leagueShortName}
            width={44}
            height={44}
            className="h-10 w-10 rounded-md object-contain"
            priority
          />
          <span className="font-display text-lg font-bold uppercase leading-none tracking-wide text-heading">
            {settings.leagueShortName}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => {
            const active =
              link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-semibold uppercase tracking-wide transition-colors",
                  active ? "text-heading" : "text-muted hover:text-heading",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:block">
          <ButtonLink href="/register" size="sm">
            Register a Team
          </ButtonLink>
        </div>

        <button
          className="rounded-lg p-2 text-heading lg:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-line bg-ink-2 lg:hidden">
          <div className="container-px flex flex-col py-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-3 text-base font-semibold uppercase tracking-wide text-muted hover:text-heading"
              >
                {link.label}
              </Link>
            ))}
            <ButtonLink href="/register" className="mt-2" onClick={() => setOpen(false)}>
              Register a Team
            </ButtonLink>
          </div>
        </nav>
      )}
    </header>
  );
}
