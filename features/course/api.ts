import axiosClient from "@/lib/axios";
import { ApiResponse, ICourse } from "@/types/api";

export const getCoursesApi = () => {
  return axiosClient.get<ApiResponse<ICourse[]>>("/v1/courses");
};

export const getCoursesByIdApi = (id: string) => {
  return axiosClient.get<ApiResponse<ICourse>>(`/v1/courses/${id}`);
};

export const createCourseApi = (data: {
  title: string;
  description: string;
  thumbnail: string;
  price: string;
  level: string;
  categoryId: string;
  isPublished: boolean;
}) => {
  return axiosClient.post<any, ApiResponse<ICourse>>("/v1/courses", data);
};

export const updateCourseApi = (
  id: string,
  data: {
    title: string;
    description: string;
    thumbnail: string;
    price: string;
    level: string;
    categoryId: string;
    isPublished: boolean;
  },
) => {
  return axiosClient.put<any, ApiResponse<ICourse>>(`/v1/courses/${id}`, data);
};

export const deleteCourseApi = (id: string) => {
  return axiosClient.delete<any, ApiResponse<void>>(`/v1/courses/${id}`);
};

export const uploadImageApi = (file: FormData) => {
  return axiosClient.post<any, ApiResponse<{ url: string }>>(
    "/v1/upload/image",
    file,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
};
