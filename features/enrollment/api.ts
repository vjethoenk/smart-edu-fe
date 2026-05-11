import axiosClient from "@/lib/axios";
import { ApiResponse, IEnrollment } from "@/types/api";

export const getEnrollmentApi = () => {
  return axiosClient.get<ApiResponse<IEnrollment[]>>(
    `/v1/enrollments/my-enrollments`,
  );
};
