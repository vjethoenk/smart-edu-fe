import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isTokenValid } from "@/lib/jwt";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get("access_token")?.value;
  const role = request.cookies.get("role")?.value?.trim().toUpperCase();

  // Check if token is expired
  const tokenExpired = !isTokenValid(accessToken);

  if (pathname.startsWith("/admin")) {
    // If no token or token expired, redirect to home
    if (!accessToken || tokenExpired) {
      const response = NextResponse.redirect(new URL("/", request.url));
      // Clear expired token from cookies
      response.cookies.delete("access_token");
      response.cookies.delete("role");
      return response;
    }

    const isAdmin = role === "ADMIN";

    if (!isAdmin) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  if (pathname.startsWith("/teacher")) {
    // If no token or token expired, redirect to home
    if (!accessToken || tokenExpired) {
      const response = NextResponse.redirect(new URL("/", request.url));
      // Clear expired token from cookies
      response.cookies.delete("access_token");
      response.cookies.delete("role");
      return response;
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
