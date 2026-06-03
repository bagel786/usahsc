import Link from "next/link";
import { ArrowRight, Users } from "lucide-react";
import type { Standing, Team } from "@prisma/client";
import { TeamLogo } from "@/components/site/team-logo";

type Props = {
  team: Team & { standing: Standing | null; _count?: { players: number } };
};

export function TeamCard({ team }: Props) {
  const s = team.standing;
  const record = s ? `${s.wins}-${s.losses}` : "—";

  return (
    <Link
      href={`/teams/${team.slug}`}
      className="card group flex flex-col p-6 transition-all hover:-translate-y-1 hover:border-electric/40"
    >
      <div className="flex items-center gap-4">
        <TeamLogo name={team.name} logoUrl={team.logoUrl} color={team.primaryColor} size={64} />
        <div className="min-w-0">
          <h3 className="font-display text-xl font-bold uppercase leading-tight tracking-wide text-heading">
            {team.name}
          </h3>
          <p className="truncate text-sm text-muted">{team.school}</p>
          {team.mascot && (
            <span className="mt-1 inline-block text-xs font-semibold uppercase tracking-wider text-electric">
              {team.mascot}
            </span>
          )}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2 border-t border-line/60 pt-4 text-center">
        <Stat label="Record" value={record} />
        <Stat label="Points" value={s ? `${s.points}` : "—"} />
        <Stat
          label="Captain"
          value={team.captain ? team.captain.split(" ")[0] : "TBD"}
        />
      </div>

      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="flex items-center gap-1.5 text-muted">
          <Users size={14} /> {team._count?.players ?? 0} players
        </span>
        <span className="flex items-center gap-1 font-semibold uppercase tracking-wide text-electric opacity-0 transition-opacity group-hover:opacity-100">
          View <ArrowRight size={14} />
        </span>
      </div>
    </Link>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-display text-lg font-bold text-heading">{value}</p>
      <p className="text-[11px] uppercase tracking-wider text-muted">{label}</p>
    </div>
  );
}
