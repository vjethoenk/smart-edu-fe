import axiosClient from "@/lib/axios";
import { ApiResponse } from "@/types/api";

export interface IRole {
  _id?: string;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  isActive?: boolean;
}

export const roleApi = {
  // Get all roles
  getAll: () => {
    return axiosClient.get<ApiResponse<IRole[]>>("/v1/role");
  },

  // Get role by id
  getById: (id: string) => {
    return axiosClient.get<ApiResponse<IRole>>(`/v1/role/${id}`);
  },

  // Create new role
  create: (data: IRole) => {
    return axiosClient.post<ApiResponse<IRole>>("/v1/role", data);
  },

  // Update role
  update: (id: string, data: IRole) => {
    return axiosClient.put<ApiResponse<IRole>>(`/v1/role/${id}`, data);
  },

  // Delete role
  delete: (id: string) => {
    return axiosClient.delete<ApiResponse<any>>(`/v1/role/${id}`);
  },
};
