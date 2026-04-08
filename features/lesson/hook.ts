import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createLessonApi,
  deleteLessonApi,
  getLessonApi,
  getLessonByIdApi,
  updateLessonApi,
  uploadVideoApi,
} from "./api";
import { toast } from "sonner";
import { ILesson } from "@/types/api";

export const useGetLessons = () => {
  return useQuery({
    queryKey: ["Lessons"],
    queryFn: async () => {
      const res = await getLessonApi();
      return res.data;
    },
  });
};

export const useCreateLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createLessonApi,
    onSuccess: (data, variables: any) => {
      const courseId = variables.courseId;
      if (courseId) {
        queryClient.invalidateQueries({ queryKey: ["courses", courseId] });
      }
      queryClient.invalidateQueries({ queryKey: ["Lessons"] });
      toast.success("Tạo bài học thành công");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Có lỗi xảy ra");
    },
  });
};

export const useGetByIdLesson = (id?: string) => {
  return useQuery({
    queryKey: ["Lessons", id],
    queryFn: async () => {
      if (!id) return null;
      const res = await getLessonByIdApi(id);
      return res.data;
    },
    enabled: !!id,
  });
};

export const useUpdateLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ILesson }) =>
      updateLessonApi(id, data),
    onSuccess: (data, variables: any) => {
      const courseId = variables.data?.courseId;
      if (courseId) {
        queryClient.invalidateQueries({ queryKey: ["courses", courseId] });
      }
      queryClient.invalidateQueries({ queryKey: ["Lessons"] });
      toast.success("Cập nhật bài học thành công");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Có lỗi xảy ra");
    },
  });
};

export const useDeleteLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteLessonApi,
    onSuccess: (data, variables: any, context: any) => {
      // Invalidate all courses to ensure UI is updated
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["Lessons"] });
      toast.success("Xóa bài học thành công");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Có lỗi xảy ra");
    },
  });
};

export const useUploadVideo = () => {
  return useMutation({
    mutationFn: uploadVideoApi,
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Upload video thất bại");
    },
  });
};
