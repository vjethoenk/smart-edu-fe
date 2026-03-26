import http from "@/lib/http";

export const authService = {
  login: (data: any) => http.post("/auth/login", data).then((res) => res.data),
  register: (data: any) =>
    http.post("/auth/register", data).then((res) => res.data),
};
