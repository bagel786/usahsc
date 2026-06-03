import { prisma } from "@/lib/db";
import { assertAdmin } from "@/lib/auth-guard";

function csvCell(v: unknown): string {
  const s = v == null ? "" : String(v);
  return `"${s.replace(/"/g, '""')}"`;
}

export async function GET() {
  await assertAdmin();
  const rows = await prisma.registration.findMany({
    orderBy: { createdAt: "desc" },
  });

  const header = ["Name", "School", "Email", "Phone", "Role", "Message", "Status", "Date"];
  const lines = [header.map(csvCell).join(",")];
  for (const r of rows) {
    lines.push(
      [r.name, r.school, r.email, r.phone, r.role, r.message, r.status, r.createdAt.toISOString()]
        .map(csvCell)
        .join(","),
    );
  }

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="usahsc-registrations.csv"`,
    },
  });
}
