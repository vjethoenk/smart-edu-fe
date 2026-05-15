import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTrackingApi } from "./api";
import { toast } from "sonner";

export const useCreateTracking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTrackingApi,
    onSuccess: (data, variables: any) => {
      queryClient.invalidateQueries({ queryKey: ["Tracking"] });
      // Invalidate lesson and course progress so UI updates without reload
      try {
        if (variables?.lessonId) {
          queryClient.invalidateQueries({
            queryKey: ["lessonProgress", variables.lessonId],
          });
        }
        if (variables?.courseId) {
          queryClient.invalidateQueries({
            queryKey: ["courseProgress", variables.courseId],
          });
        }
        // Also invalidate any generic progress queries
        queryClient.invalidateQueries({ queryKey: ["lessonProgress"] });
        queryClient.invalidateQueries({ queryKey: ["courseProgress"] });
      } catch (e) {
        // ignore
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Có lỗi xảy ra");
    },
  });
};

import { useQuery } from "@tanstack/react-query";
import { getCourseProgressApi, getLessonProgressApi } from "./api";

export const useGetCourseProgress = (courseId?: string) => {
  return useQuery({
    queryKey: ["courseProgress", courseId],
    queryFn: () => getCourseProgressApi(courseId as string),
    enabled: !!courseId,
  });
};

export const useGetLessonProgress = (lessonId?: string) => {
  return useQuery({
    queryKey: ["lessonProgress", lessonId],
    queryFn: () => getLessonProgressApi(lessonId as string),
    enabled: !!lessonId,
  });
};
