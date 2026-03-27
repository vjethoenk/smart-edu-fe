import axiosClient from "@/lib/axios";
import { ApiResponse } from "@/types/api";

export const loginApi = (data: { email: string; password: string }) => {
  return axiosClient.post<ApiResponse<any>>("/v1/auth/login", data);
};
