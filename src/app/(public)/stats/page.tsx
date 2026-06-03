import type { Metadata } from "next";
import { ExternalLink, TrendingUp, Target, Award } from "lucide-react";
import type { StatLeader, Team } from "@prisma/client";
import { PageHeader } from "@/components/site/page-header";
import { TeamLogo } from "@/components/site/team-logo";
import { getStatLeaders } from "@/lib/queries";
import { getSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: "Stats",
  description: "Batting leaders, bowling leaders and the MVP race in the USAHSC.",
};

type Leader = StatLeader & { team: Team | null };

export default async function StatsPage() {
  const [batting, bowling, mvp, settings] = await Promise.all([
    getStatLeaders("batting"),
    getStatLeaders("bowling"),
    getStatLeaders("mvp"),
    getSettings(),
  ]);

  return (
    <>
      <PageHeader
        eyebrow="Who's leading the way"
        title="Stats & Leaders"
        description="The standout performers driving their teams this season."
      />
      <div className="container-px py-14">
        <div className="grid gap-6 lg:grid-cols-3">
          <LeaderCard
            icon={<TrendingUp size={20} />}
            title="Batting Leaders"
            metric="Runs"
            leaders={batting}
          />
          <LeaderCard
            icon={<Target size={20} />}
            title="Bowling Leaders"
            metric="Wickets"
            leaders={bowling}
          />
          <LeaderCard
            icon={<Award size={20} />}
            title="MVP Race"
            metric="Impact"
            leaders={mvp}
            gold
          />
        </div>

        <div className="mt-10 flex items-center gap-2 text-sm text-muted">
          <ExternalLink size={15} />
          <a
            href={settings.cricclubsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-electric hover:text-brand"
          >
            Full statistics on CricClubs
          </a>
        </div>
      </div>
    </>
  );
}

function LeaderCard({
  icon,
  title,
  metric,
  leaders,
  gold,
}: {
  icon: React.ReactNode;
  title: string;
  metric: string;
  leaders: Leader[];
  gold?: boolean;
}) {
  return (
    <section className="card overflow-hidden">
      <div className="flex items-center gap-3 border-b border-line bg-surface-2/60 px-5 py-4">
        <span
          className={`inline-flex h-10 w-10 items-center justify-center rounded-lg ${
            gold ? "bg-gold/15 text-gold" : "bg-brand/10 text-brand"
          }`}
        >
          {icon}
        </span>
        <h2 className="font-display text-lg font-bold uppercase tracking-wide text-heading">
          {title}
        </h2>
      </div>
      {leaders.length > 0 ? (
        <ol className="divide-y divide-line/50">
          {leaders.map((l, i) => (
            <li key={l.id} className="flex items-center gap-3 px-5 py-3.5">
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-sm font-bold ${
                  i === 0
                    ? gold
                      ? "bg-gold/15 text-gold"
                      : "bg-brand/10 text-brand"
                    : "text-muted"
                }`}
              >
                {i + 1}
              </span>
              {l.team && (
                <TeamLogo
                  name={l.team.name}
                  logoUrl={l.team.logoUrl}
                  color={l.team.primaryColor}
                  size={28}
                />
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-heading">{l.playerName}</p>
                {l.detail && (
                  <p className="truncate text-xs text-muted">{l.detail}</p>
                )}
              </div>
              <span className="shrink-0 font-display text-sm font-bold text-gold">
                {l.value}
              </span>
            </li>
          ))}
        </ol>
      ) : (
        <p className="px-5 py-8 text-center text-sm text-muted">
          {metric} leaders will appear here.
        </p>
      )}
    </section>
  );
}
