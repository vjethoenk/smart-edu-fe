import { useQuery, useMutation } from "@tanstack/react-query";
import { getCertificateByCourseApi, verifyCertificateApi, getMyCertificatesApi } from "./api";


export const useGetCertificateByCourse = (courseId: string, enabled = false) => {
  return useQuery({
    queryKey: ["certificate", "course", courseId],
    queryFn: () => getCertificateByCourseApi(courseId),
    enabled: enabled && !!courseId,
  });
};

export const useClaimCertificate = () => {
  return useMutation({
    mutationFn: (courseId: string) => getCertificateByCourseApi(courseId),
  });
};

export const useVerifyCertificate = (code: string) => {
  return useQuery({
    queryKey: ["certificate", "verify", code],
    queryFn: () => verifyCertificateApi(code),
    enabled: !!code,
    retry: false,
  });
};

export const useGetMyCertificates = () => {
  return useQuery({
    queryKey: ["certificates", "me"],
    queryFn: () => getMyCertificatesApi(),
    select: (res) => res.data,
  });
};

