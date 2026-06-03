import { Calendar, Clock, MapPin, ExternalLink } from "lucide-react";
import type { Match, Team } from "@prisma/client";
import { TeamLogo } from "@/components/site/team-logo";
import { formatMatchDate, formatMatchTime } from "@/lib/format";
import { cn } from "@/lib/cn";

type MatchWithTeams = Match & { homeTeam: Team; awayTeam: Team };

const statusStyles: Record<string, string> = {
  upcoming: "border-electric/40 text-electric",
  live: "border-brand/60 text-brand animate-pulse",
  completed: "border-line text-muted",
};

export function MatchCard({ match }: { match: MatchWithTeams }) {
  const completed = match.status === "completed";

  return (
    <article className="card flex flex-col gap-4 p-5 transition-colors hover:border-electric/40">
      <div className="flex items-center justify-between">
        <span className={cn("chip", statusStyles[match.status])}>
          {match.status === "live" ? "● Live" : match.status}
        </span>
        {match.stage && (
          <span className="text-xs font-semibold uppercase tracking-wide text-muted">
            {match.stage}
          </span>
        )}
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
        <TeamSide team={match.homeTeam} score={match.homeScore} completed={completed} />
        <div className="text-center font-display text-sm font-bold uppercase text-muted">
          vs
        </div>
        <TeamSide team={match.awayTeam} score={match.awayScore} completed={completed} align="right" />
      </div>

      {match.resultText && (
        <p className="rounded-lg bg-surface-2/60 px-3 py-2 text-center text-sm font-semibold text-gold">
          {match.resultText}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted">
        <span className="flex items-center gap-1.5">
          <Calendar size={13} /> {formatMatchDate(match.dateTime)}
        </span>
        {!completed && (
          <span className="flex items-center gap-1.5">
            <Clock size={13} /> {formatMatchTime(match.dateTime)}
          </span>
        )}
        {match.location && (
          <span className="flex items-center gap-1.5">
            <MapPin size={13} /> {match.location}
          </span>
        )}
      </div>

      {match.scorecardUrl && (
        <a
          href={match.scorecardUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="link-underline inline-flex w-fit items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-electric"
        >
          Full scorecard on CricClubs <ExternalLink size={12} />
        </a>
      )}
    </article>
  );
}

function TeamSide({
  team,
  score,
  completed,
  align = "left",
}: {
  team: Team;
  score: string | null;
  completed: boolean;
  align?: "left" | "right";
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3",
        align === "right" && "flex-row-reverse text-right",
      )}
    >
      <TeamLogo name={team.name} logoUrl={team.logoUrl} color={team.primaryColor} size={44} />
      <div className={cn(align === "right" && "items-end")}>
        <p className="font-display text-sm font-semibold uppercase leading-tight text-heading">
          {team.name}
        </p>
        {completed && score && (
          <p className="text-sm font-bold text-gold">{score}</p>
        )}
      </div>
    </div>
  );
}
