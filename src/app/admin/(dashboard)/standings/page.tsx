import { prisma } from "@/lib/db";
import { PageTitle } from "@/components/admin/page-title";
import { SubmitButton } from "@/components/admin/submit-button";
import { TeamLogo } from "@/components/site/team-logo";
import { saveStanding } from "./actions";

async function getRows() {
  try {
    return await prisma.team.findMany({
      where: { isActive: true },
      orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
      include: { standing: true },
    });
  } catch {
    return [];
  }
}

const NUM_FIELDS = [
  { key: "played", label: "P" },
  { key: "wins", label: "W" },
  { key: "losses", label: "L" },
  { key: "tiesNr", label: "T/NR" },
  { key: "points", label: "Pts" },
] as const;

export default async function AdminStandingsPage() {
  const teams = await getRows();

  return (
    <>
      <PageTitle
        title="Standings"
        subtitle="Edit each team's record. Changes save per row and update the public table."
      />

      <div className="space-y-3">
        {teams.map((t) => {
          const s = t.standing;
          return (
            <form
              key={t.id}
              action={saveStanding}
              className="card flex flex-wrap items-end gap-4 p-4"
            >
              <input type="hidden" name="teamId" value={t.id} />
              <div className="flex min-w-44 items-center gap-2.5">
                <TeamLogo name={t.name} logoUrl={t.logoUrl} color={t.primaryColor} size={32} />
                <span className="font-display font-semibold uppercase tracking-wide text-heading">
                  {t.name}
                </span>
              </div>

              {NUM_FIELDS.map((f) => (
                <label key={f.key} className="text-xs text-muted">
                  <span className="mb-1 block uppercase tracking-wide">{f.label}</span>
                  <input
                    name={f.key}
                    type="number"
                    defaultValue={s ? (s[f.key] as number) : 0}
                    className="w-16 rounded-lg border border-line bg-surface px-2 py-1.5 text-center text-sm text-heading outline-none focus:border-electric"
                  />
                </label>
              ))}

              <label className="text-xs text-muted">
                <span className="mb-1 block uppercase tracking-wide">NRR</span>
                <input
                  name="netRunRate"
                  type="number"
                  step="0.01"
                  defaultValue={s?.netRunRate ?? 0}
                  className="w-20 rounded-lg border border-line bg-surface px-2 py-1.5 text-center text-sm text-heading outline-none focus:border-electric"
                />
              </label>

              <SubmitButton variant="secondary" className="ml-auto">
                Save
              </SubmitButton>
            </form>
          );
        })}
        {teams.length === 0 && (
          <p className="card px-4 py-10 text-center text-muted">
            Add teams first, then set their standings here.
          </p>
        )}
      </div>
    </>
  );
}
