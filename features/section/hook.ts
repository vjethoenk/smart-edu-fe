import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createSectionApi,
  deleteSectionApi,
  getSectionApi,
  updateSectionApi,
  uploadImageApi,
} from "./api";
import { toast } from "sonner";

export const useGetSections = (id: string) => {
  return useQuery({
    queryKey: ["Sections"],
    queryFn: async () => {
      const res = await getSectionApi(id);
      return res.data;
    },
  });
};

export const useCreateSection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSectionApi,
    onSuccess: (data, variables: any) => {
      const courseId = variables.courseId;
      if (courseId) {
        queryClient.invalidateQueries({ queryKey: ["courses", courseId] });
      }
      queryClient.invalidateQueries({ queryKey: ["Sections"] });
      toast.success("Tạo chương học thành công");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Có lỗi xảy ra");
    },
  });
};

export const useUpdateSection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      updateSectionApi(id, data),
    onSuccess: (data, variables: any) => {
      const courseId = variables.data?.courseId;
      if (courseId) {
        queryClient.invalidateQueries({ queryKey: ["courses", courseId] });
      }
      queryClient.invalidateQueries({ queryKey: ["Sections"] });
      toast.success("Cập nhật chương học thành công");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Có lỗi xảy ra");
    },
  });
};

export const useDeleteSection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSectionApi,
    onSuccess: (data, variables: any, context: any) => {
      // Invalidate all courses to ensure UI is updated
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["Sections"] });
      toast.success("Xóa chương học thành công");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Có lỗi xảy ra");
    },
  });
};
