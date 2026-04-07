import { useMutation } from "@tanstack/react-query";
import { loginApi } from "./api";
import { useDispatch } from "react-redux";
import { setAuth, logout } from "./slice";
import Cookies from "js-cookie";
import { clearAuthData } from "@/lib/auth-utils";

export const useLogin = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: loginApi,
    onSuccess: (res) => {
      const loginData = res.data;

      if (loginData) {
        localStorage.setItem("access_token", loginData.access_token);
        Cookies.set("access_token", res.data.access_token);
        Cookies.set("role", res.data.user.role?.name);
        dispatch(
          setAuth({
            user: loginData.user,
            role: loginData.user.role.name,
          }),
        );
      }
    },
  });
};

export const useLogout = () => {
  const dispatch = useDispatch();

  return () => {
    clearAuthData();
    dispatch(logout());
  };
};
