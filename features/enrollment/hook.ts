import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { getEnrollmentApi } from "./api";
import { RootState } from "@/store/type";

export const useEnrollment = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  return useQuery({
    queryKey: ["enrollment"],
    queryFn: async () => {
      const response = await getEnrollmentApi();
      return response.data;
    },
    enabled: !!user,
  });
};
