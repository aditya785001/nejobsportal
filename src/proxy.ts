import { NextResponse } from "next/server";

/**
 * Proxy (replaces middleware in Next.js 16).
 *
 * Only handles static file routing and public path permissions.
 * Auth is handled client-side (useSession redirects) and
 * server-side (API routes with auth() calls).
 *
 * This avoids Edge Runtime issues with Node.js built-in modules
 * (node:crypto, node:path, node:url) that Prisma/NextAuth depend on.
 */
const publicPaths = [
  "/login",
  "/onboarding",
  "/_next",
  "/favicon",
  "/images",
  "/fonts",
];

export default function middleware(req: { nextUrl: URL }) {
  const { pathname } = req.nextUrl;

  // Allow all public paths
  if (publicPaths.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Allow static files
  if (pathname.match(/\.(png|jpg|jpeg|gif|svg|ico|css|js|woff2?)$/)) {
    return NextResponse.next();
  }

  // Allow all API routes — they handle auth internally
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
};
