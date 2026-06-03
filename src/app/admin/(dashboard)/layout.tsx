import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth-guard";
import { AdminShell } from "@/components/admin/admin-shell";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdmin();
  return <AdminShell email={user.email ?? ""}>{children}</AdminShell>;
}
