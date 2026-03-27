"use client";

import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles: string[];
}) {
  const router = useRouter();
  const role = useSelector((state: any) => state.auth.role);

  useEffect(() => {
    if (!role || !allowedRoles.includes(role)) {
      router.push("/unauthorized");
    }
  }, [role]);

  return <>{children}</>;
}
