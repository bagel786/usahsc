import Link from "next/link";
import { Pencil } from "lucide-react";
import { prisma } from "@/lib/db";
import { PageTitle } from "@/components/admin/page-title";
import { formatMatchDate, formatMatchTime } from "@/lib/format";

async function listMatches() {
  try {
    return await prisma.match.findMany({
      orderBy: { dateTime: "desc" },
      include: { homeTeam: true, awayTeam: true },
    });
  } catch {
    return [];
  }
}

const statusColor: Record<string, string> = {
  upcoming: "text-electric",
  live: "text-brand-light",
  completed: "text-muted",
};

export default async function AdminMatchesPage() {
  const matches = await listMatches();

  return (
    <>
      <PageTitle
        title="Schedule"
        subtitle="Create and update fixtures and results."
        actionHref="/admin/matches/new"
        actionLabel="Add match"
      />

      <div className="card overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-surface-2/50 text-xs uppercase tracking-wider text-muted">
            <tr>
              <th className="px-4 py-3 font-semibold">Match</th>
              <th className="px-4 py-3 font-semibold">When</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Result</th>
              <th className="px-4 py-3 text-right font-semibold">Edit</th>
            </tr>
          </thead>
          <tbody>
            {matches.map((m) => (
              <tr key={m.id} className="border-b border-line/50 hover:bg-surface-2/40">
                <td className="px-4 py-3 font-medium text-heading">
                  {m.homeTeam.name} <span className="text-muted">vs</span> {m.awayTeam.name}
                </td>
                <td className="px-4 py-3 text-muted">
                  {formatMatchDate(m.dateTime)} · {formatMatchTime(m.dateTime)}
                </td>
                <td className={`px-4 py-3 font-semibold uppercase ${statusColor[m.status]}`}>
                  {m.status}
                </td>
                <td className="px-4 py-3 text-muted">{m.resultText ?? "—"}</td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/matches/${m.id}`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-heading hover:border-electric/50"
                  >
                    <Pencil size={13} /> Edit
                  </Link>
                </td>
              </tr>
            ))}
            {matches.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-muted">
                  No matches yet. Add your first fixture.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
