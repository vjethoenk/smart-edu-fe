import axiosClient from "@/lib/axios";
import { ApiResponse, ITracking } from "@/types/api";

export const createTrackingApi = (data: ITracking) => {
  return axiosClient.post<any, ApiResponse<ITracking>>("/v1/tracking", data);
};

export const getLessonProgressApi = (lessonId: string) => {
  return axiosClient.get<any, ApiResponse<any>>(
    `/v1/tracking/lesson-progress/${lessonId}`,
  );
};

export const getCourseProgressApi = (courseId: string) => {
  return axiosClient.get<any, ApiResponse<any>>(
    `/v1/tracking/course-progress/${courseId}`,
  );
};
