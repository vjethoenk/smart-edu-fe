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
    // If token exists and is expired, redirect to home
    if (accessToken && tokenExpired) {
      const response = NextResponse.redirect(new URL("/", request.url));
      // Clear expired token from cookies
      response.cookies.delete("access_token");
      response.cookies.delete("role");
      return response;
    }

    // If no token in cookies, allow request to continue
    // Client-side AuthInitializer will handle token from localStorage
    if (!accessToken) {
      return NextResponse.next();
    }

    // Allow ADMIN and INSTRUCTOR to access /admin
    // But INSTRUCTOR can only access courses and questions
    if (role === "ADMIN") {
      return NextResponse.next();
    }

    if (role === "INSTRUCTOR") {
      const allowedPaths = ["/admin/courses", "/admin/questions"];
      if (
        allowedPaths.some(
          (path) => pathname === path || pathname.startsWith(path + "/"),
        )
      ) {
        return NextResponse.next();
      }
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  if (pathname.startsWith("/instructor")) {
    // If token exists and is expired, redirect to home
    if (accessToken && tokenExpired) {
      const response = NextResponse.redirect(new URL("/", request.url));
      response.cookies.delete("access_token");
      response.cookies.delete("role");
      return response;
    }

    // If no token in cookies, allow request to continue
    if (!accessToken) {
      return NextResponse.next();
    }

    if (role !== "INSTRUCTOR") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/instructor/:path*"],
};
