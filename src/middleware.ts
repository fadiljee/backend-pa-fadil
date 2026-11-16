import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { adminSessionOptions, AdminSessionData } from "@/lib/auth/session-options";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin") || pathname === "/login") {
    const res = NextResponse.next();
    const session = await getIronSession<AdminSessionData>(req, res, adminSessionOptions);

    if (pathname.startsWith("/admin") && !session.isLoggedIn) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    if (pathname === "/login" && session.isLoggedIn) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }

    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
};
