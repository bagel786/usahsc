import type { Metadata } from "next";
import { PageHeader } from "@/components/site/page-header";
import { TeamCard } from "@/components/site/team-card";
import { getTeams } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Teams",
  description: "Meet the high-school teams competing in the USAHSC.",
};

export default async function TeamsPage() {
  const teams = await getTeams();

  return (
    <>
      <PageHeader
        eyebrow="9 schools, 1 league"
        title="The Teams"
        description="Every school fielding a side in the USA High School Cricket League."
      />
      <div className="container-px py-14">
        {teams.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {teams.map((team) => (
              <TeamCard key={team.id} team={team} />
            ))}
          </div>
        ) : (
          <p className="card px-6 py-10 text-center text-muted">
            Teams will be listed here soon.
          </p>
        )}
      </div>
    </>
  );
}
