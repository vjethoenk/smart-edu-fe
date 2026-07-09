"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/store/hook";
import { setAuth, logout, setInitializing } from "@/features/auth/slice";
import { accountApi } from "@/features/auth/api";
import { isTokenValid } from "@/lib/jwt";
import { clearAuthData } from "@/lib/auth-utils";

export default function AuthInitializer({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      dispatch(setInitializing(false));
      return;
    }

    // Check if token is valid and not expired
    if (!isTokenValid(token)) {
      clearAuthData();
      dispatch(logout());
      return;
    }

    // Fetch user account info
    accountApi()
      .then((res) => {
        const user = res.data.user;

        dispatch(
          setAuth({
            user,
            role: user.role?.name ?? null,
          }),
        );
      })
      .catch((err) => {
        // Handle 401 gracefully without hard redirect
        if (err?.status === 401 || err?.response?.status === 401) {
          clearAuthData();
          dispatch(logout());
          return;
        }

        console.log("AUTH ERROR", err);
        clearAuthData();
        dispatch(logout());
      });
  }, [dispatch]);

  return <>{children}</>;
}
