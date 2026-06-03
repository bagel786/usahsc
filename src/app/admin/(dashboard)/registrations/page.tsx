import { Trash2, Mail, Phone, Download } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { PageTitle } from "@/components/admin/page-title";
import { formatFullDate } from "@/lib/format";
import { setRegistrationStatus, deleteRegistration } from "./actions";

async function getRegistrations() {
  try {
    return await prisma.registration.findMany({ orderBy: { createdAt: "desc" } });
  } catch {
    return [];
  }
}

const STATUS_STYLES: Record<string, string> = {
  new: "bg-brand/20 text-brand-light",
  contacted: "bg-electric/15 text-electric",
  archived: "bg-surface-2 text-muted",
};

export default async function RegistrationsPage() {
  const regs = await getRegistrations();

  return (
    <>
      <div className="flex items-start justify-between gap-4">
        <PageTitle
          title="Registrations"
          subtitle="People and schools who want to join the league."
        />
        {regs.length > 0 && (
          <Link
            href="/admin/registrations/export"
            className="inline-flex items-center gap-2 rounded-lg border border-line px-4 py-2.5 text-sm font-semibold text-white hover:border-electric/50"
          >
            <Download size={16} /> Export CSV
          </Link>
        )}
      </div>

      <div className="space-y-4">
        {regs.map((r) => (
          <article key={r.id} className="card p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-lg font-bold uppercase tracking-wide text-white">
                    {r.name}
                  </h3>
                  <span className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${STATUS_STYLES[r.status] ?? ""}`}>
                    {r.status}
                  </span>
                </div>
                <p className="mt-0.5 text-sm text-muted">
                  {[r.school, r.role].filter(Boolean).join(" · ")}
                </p>
              </div>
              <span className="text-xs text-muted">{formatFullDate(r.createdAt)}</span>
            </div>

            <div className="mt-3 flex flex-wrap gap-4 text-sm">
              <a href={`mailto:${r.email}`} className="flex items-center gap-1.5 text-electric hover:text-white">
                <Mail size={14} /> {r.email}
              </a>
              {r.phone && (
                <a href={`tel:${r.phone}`} className="flex items-center gap-1.5 text-electric hover:text-white">
                  <Phone size={14} /> {r.phone}
                </a>
              )}
            </div>

            {r.message && (
              <p className="mt-3 rounded-lg bg-surface-2/40 px-4 py-3 text-sm text-muted">
                {r.message}
              </p>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-2">
              {["new", "contacted", "archived"].map((s) => (
                <form key={s} action={setRegistrationStatus}>
                  <input type="hidden" name="id" value={r.id} />
                  <input type="hidden" name="status" value={s} />
                  <button
                    disabled={r.status === s}
                    className="rounded-lg border border-line px-3 py-1.5 text-xs font-semibold capitalize text-muted transition-colors hover:border-electric/50 hover:text-white disabled:opacity-40"
                  >
                    Mark {s}
                  </button>
                </form>
              ))}
              <form action={deleteRegistration} className="ml-auto">
                <input type="hidden" name="id" value={r.id} />
                <button className="flex items-center gap-1.5 text-xs text-muted hover:text-brand-light">
                  <Trash2 size={14} /> Delete
                </button>
              </form>
            </div>
          </article>
        ))}
        {regs.length === 0 && (
          <p className="card px-6 py-10 text-center text-muted">No registrations yet.</p>
        )}
      </div>
    </>
  );
}
