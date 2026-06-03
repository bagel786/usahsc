import { prisma } from "@/lib/db";
import { PageTitle } from "@/components/admin/page-title";
import { MatchForm } from "../match-form";

export default async function NewMatchPage() {
  const teams = await prisma.team
    .findMany({ orderBy: { name: "asc" } })
    .catch(() => []);

  return (
    <>
      <PageTitle title="Add match" backHref="/admin/matches" />
      <MatchForm teams={teams} />
    </>
  );
}
