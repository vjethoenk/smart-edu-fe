import { useMutation } from "@tanstack/react-query";
import { loginApi } from "./api";
import { useDispatch } from "react-redux";
import { setAuth } from "./slice";

export const useLogin = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: loginApi,
    onSuccess: (res) => {
      const loginData = res.data;

      if (loginData) {
        localStorage.setItem("access_token", loginData.access_token);
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
