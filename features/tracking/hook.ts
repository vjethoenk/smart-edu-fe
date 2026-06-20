import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTrackingApi } from "./api";
import { toast } from "sonner";

export const useCreateTracking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: { data: any; courseId?: string }) =>
      createTrackingApi(variables.data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["Tracking"] });
      // Invalidate lesson and course progress so UI updates without reload
      try {
        const trackingData = variables?.data;
        const courseId = variables?.courseId;

        if (trackingData?.lessonId) {
          queryClient.invalidateQueries({
            queryKey: ["lessonProgress", trackingData.lessonId],
          });
        }

        // Only invalidate course progress on progress-changing events to prevent excessive fetches during heartbeats
        const isProgressChangingEvent = [
          "close",
          "end",
          "complete",
          "passed",
          "submit",
        ].includes(trackingData?.event);
        if (courseId && isProgressChangingEvent) {
          queryClient.invalidateQueries({
            queryKey: ["courseProgress", courseId],
          });
        }
      } catch (e) {
        // ignore
      }
    },
    onError: (error: any) => {
      //toast.error(error?.response?.data?.message || "Có lỗi xảy ra");
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
