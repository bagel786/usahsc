import { Trash2 } from "lucide-react";
import { prisma } from "@/lib/db";
import { PageTitle } from "@/components/admin/page-title";
import { Field, Input, Select } from "@/components/admin/form";
import { SubmitButton } from "@/components/admin/submit-button";
import { addStatLeader, deleteStatLeader } from "./actions";

const CATEGORIES = [
  { id: "batting", label: "Batting Leaders", metric: "e.g. 241 runs" },
  { id: "bowling", label: "Bowling Leaders", metric: "e.g. 11 wkts" },
  { id: "mvp", label: "MVP Race", metric: "e.g. 241 runs · 6 wkts" },
] as const;

async function getData() {
  try {
    const [leaders, teams] = await Promise.all([
      prisma.statLeader.findMany({ orderBy: { rank: "asc" }, include: { team: true } }),
      prisma.team.findMany({ orderBy: { name: "asc" } }),
    ]);
    return { leaders, teams };
  } catch {
    return { leaders: [], teams: [] };
  }
}

export default async function AdminStatsPage() {
  const { leaders, teams } = await getData();

  return (
    <>
      <PageTitle
        title="Stats & Leaders"
        subtitle="Manage batting, bowling and MVP leaders shown on the Stats page."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {CATEGORIES.map((cat) => {
          const items = leaders.filter((l) => l.category === cat.id);
          return (
            <section key={cat.id} className="card overflow-hidden">
              <div className="border-b border-line/60 px-5 py-4">
                <h2 className="font-display text-lg font-bold uppercase tracking-wide text-heading">
                  {cat.label}
                </h2>
              </div>

              <ul className="divide-y divide-line/50">
                {items.map((l) => (
                  <li key={l.id} className="flex items-center gap-2 px-4 py-3">
                    <span className="w-5 text-xs font-bold text-muted">{l.rank}</span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-heading">{l.playerName}</p>
                      <p className="truncate text-xs text-muted">
                        {l.value}
                        {l.team ? ` · ${l.team.name}` : ""}
                      </p>
                    </div>
                    <form action={deleteStatLeader}>
                      <input type="hidden" name="id" value={l.id} />
                      <button className="text-muted hover:text-brand-light" aria-label="Remove">
                        <Trash2 size={15} />
                      </button>
                    </form>
                  </li>
                ))}
                {items.length === 0 && (
                  <li className="px-4 py-6 text-center text-sm text-muted">None yet.</li>
                )}
              </ul>

              <form action={addStatLeader} className="space-y-3 border-t border-line/60 p-4">
                <input type="hidden" name="category" value={cat.id} />
                <Field label="Player" htmlFor={`${cat.id}-player`}>
                  <Input id={`${cat.id}-player`} name="playerName" required placeholder="Player name" />
                </Field>
                <Field label="Value" htmlFor={`${cat.id}-value`}>
                  <Input id={`${cat.id}-value`} name="value" required placeholder={cat.metric} />
                </Field>
                <Field label="Detail" htmlFor={`${cat.id}-detail`}>
                  <Input id={`${cat.id}-detail`} name="detail" placeholder="Avg 60.3 · SR 142" />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Team" htmlFor={`${cat.id}-team`}>
                    <Select id={`${cat.id}-team`} name="teamId" defaultValue="">
                      <option value="">—</option>
                      {teams.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                    </Select>
                  </Field>
                  <Field label="Rank" htmlFor={`${cat.id}-rank`}>
                    <Input id={`${cat.id}-rank`} name="rank" type="number" defaultValue={items.length + 1} />
                  </Field>
                </div>
                <SubmitButton variant="secondary">Add</SubmitButton>
              </form>
            </section>
          );
        })}
      </div>
    </>
  );
}
