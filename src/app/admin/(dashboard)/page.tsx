import Link from "next/link";
import {
  Users,
  CalendarDays,
  ClipboardList,
  Mail,
  ArrowRight,
} from "lucide-react";
import { prisma } from "@/lib/db";
import { PageTitle } from "@/components/admin/page-title";
import { formatFullDate } from "@/lib/format";

async function getDashboard() {
  try {
    const [teams, upcoming, newRegs, newMsgs, recentRegs, recentMsgs] =
      await Promise.all([
        prisma.team.count(),
        prisma.match.count({ where: { status: { in: ["upcoming", "live"] } } }),
        prisma.registration.count({ where: { status: "new" } }),
        prisma.contactMessage.count({ where: { status: "new" } }),
        prisma.registration.findMany({
          orderBy: { createdAt: "desc" },
          take: 5,
        }),
        prisma.contactMessage.findMany({
          orderBy: { createdAt: "desc" },
          take: 5,
        }),
      ]);
    return { teams, upcoming, newRegs, newMsgs, recentRegs, recentMsgs };
  } catch {
    return {
      teams: 0,
      upcoming: 0,
      newRegs: 0,
      newMsgs: 0,
      recentRegs: [],
      recentMsgs: [],
    };
  }
}

export default async function AdminDashboard() {
  const d = await getDashboard();

  const stats = [
    { label: "Teams", value: d.teams, icon: Users, href: "/admin/teams" },
    { label: "Upcoming matches", value: d.upcoming, icon: CalendarDays, href: "/admin/matches" },
    { label: "New registrations", value: d.newRegs, icon: ClipboardList, href: "/admin/registrations" },
    { label: "New messages", value: d.newMsgs, icon: Mail, href: "/admin/messages" },
  ];

  return (
    <>
      <PageTitle title="Dashboard" subtitle="Welcome back — here's the latest." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Link
              key={s.label}
              href={s.href}
              className="card flex items-center gap-4 p-5 transition-colors hover:border-electric/40"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand/15 text-brand-light">
                <Icon size={22} />
              </span>
              <div>
                <p className="font-display text-3xl font-bold leading-none text-white">
                  {s.value}
                </p>
                <p className="text-xs uppercase tracking-wider text-muted">{s.label}</p>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <RecentPanel
          title="Recent registrations"
          href="/admin/registrations"
          empty="No registrations yet."
          items={d.recentRegs.map((r) => ({
            id: r.id,
            primary: r.name,
            secondary: `${r.school ?? ""} · ${r.role ?? ""}`.replace(/^ · | · $/g, ""),
            date: r.createdAt,
            isNew: r.status === "new",
          }))}
        />
        <RecentPanel
          title="Recent messages"
          href="/admin/messages"
          empty="No messages yet."
          items={d.recentMsgs.map((m) => ({
            id: m.id,
            primary: m.name,
            secondary: m.email,
            date: m.createdAt,
            isNew: m.status === "new",
          }))}
        />
      </div>
    </>
  );
}

function RecentPanel({
  title,
  href,
  empty,
  items,
}: {
  title: string;
  href: string;
  empty: string;
  items: {
    id: string;
    primary: string;
    secondary: string;
    date: Date;
    isNew: boolean;
  }[];
}) {
  return (
    <section className="card overflow-hidden">
      <div className="flex items-center justify-between border-b border-line/60 px-5 py-4">
        <h2 className="font-display text-lg font-bold uppercase tracking-wide text-white">
          {title}
        </h2>
        <Link
          href={href}
          className="flex items-center gap-1 text-sm font-semibold text-electric hover:text-white"
        >
          View all <ArrowRight size={14} />
        </Link>
      </div>
      {items.length > 0 ? (
        <ul className="divide-y divide-line/50">
          {items.map((it) => (
            <li key={it.id} className="flex items-center gap-3 px-5 py-3.5">
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-2 font-semibold text-white">
                  {it.primary}
                  {it.isNew && (
                    <span className="rounded bg-brand/20 px-1.5 py-0.5 text-[10px] font-bold uppercase text-brand-light">
                      New
                    </span>
                  )}
                </p>
                {it.secondary && (
                  <p className="truncate text-xs text-muted">{it.secondary}</p>
                )}
              </div>
              <span className="shrink-0 text-xs text-muted">
                {formatFullDate(it.date)}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="px-5 py-8 text-center text-sm text-muted">{empty}</p>
      )}
    </section>
  );
}
