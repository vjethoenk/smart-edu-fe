import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get("access_token")?.value;
  const role = request.cookies.get("role")?.value?.trim().toUpperCase();

  console.log("--- DEBUG MIDDLEWARE ---");
  console.log("Pathname:", pathname);
  console.log("Token exists:", !!accessToken);
  console.log("Role value:", role);

  if (pathname.startsWith("/admin")) {
    if (!accessToken) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Dùng includes hoặc so sánh chuẩn hóa
    const isAdmin = role === "ADMIN";

    if (!isAdmin) {
      console.log("CHẶN ADMIN VÌ ROLE KHÔNG KHỚP:", role);
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
