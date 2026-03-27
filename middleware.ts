import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get("access_token")?.value;
  const role = request.cookies.get("role")?.value;

  if (pathname.startsWith("/admin")) {
    if (!accessToken) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (role !== "ADMIN") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  if (pathname.startsWith("/teacher")) {
    if (!accessToken) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (role !== "TEACHER") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/teacher/:path*"],
};
