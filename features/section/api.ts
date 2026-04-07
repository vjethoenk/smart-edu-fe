import axiosClient from "@/lib/axios";
import { ApiResponse, ISection } from "@/types/api";

export const getSectionApi = (id: string) => {
  return axiosClient.get<ApiResponse<ISection[]>>(`/v1/Sections/${id}`);
};

export const createSectionApi = (data: ISection) => {
  return axiosClient.post<any, ApiResponse<ISection>>("/v1/Sections", data);
};

export const updateSectionApi = (id: string, data: ISection) => {
  return axiosClient.put<any, ApiResponse<ISection>>(
    `/v1/Sections/${id}`,
    data,
  );
};

export const deleteSectionApi = (id: string) => {
  return axiosClient.delete<any, ApiResponse<void>>(`/v1/Sections/${id}`);
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
