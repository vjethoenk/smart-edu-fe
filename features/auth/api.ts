import axiosClient from "@/lib/axios";
import { ApiResponse, IAccount, IAuth } from "@/types/api";

export const loginApi = (data: { username: string; password: string }) => {
  return axiosClient.post<any, ApiResponse<IAuth>>("/v1/auth/login", data);
};
export const accountApi = () => {
  return axiosClient.get<ApiResponse<IAccount>>("/v1/auth/account");
};
export const registerApi = (data: { name: string; email: string; password: string }) => {
  return axiosClient.post<any, ApiResponse<any>>("/v1/user/register", data);
};

