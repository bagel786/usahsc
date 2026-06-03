import { notFound } from "next/navigation";
import { Trash2, Star } from "lucide-react";
import { prisma } from "@/lib/db";
import { PageTitle } from "@/components/admin/page-title";
import { Field, Input, Select, Checkbox } from "@/components/admin/form";
import { SubmitButton } from "@/components/admin/submit-button";
import { TeamForm } from "../team-form";
import { addPlayer, deletePlayer, deleteTeam } from "../actions";

const ROLES = ["Batter", "Bowler", "All-rounder", "Wicketkeeper"];

async function getTeam(id: string) {
  try {
    return await prisma.team.findUnique({
      where: { id },
      include: { players: { orderBy: [{ order: "asc" }, { name: "asc" }] } },
    });
  } catch {
    return null;
  }
}

export default async function EditTeamPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const team = await getTeam(id);
  if (!team) notFound();

  return (
    <>
      <PageTitle title={`Edit ${team.name}`} backHref="/admin/teams" />

      <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <section>
          <h2 className="mb-4 font-display text-lg font-bold uppercase tracking-wide text-white">
            Team details
          </h2>
          <TeamForm team={team} />

          <form action={deleteTeam} className="mt-8 border-t border-line/60 pt-6">
            <input type="hidden" name="id" value={team.id} />
            <SubmitButton variant="danger" confirm={`Delete ${team.name}? This also removes its players, matches and standings.`}>
              <Trash2 size={15} /> Delete team
            </SubmitButton>
          </form>
        </section>

        {/* Roster */}
        <section>
          <h2 className="mb-4 font-display text-lg font-bold uppercase tracking-wide text-white">
            Roster ({team.players.length})
          </h2>

          <div className="card mb-5 divide-y divide-line/50">
            {team.players.map((p) => (
              <div key={p.id} className="flex items-center gap-3 px-4 py-2.5">
                <span className="flex h-7 w-7 items-center justify-center rounded bg-surface-2 text-xs font-bold text-muted">
                  {p.jerseyNumber ?? "–"}
                </span>
                <span className="flex-1 font-medium text-white">
                  {p.name}
                  {p.isCaptain && (
                    <Star size={13} className="ml-1.5 inline text-gold" fill="currentColor" />
                  )}
                </span>
                {p.role && <span className="text-xs text-muted">{p.role}</span>}
                <form action={deletePlayer}>
                  <input type="hidden" name="id" value={p.id} />
                  <input type="hidden" name="teamId" value={team.id} />
                  <button className="text-muted hover:text-brand-light" aria-label="Remove player">
                    <Trash2 size={15} />
                  </button>
                </form>
              </div>
            ))}
            {team.players.length === 0 && (
              <p className="px-4 py-6 text-center text-sm text-muted">No players yet.</p>
            )}
          </div>

          <form action={addPlayer} className="card space-y-4 p-5">
            <input type="hidden" name="teamId" value={team.id} />
            <h3 className="font-display text-sm font-bold uppercase tracking-wide text-white">
              Add player
            </h3>
            <Field label="Name" htmlFor="pname">
              <Input id="pname" name="name" required placeholder="Player name" />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Jersey #" htmlFor="jersey">
                <Input id="jersey" name="jerseyNumber" type="number" min="0" />
              </Field>
              <Field label="Role" htmlFor="role">
                <Select id="role" name="role" defaultValue="">
                  <option value="">—</option>
                  {ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>
            <Checkbox label="Team captain" name="isCaptain" />
            <SubmitButton>Add player</SubmitButton>
          </form>
        </section>
      </div>
    </>
  );
}
