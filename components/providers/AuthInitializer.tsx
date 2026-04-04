"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/store/hook";
import { setAuth, logout } from "@/features/auth/slice";
import { accountApi } from "@/features/auth/api";

export default function AuthInitializer({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    accountApi()
      .then((res) => {
        const user = res.data.user;

        dispatch(
          setAuth({
            user,
            role: user.role?.name,
          }),
        );
      })
      .catch((err) => {
        console.log("AUTH ERROR", err);
        //localStorage.removeItem("access_token");
        //dispatch(logout());
      });
  }, []);

  return <>{children}</>;
}
