"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function GoogleCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const url = new URL(window.location.href);

    const accessToken = url.searchParams.get("access_token");
    const role = url.searchParams.get("role");

    if (accessToken && role) {
      localStorage.setItem("access_token", accessToken);
      Cookies.set("access_token", accessToken, {
        expires: 1,
        sameSite: "lax",
      });

      Cookies.set("role", role, {
        expires: 1,
        sameSite: "lax",
      });

      window.history.replaceState({}, document.title, "/");

      router.replace("/");
    } else {
      router.replace("/");
    }
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-lg text-gray-600">Đang xử lý đăng nhập...</p>
      </div>
    </div>
  );
}
