import { notFound } from "next/navigation";
import { Trash2 } from "lucide-react";
import { prisma } from "@/lib/db";
import { PageTitle } from "@/components/admin/page-title";
import { SubmitButton } from "@/components/admin/submit-button";
import { MatchForm } from "../match-form";
import { deleteMatch } from "../actions";

export default async function EditMatchPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [match, teams] = await Promise.all([
    prisma.match.findUnique({ where: { id } }).catch(() => null),
    prisma.team.findMany({ orderBy: { name: "asc" } }).catch(() => []),
  ]);
  if (!match) notFound();

  return (
    <>
      <PageTitle title="Edit match" backHref="/admin/matches" />
      <MatchForm teams={teams} match={match} />

      <form action={deleteMatch} className="mt-8 max-w-2xl border-t border-line/60 pt-6">
        <input type="hidden" name="id" value={match.id} />
        <SubmitButton variant="danger" confirm="Delete this match?">
          <Trash2 size={15} /> Delete match
        </SubmitButton>
      </form>
    </>
  );
}
