import axiosClient from "@/lib/axios";
import { ApiResponse, ICategory } from "@/types/api";

export const getCategoriesApi = () => {
  return axiosClient.get<ApiResponse<ICategory[]>>("/v1/categories");
};

export const createCategoryApi = (data: {
  name: string;
  description: string;
}) => {
  return axiosClient.post<any, ApiResponse<ICategory>>("/v1/categories", data);
};

export const updateCategoryApi = (
  id: string,
  data: {
    name: string;
    description: string;
  },
) => {
  return axiosClient.put<any, ApiResponse<ICategory>>(
    `/v1/categories/${id}`,
    data,
  );
};

export const deleteCategoryApi = (id: string) => {
  return axiosClient.delete<any, ApiResponse<void>>(`/v1/categories/${id}`);
};
