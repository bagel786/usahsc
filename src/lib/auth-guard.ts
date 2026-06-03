import { redirect } from "next/navigation";
import { auth } from "@/auth";

/** For server components/pages: redirect to login when not authenticated. */
export async function requireAdmin() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  return session.user;
}

/** For server actions/route handlers: throw when not authenticated.
 *  This is the real security boundary for mutations (never trust the client
 *  or middleware alone). */
export async function assertAdmin() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  return session.user;
}
