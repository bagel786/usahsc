import Link from "next/link";
import { Pencil, EyeOff } from "lucide-react";
import { prisma } from "@/lib/db";
import { PageTitle } from "@/components/admin/page-title";
import { TeamLogo } from "@/components/site/team-logo";

async function listTeams() {
  try {
    return await prisma.team.findMany({
      orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
      include: { _count: { select: { players: true } } },
    });
  } catch {
    return [];
  }
}

export default async function AdminTeamsPage() {
  const teams = await listTeams();

  return (
    <>
      <PageTitle
        title="Teams"
        subtitle="Add, edit and manage every school team and its roster."
        actionHref="/admin/teams/new"
        actionLabel="Add team"
      />

      <div className="card overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-surface-2/50 text-xs uppercase tracking-wider text-muted">
            <tr>
              <th className="px-4 py-3 font-semibold">Team</th>
              <th className="px-4 py-3 font-semibold">School</th>
              <th className="px-4 py-3 text-center font-semibold">Players</th>
              <th className="px-4 py-3 text-center font-semibold">Order</th>
              <th className="px-4 py-3 text-right font-semibold">Edit</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((t) => (
              <tr key={t.id} className="border-b border-line/50 hover:bg-surface-2/40">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <TeamLogo name={t.name} logoUrl={t.logoUrl} color={t.primaryColor} size={32} />
                    <span className="font-display font-semibold uppercase tracking-wide text-white">
                      {t.name}
                    </span>
                    {!t.isActive && (
                      <span className="inline-flex items-center gap-1 rounded bg-surface px-1.5 py-0.5 text-[10px] uppercase text-muted">
                        <EyeOff size={11} /> Hidden
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-muted">{t.school}</td>
                <td className="px-4 py-3 text-center text-muted">{t._count.players}</td>
                <td className="px-4 py-3 text-center text-muted">{t.displayOrder}</td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/teams/${t.id}`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-white hover:border-electric/50"
                  >
                    <Pencil size={13} /> Edit
                  </Link>
                </td>
              </tr>
            ))}
            {teams.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-muted">
                  No teams yet. Add your first team to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
