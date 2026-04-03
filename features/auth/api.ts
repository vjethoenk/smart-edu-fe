import axiosClient from "@/lib/axios";
import { ApiResponse, IAuth } from "@/types/api";

export const loginApi = (data: { username: string; password: string }) => {
  return axiosClient.post<any, ApiResponse<IAuth>>("/v1/auth/login", data);
};
