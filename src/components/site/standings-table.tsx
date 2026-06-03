import Link from "next/link";
import type { Standing, Team } from "@prisma/client";
import { TeamLogo } from "@/components/site/team-logo";
import { cn } from "@/lib/cn";

type Row = Standing & { team: Team };

export function StandingsTable({
  rows,
  compact = false,
}: {
  rows: Row[];
  compact?: boolean;
}) {
  return (
    <div className="card overflow-hidden">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-line bg-surface-2/50 text-xs uppercase tracking-wider text-muted">
          <tr>
            <th className="px-4 py-3 font-semibold">#</th>
            <th className="px-4 py-3 font-semibold">Team</th>
            <th className="px-3 py-3 text-center font-semibold">P</th>
            <th className="px-3 py-3 text-center font-semibold">W</th>
            <th className="px-3 py-3 text-center font-semibold">L</th>
            {!compact && (
              <th className="px-3 py-3 text-center font-semibold">T/NR</th>
            )}
            {!compact && (
              <th className="px-3 py-3 text-center font-semibold">NRR</th>
            )}
            <th className="px-4 py-3 text-center font-semibold text-heading">Pts</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={row.id}
              className={cn(
                "border-b border-line/50 transition-colors hover:bg-surface-2/40",
                i < 4 && "bg-electric/[0.04]",
              )}
            >
              <td className="px-4 py-3">
                <span
                  className={cn(
                    "inline-flex h-6 w-6 items-center justify-center rounded-md text-xs font-bold",
                    i < 4 ? "bg-electric/15 text-electric" : "text-muted",
                  )}
                >
                  {i + 1}
                </span>
              </td>
              <td className="px-4 py-3">
                <Link
                  href={`/teams/${row.team.slug}`}
                  className="flex items-center gap-2.5 font-semibold text-heading hover:text-electric"
                >
                  <TeamLogo
                    name={row.team.name}
                    logoUrl={row.team.logoUrl}
                    color={row.team.primaryColor}
                    size={28}
                  />
                  <span className="font-display uppercase tracking-wide">
                    {row.team.name}
                  </span>
                </Link>
              </td>
              <td className="px-3 py-3 text-center text-muted">{row.played}</td>
              <td className="px-3 py-3 text-center text-muted">{row.wins}</td>
              <td className="px-3 py-3 text-center text-muted">{row.losses}</td>
              {!compact && (
                <td className="px-3 py-3 text-center text-muted">{row.tiesNr}</td>
              )}
              {!compact && (
                <td className="px-3 py-3 text-center text-muted">
                  {row.netRunRate > 0 ? "+" : ""}
                  {row.netRunRate.toFixed(2)}
                </td>
              )}
              <td className="px-4 py-3 text-center font-display text-base font-bold text-gold">
                {row.points}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
