import { Trash2, Mail } from "lucide-react";
import { prisma } from "@/lib/db";
import { PageTitle } from "@/components/admin/page-title";
import { formatFullDate } from "@/lib/format";
import { setMessageStatus, deleteMessage } from "./actions";

async function getMessages() {
  try {
    return await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });
  } catch {
    return [];
  }
}

const STATUS_STYLES: Record<string, string> = {
  new: "bg-brand/20 text-brand-light",
  read: "bg-electric/15 text-electric",
  archived: "bg-surface-2 text-muted",
};

export default async function MessagesPage() {
  const messages = await getMessages();

  return (
    <>
      <PageTitle
        title="Messages"
        subtitle="Enquiries submitted through the contact form."
      />

      <div className="space-y-4">
        {messages.map((m) => (
          <article key={m.id} className="card p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-lg font-bold uppercase tracking-wide text-white">
                    {m.name}
                  </h3>
                  <span className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${STATUS_STYLES[m.status] ?? ""}`}>
                    {m.status}
                  </span>
                </div>
                <a href={`mailto:${m.email}`} className="mt-0.5 flex items-center gap-1.5 text-sm text-electric hover:text-white">
                  <Mail size={14} /> {m.email}
                </a>
              </div>
              <span className="text-xs text-muted">{formatFullDate(m.createdAt)}</span>
            </div>

            <p className="mt-3 whitespace-pre-wrap rounded-lg bg-surface-2/40 px-4 py-3 text-sm text-muted">
              {m.message}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              {["new", "read", "archived"].map((s) => (
                <form key={s} action={setMessageStatus}>
                  <input type="hidden" name="id" value={m.id} />
                  <input type="hidden" name="status" value={s} />
                  <button
                    disabled={m.status === s}
                    className="rounded-lg border border-line px-3 py-1.5 text-xs font-semibold capitalize text-muted transition-colors hover:border-electric/50 hover:text-white disabled:opacity-40"
                  >
                    Mark {s}
                  </button>
                </form>
              ))}
              <form action={deleteMessage} className="ml-auto">
                <input type="hidden" name="id" value={m.id} />
                <button className="flex items-center gap-1.5 text-xs text-muted hover:text-brand-light">
                  <Trash2 size={14} /> Delete
                </button>
              </form>
            </div>
          </article>
        ))}
        {messages.length === 0 && (
          <p className="card px-6 py-10 text-center text-muted">No messages yet.</p>
        )}
      </div>
    </>
  );
}
