import type { NextAuthConfig } from "next-auth";

/**
 * Shared auth config. Route protection is handled by middleware
 * (optimistic cookie check) + server-side guards; this just sets the
 * session strategy and the login page.
 */
export const authConfig = {
  pages: { signIn: "/admin/login" },
  session: { strategy: "jwt" },
  trustHost: true,
  providers: [],
} satisfies NextAuthConfig;
