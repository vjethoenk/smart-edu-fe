import { useMutation } from "@tanstack/react-query";
import { loginApi } from "./api";
import { useDispatch } from "react-redux";
import { setAuth } from "./slice";
import Cookies from "js-cookie";

export const useLogin = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: loginApi,
    onSuccess: (res) => {
      const { data } = res.data;

      // localStorage
      localStorage.setItem("access_token", data.accessToken);

      // cookie
      Cookies.set("access_token", data.accessToken);
      Cookies.set("role", data.user.role);

      dispatch(
        setAuth({
          user: data.user,
          role: data.user.role,
        }),
      );
    },
  });
};
