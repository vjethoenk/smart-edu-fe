import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createCourseApi,
  deleteCourseApi,
  getCoursesApi,
  getCoursesByIdApi,
  getCourseMonitoringApi,
  updateApprovalApi,
  updateCourseApi,
  uploadImageApi,
  getPurchaseCountApi,
} from "./api";
import { toast } from "sonner";

export const useGetCourses = () => {
  return useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const res = await getCoursesApi();
      console.log("API Response:", res);
      return res?.data ?? [];
    },
    staleTime: 5 * 60 * 1000, // Dữ liệu khóa học ít thay đổi, cache trong 5 phút
    gcTime: 15 * 60 * 1000, // Cache trong garbage collector 15 phút
  });
};

export const useGetByIdCourse = (id: string) => {
  return useQuery({
    queryKey: ["courses", id],
    queryFn: async () => {
      const res = await getCoursesByIdApi(id);
      return res.data;
    },
    enabled: !!id, // Chỉ fetch khi có ID khóa học hợp lệ
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });
};

export const useGetCourseMonitoring = (id: string) => {
  return useQuery({
    queryKey: ["courseMonitoring", id],
    queryFn: async () => {
      const res = await getCourseMonitoringApi(id);
      return res.data;
    },
    enabled: !!id,
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

export const useUpdateApprovalCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      updateApprovalApi(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast.success("Trình duyệt thành công");
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
export const useGetPurchaseCount = (courseId: string) => {
  return useQuery({
    queryKey: ["purchaseCount", courseId],
    queryFn: async () => {
      const res = await getPurchaseCountApi(courseId);
      return res.data;
    },
    enabled: !!courseId,
  });
};
