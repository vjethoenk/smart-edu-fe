"use client";

import { useAppSelector } from "@/store/hook";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

export default function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles: string[];
}) {
  const router = useRouter();
  const { role: reduxRole, isInitializing } = useAppSelector((state) => state.auth);
  const [isAuthorized, setIsAuthorized] = useState(false);

  const currentRole = reduxRole || Cookies.get("role");

  useEffect(() => {
    if (!isInitializing) {
      if (!currentRole || !allowedRoles.includes(currentRole)) {
        router.push("/unauthorized");
      } else {
        setIsAuthorized(true);
      }
    }
  }, [currentRole, isInitializing, allowedRoles, router]);

  // Trong khi khởi tạo thông tin đăng nhập hoặc chưa được phân quyền, hiển thị loading spinner
  if (isInitializing || !isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return <>{children}</>;
}
