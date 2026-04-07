import axiosClient from "@/lib/axios";
import { ApiResponse, ILesson } from "@/types/api";

export const getLessonApi = (id: string) => {
  return axiosClient.get<ApiResponse<ILesson[]>>(`/v1/lessons/${id}`);
};

export const createLessonApi = (data: ILesson) => {
  return axiosClient.post<any, ApiResponse<ILesson>>("/v1/lessons", data);
};

export const updateLessonApi = (id: string, data: ILesson) => {
  return axiosClient.put<any, ApiResponse<ILesson>>(`/v1/lessons/${id}`, data);
};

export const deleteLessonApi = (id: string) => {
  return axiosClient.delete<any, ApiResponse<void>>(`/v1/lessons/${id}`);
};

export const uploadVideoApi = (file: FormData) => {
  return axiosClient.post<any, ApiResponse<{ hlsUrl: string }>>(
    "/v1/video/upload",
    file,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
};
