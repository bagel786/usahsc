"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  Trophy,
  BarChart3,
  FileText,
  ClipboardList,
  Mail,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { signOutAction } from "@/app/admin/(dashboard)/actions";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/teams", label: "Teams", icon: Users },
  { href: "/admin/matches", label: "Schedule", icon: CalendarDays },
  { href: "/admin/standings", label: "Standings", icon: Trophy },
  { href: "/admin/stats", label: "Stats", icon: BarChart3 },
  { href: "/admin/content", label: "Site Content", icon: FileText },
  { href: "/admin/registrations", label: "Registrations", icon: ClipboardList },
  { href: "/admin/messages", label: "Messages", icon: Mail },
  { href: "/admin/account", label: "Account", icon: Settings },
];

export function AdminShell({
  email,
  children,
}: {
  email: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-line bg-ink-2 transition-transform lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-line px-5">
          <Link href="/admin" className="flex items-center gap-2" onClick={() => setOpen(false)}>
            <Image src="/brand/logo.jpg" alt="" width={32} height={32} className="h-8 w-8 rounded-md object-cover" />
            <span className="font-display text-sm font-bold uppercase tracking-wide text-white">
              USAHSC Admin
            </span>
          </Link>
          <button className="lg:hidden" onClick={() => setOpen(false)} aria-label="Close menu">
            <X size={20} className="text-muted" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {NAV.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-brand/15 text-white"
                    : "text-muted hover:bg-surface hover:text-white",
                )}
              >
                <Icon size={18} className={active ? "text-brand-light" : ""} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-line p-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted hover:text-white"
          >
            <ExternalLink size={18} /> View site
          </Link>
          <form action={signOutAction}>
            <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted hover:text-white">
              <LogOut size={18} /> Sign out
            </button>
          </form>
          <p className="px-3 pt-2 text-xs text-muted/70">{email}</p>
        </div>
      </aside>

      {/* Backdrop on mobile */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center gap-3 border-b border-line bg-ink px-4 lg:hidden">
          <button onClick={() => setOpen(true)} aria-label="Open menu">
            <Menu size={22} className="text-white" />
          </button>
          <span className="font-display font-bold uppercase text-white">USAHSC Admin</span>
        </header>
        <main className="flex-1 p-5 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
