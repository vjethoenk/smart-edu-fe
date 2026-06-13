import axiosClient from "@/lib/axios";
import { ApiResponse } from "@/types/api";
import { ICertificate, IVerifyCertificate } from "./types";

export const getCertificateByCourseApi = (courseId: string) => {
  return axiosClient.get<any, ApiResponse<ICertificate>>(
    `/v1/certificates/course/${courseId}`,
  );
};

export const verifyCertificateApi = (code: string) => {
  return axiosClient.get<any, ApiResponse<IVerifyCertificate>>(
    `/v1/certificates/verify/${code}`,
  );
};

export const getMyCertificatesApi = () => {
  return axiosClient.get<any, ApiResponse<ICertificate[]>>(`/v1/certificates/me`);
};

