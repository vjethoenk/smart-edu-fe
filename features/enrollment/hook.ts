import { useQuery } from "@tanstack/react-query";
import { getEnrollmentApi } from "./api";

export const useEnrollment = () => {
  return useQuery({
    queryKey: ["enrollment"],
    queryFn: async () => {
      const response = await getEnrollmentApi();
      return response.data;
    },
  });
};
