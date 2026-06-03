import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Trophy, Users } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/site/section-heading";
import { MatchCard } from "@/components/site/match-card";
import { StandingsTable } from "@/components/site/standings-table";
import { TeamLogo } from "@/components/site/team-logo";
import { getSettings } from "@/lib/content";
import { getUpcomingMatches, getStandings, getTeams } from "@/lib/queries";

export default async function HomePage() {
  const [settings, upcoming, standings, teams] = await Promise.all([
    getSettings(),
    getUpcomingMatches(3),
    getStandings(),
    getTeams(),
  ]);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-line">
        <Image
          src="/brand/flyer.jpg"
          alt=""
          fill
          priority
          className="object-cover opacity-15"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-2/85 via-ink/90 to-ink" />
        <div className="container-px relative py-20 sm:py-28 lg:py-36">
          <div className="max-w-3xl">
            <span className="chip border-brand/40 text-brand">
              <Trophy size={13} /> {settings.season}
            </span>
            <h1 className="mt-5 font-display text-5xl font-bold uppercase leading-[0.95] tracking-tight text-heading sm:text-6xl lg:text-7xl">
              {settings.heroTitle}
            </h1>
            <p className="mt-5 max-w-xl text-lg font-medium text-muted sm:text-xl">
              {settings.heroTagline}
            </p>
            <p className="mt-2 max-w-xl text-base text-muted/80">
              {settings.heroSubtitle}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/schedule" size="lg">
                View Schedule
              </ButtonLink>
              <ButtonLink href="/register" size="lg" variant="gold">
                Register a Team
              </ButtonLink>
              <ButtonLink href="/contact" size="lg" variant="outline">
                Contact Us
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK STAT STRIP */}
      <section className="border-b border-line bg-ink-2">
        <div className="container-px grid grid-cols-1 gap-4 py-8 sm:grid-cols-3">
          <QuickStat icon={<Users size={20} />} value={`${teams.length || 9}`} label="Teams" />
          <QuickStat
            icon={<CalendarDays size={20} />}
            value={`${upcoming.length}`}
            label="Upcoming Matches"
          />
          <QuickStat icon={<Trophy size={20} />} value="1" label="Champion Crowned" />
        </div>
      </section>

      {/* UPCOMING MATCHES */}
      <section className="container-px py-16">
        <SectionHeading
          eyebrow="Don't miss a ball"
          title="Upcoming Matches"
          href="/schedule"
          linkLabel="Full schedule"
        />
        {upcoming.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((m) => (
              <MatchCard key={m.id} match={m} />
            ))}
          </div>
        ) : (
          <EmptyNote>Fixtures will appear here once the schedule is published.</EmptyNote>
        )}
      </section>

      {/* STANDINGS SNAPSHOT */}
      <section className="container-px py-16">
        <SectionHeading
          eyebrow="Race to the top"
          title="Current Standings"
          href="/standings"
          linkLabel="Full table"
        />
        {standings.length > 0 ? (
          <StandingsTable rows={standings.slice(0, 6)} compact />
        ) : (
          <EmptyNote>The points table updates as results come in.</EmptyNote>
        )}
      </section>

      {/* TEAMS STRIP */}
      <section className="container-px py-16">
        <SectionHeading
          eyebrow="9 schools, 1 league"
          title="The Teams"
          href="/teams"
          linkLabel="All teams"
        />
        {teams.length > 0 ? (
          <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 lg:grid-cols-9">
            {teams.map((t) => (
              <Link
                key={t.id}
                href={`/teams/${t.slug}`}
                className="card flex flex-col items-center gap-2 p-4 transition-transform hover:-translate-y-1 hover:border-brand/40"
              >
                <TeamLogo name={t.name} logoUrl={t.logoUrl} color={t.primaryColor} size={56} />
                <span className="text-center text-xs font-semibold uppercase tracking-wide text-muted">
                  {t.name}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <Image
            src="/brand/all-team-logos.jpg"
            alt="USAHSC teams"
            width={1259}
            height={500}
            className="w-full rounded-2xl border border-line/70"
          />
        )}
      </section>

      {/* HIGHLIGHTS / CTA */}
      <section className="container-px py-16">
        <div className="card relative overflow-hidden p-8 sm:p-12">
          <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-brand/20 blur-3xl" />
          <div className="relative max-w-2xl">
            <h2 className="section-title">{settings.highlightsTitle}</h2>
            <p className="mt-4 text-muted">{settings.highlightsBody}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonLink href="/stats">
                View Stats <ArrowRight size={16} />
              </ButtonLink>
              <ButtonLink href={settings.cricclubsUrl} variant="secondary">
                Open CricClubs
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function QuickStat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-line bg-surface px-5 py-4 shadow-[var(--shadow-card)]">
      <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand/10 text-brand">
        {icon}
      </span>
      <div>
        <p className="font-display text-2xl font-bold leading-none text-heading">{value}</p>
        <p className="text-xs uppercase tracking-wider text-muted">{label}</p>
      </div>
    </div>
  );
}

function EmptyNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="card px-6 py-10 text-center text-sm text-muted">{children}</div>
  );
}
