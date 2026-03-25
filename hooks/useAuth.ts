import { useEffect } from "react";
import { useRouter } from "next/navigation";

export const useAuth = (allowedRoles?: string[]) => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const role = localStorage.getItem("user_role");

    if (!token) {
      router.push("/login");
      return;
    }

    if (allowedRoles && !allowedRoles.includes(role || "")) {
      router.push("/dashboard");
    }
  }, [router, allowedRoles]);
};
