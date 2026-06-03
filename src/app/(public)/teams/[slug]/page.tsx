import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Shield } from "lucide-react";
import { InstagramIcon } from "@/components/ui/icons";
import { TeamLogo } from "@/components/site/team-logo";
import { MatchCard } from "@/components/site/match-card";
import { getTeamBySlug, getMatchesForTeam } from "@/lib/queries";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const team = await getTeamBySlug(slug);
  if (!team) return { title: "Team" };
  return { title: team.name, description: `${team.name} — ${team.school}` };
}

export default async function TeamDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const team = await getTeamBySlug(slug);
  if (!team) notFound();

  const matches = await getMatchesForTeam(team.id);
  const s = team.standing;

  return (
    <>
      {/* Team hero */}
      <section
        className="border-b border-line/70"
        style={{
          backgroundImage: `linear-gradient(180deg, ${team.primaryColor ?? "#16285a"}22, transparent)`,
        }}
      >
        <div className="container-px py-12">
          <Link
            href="/teams"
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted hover:text-heading"
          >
            <ArrowLeft size={16} /> All teams
          </Link>
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            <TeamLogo
              name={team.name}
              logoUrl={team.logoUrl}
              color={team.primaryColor}
              size={104}
            />
            <div>
              <h1 className="font-display text-4xl font-bold uppercase tracking-tight text-heading sm:text-5xl">
                {team.name}
              </h1>
              <p className="mt-1 text-muted">{team.school}</p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {team.mascot && <span className="chip">{team.mascot}</span>}
                {team.captain && (
                  <span className="chip">
                    <Shield size={12} /> Captain: {team.captain}
                  </span>
                )}
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                {team.cricclubsUrl && (
                  <a
                    href={team.cricclubsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-electric hover:text-heading"
                  >
                    <ExternalLink size={14} /> CricClubs profile
                  </a>
                )}
                {team.instagramUrl && (
                  <a
                    href={team.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-electric hover:text-heading"
                  >
                    <InstagramIcon size={14} /> Instagram
                  </a>
                )}
              </div>
            </div>
          </div>

          {s && (
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:max-w-2xl">
              <StatBox label="Played" value={s.played} />
              <StatBox label="Won" value={s.wins} />
              <StatBox label="Lost" value={s.losses} />
              <StatBox label="Points" value={s.points} highlight />
            </div>
          )}
        </div>
      </section>

      <div className="container-px grid gap-12 py-14 lg:grid-cols-[1fr_1.2fr]">
        {/* Roster */}
        <section>
          <h2 className="section-title mb-6 text-2xl">Roster</h2>
          {team.bio && <p className="mb-6 text-sm text-muted">{team.bio}</p>}
          {team.players.length > 0 ? (
            <ul className="card divide-y divide-line/60">
              {team.players.map((p) => (
                <li key={p.id} className="flex items-center gap-3 px-4 py-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-2 text-sm font-bold text-muted">
                    {p.jerseyNumber ?? "–"}
                  </span>
                  <span className="font-semibold text-heading">{p.name}</span>
                  {p.isCaptain && (
                    <span className="chip border-gold/40 text-gold">C</span>
                  )}
                  {p.role && (
                    <span className="ml-auto text-xs uppercase tracking-wide text-muted">
                      {p.role}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="card px-4 py-8 text-center text-sm text-muted">
              Roster coming soon.
            </p>
          )}
        </section>

        {/* Fixtures */}
        <section>
          <h2 className="section-title mb-6 text-2xl">Fixtures &amp; Results</h2>
          {matches.length > 0 ? (
            <div className="grid gap-4">
              {matches.map((m) => (
                <MatchCard key={m.id} match={m} />
              ))}
            </div>
          ) : (
            <p className="card px-4 py-8 text-center text-sm text-muted">
              No matches scheduled yet.
            </p>
          )}
        </section>
      </div>
    </>
  );
}

function StatBox({
  label,
  value,
  highlight,
}: {
  label: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <div className="card px-4 py-3 text-center">
      <p
        className={`font-display text-2xl font-bold ${highlight ? "text-gold" : "text-heading"}`}
      >
        {value}
      </p>
      <p className="text-xs uppercase tracking-wider text-muted">{label}</p>
    </div>
  );
}
