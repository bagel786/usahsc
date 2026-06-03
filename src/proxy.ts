import { NextRequest, NextResponse } from "next/server";

/**
 * Optimistic auth gate for /admin (Next.js proxy convention).
 * Redirects when no session cookie is present. This is UX only — the real
 * security boundary is server-side: `requireAdmin()` in the admin layout and
 * `assertAdmin()` in every mutation cryptographically verify the session.
 */
const SESSION_COOKIES = [
  "authjs.session-token",
  "__Secure-authjs.session-token",
];

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const hasSession = SESSION_COOKIES.some((name) => req.cookies.has(name));

  if (pathname === "/admin/login") {
    if (hasSession) return NextResponse.redirect(new URL("/admin", req.url));
    return NextResponse.next();
  }

  if (!hasSession) {
    const url = new URL("/admin/login", req.url);
    url.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
