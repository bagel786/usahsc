import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import { PageHeader } from "@/components/site/page-header";
import { StandingsTable } from "@/components/site/standings-table";
import { getStandings } from "@/lib/queries";
import { getSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: "Standings",
  description: "The USAHSC points table — wins, losses, points and net run rate.",
};

export default async function StandingsPage() {
  const [standings, settings] = await Promise.all([getStandings(), getSettings()]);

  return (
    <>
      <PageHeader
        eyebrow="Race to the title"
        title="Standings"
        description="Points table for the current season. Top four advance toward the championship."
      />
      <div className="container-px py-14">
        {standings.length > 0 ? (
          <StandingsTable rows={standings} />
        ) : (
          <p className="card px-6 py-10 text-center text-muted">
            The points table will appear once results are recorded.
          </p>
        )}

        <p className="mt-6 text-xs text-muted">
          P = Played · W = Won · L = Lost · T/NR = Tied / No result · NRR = Net run
          rate · Pts = Points
        </p>

        <div className="mt-4 flex items-center gap-2 text-sm text-muted">
          <ExternalLink size={15} />
          <a
            href={settings.cricclubsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-electric hover:text-heading"
          >
            View the official table on CricClubs
          </a>
        </div>
      </div>
    </>
  );
}
