import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("session_token")?.value;
  const role = request.cookies.get("user_role")?.value;
  const { pathname } = request.nextUrl;

  // 1. Nếu chưa login mà cố vào trang bảo mật
  if (
    !token &&
    (pathname.startsWith("/admin") || pathname.startsWith("/dashboard"))
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 2. Nếu là User thường mà cố vào /admin
  if (pathname.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 3. Nếu là Admin mà vào nhầm /dashboard của user (tùy bạn có muốn chặn không)
  if (pathname.startsWith("/dashboard") && role === "admin") {
    return NextResponse.redirect(
      new URL("/admin/admin-dashboard", request.url),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/login"],
};
