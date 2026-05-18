import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_COOKIE = "portfolio-auth-token";
const AUTH_TOKEN = "cleo-auth-session-2026";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/dashboard")) {
    const token = request.cookies.get(AUTH_COOKIE);
    if (token?.value !== AUTH_TOKEN) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  if (pathname === "/login") {
    const token = request.cookies.get(AUTH_COOKIE);
    if (token?.value === AUTH_TOKEN) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
