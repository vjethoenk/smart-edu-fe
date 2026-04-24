import axiosClient from "@/lib/axios";
import { ApiResponse, IUser } from "@/types/api";

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  role: string; // role id
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  password?: string;
  role?: string;
}

export interface UserResponse {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export const userApi = {
  // Get all users
  getAll: (skip = 0, limit = 10) => {
    return axiosClient.get<ApiResponse<UserResponse[]>>(
      `/v1/user?skip=${skip}&limit=${limit}`,
    );
  },

  // Get user by id
  getById: (id: string) => {
    return axiosClient.get<ApiResponse<IUser>>(`/v1/user/${id}`);
  },

  // Create new user
  create: (data: CreateUserRequest) => {
    return axiosClient.post<ApiResponse<IUser>>("/v1/user", data);
  },

  // Update user
  update: (id: string, data: UpdateUserRequest) => {
    return axiosClient.put<ApiResponse<IUser>>(`/v1/user/${id}`, data);
  },

  // Delete user
  delete: (id: string) => {
    return axiosClient.delete<ApiResponse<any>>(`/v1/user/${id}`);
  },
};
