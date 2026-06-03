import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import { PageHeader } from "@/components/site/page-header";
import { MatchCard } from "@/components/site/match-card";
import { TabSwitch } from "@/components/site/tab-switch";
import { getUpcomingMatches, getResults } from "@/lib/queries";
import { getSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: "Schedule & Results",
  description: "Upcoming fixtures and past results from the USAHSC season.",
};

export default async function SchedulePage() {
  const [upcoming, results, settings] = await Promise.all([
    getUpcomingMatches(),
    getResults(),
    getSettings(),
  ]);

  const grid = (items: typeof upcoming, empty: string) =>
    items.length > 0 ? (
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {items.map((m) => (
          <MatchCard key={m.id} match={m} />
        ))}
      </div>
    ) : (
      <p className="card px-6 py-10 text-center text-muted">{empty}</p>
    );

  return (
    <>
      <PageHeader
        eyebrow="Fixtures & results"
        title="Schedule"
        description="Every match in the season — upcoming fixtures and final results."
      />
      <div className="container-px py-14">
        <TabSwitch
          tabs={[
            {
              id: "upcoming",
              label: "Upcoming",
              count: upcoming.length,
              content: grid(upcoming, "No upcoming fixtures published yet."),
            },
            {
              id: "results",
              label: "Results",
              count: results.length,
              content: grid(results, "Results will appear here after matches are played."),
            },
          ]}
        />

        <div className="mt-10 flex items-center gap-2 text-sm text-muted">
          <ExternalLink size={15} />
          <span>
            Full scorecards and ball-by-ball detail are on{" "}
            <a
              href={settings.cricclubsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-electric hover:text-heading"
            >
              CricClubs
            </a>
            .
          </span>
        </div>
      </div>
    </>
  );
}
