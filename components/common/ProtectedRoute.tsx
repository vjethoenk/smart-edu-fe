"use client";

import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Cookies from "js-cookie";

export default function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles: string[];
}) {
  const router = useRouter();
  const reduxRole = useSelector((state: any) => state.auth.role);

  const currentRole = reduxRole || Cookies.get("role");

  useEffect(() => {
    if (!currentRole || !allowedRoles.includes(currentRole)) {
      router.push("/unauthorized");
    }
  }, [currentRole]);

  return <>{children}</>;
}
