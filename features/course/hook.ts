import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createCourseApi,
  deleteCourseApi,
  getCoursesApi,
  getCoursesByIdApi,
  updateCourseApi,
  uploadImageApi,
} from "./api";
import { toast } from "sonner";

export const useGetCourses = () => {
  return useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const res = await getCoursesApi();
      return res.data;
    },
  });
};

export const useGetByIdCourse = (id: string) => {
  return useQuery({
    queryKey: ["courses", id],
    queryFn: async () => {
      const res = await getCoursesByIdApi(id);
      return res.data;
    },
  });
};

export const useCreateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCourseApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast.success("Tạo khóa học thành công");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Có lỗi xảy ra");
    },
  });
};

export const useUpdateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      updateCourseApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast.success("Cập nhật khóa học thành công");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Có lỗi xảy ra");
    },
  });
};

export const useDeleteCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCourseApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast.success("Xóa khóa học thành công");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Có lỗi xảy ra");
    },
  });
};

export const useUploadImage = () => {
  return useMutation({
    mutationFn: uploadImageApi,
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Upload ảnh thất bại");
    },
  });
};
