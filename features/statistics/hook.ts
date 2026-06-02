import { useQuery } from "@tanstack/react-query";
import {
  getStatisticsOverviewApi,
  getStatisticsRevenueApi,
  getStatisticsRevenueMonthlyChartApi,
  getStatisticsTopCoursesApi,
  getStatisticsCoursesCompletionRateApi,
  getStatisticsStudentsProgressApi,
  getStatisticsOrdersSummaryApi,
  getStatisticsVideosOverviewApi,
} from "./api";

// Hook lấy KPI Overview
export const useGetStatisticsOverview = () => {
  return useQuery({
    queryKey: ["statistics", "overview"],
    queryFn: async () => {
      const res = await getStatisticsOverviewApi();
      return res?.data;
    },
  });
};

// Hook lấy Doanh thu nhóm theo khoảng thời gian
export const useGetStatisticsRevenue = (params: {
  period?: "day" | "week" | "month" | "year";
  start?: string;
  end?: string;
}) => {
  return useQuery({
    queryKey: ["statistics", "revenue", params],
    queryFn: async () => {
      const res = await getStatisticsRevenueApi(params);
      return res?.data ?? [];
    },
  });
};

// Hook lấy Doanh thu 12 tháng vẽ biểu đồ
export const useGetStatisticsRevenueMonthlyChart = (year?: number) => {
  return useQuery({
    queryKey: ["statistics", "monthly-chart", year],
    queryFn: async () => {
      const res = await getStatisticsRevenueMonthlyChartApi(year);
      return res?.data ?? [];
    },
  });
};

// Hook lấy Top khóa học theo tiêu chí
export const useGetStatisticsTopCourses = (params: {
  type: "revenue" | "sales" | "students" | "rating";
  limit?: number;
}) => {
  return useQuery({
    queryKey: ["statistics", "top-courses", params],
    queryFn: async () => {
      const res = await getStatisticsTopCoursesApi(params);
      return res?.data ?? [];
    },
  });
};

// Hook lấy Tiến độ trung bình mỗi khóa học
export const useGetStatisticsCoursesCompletionRate = (limit?: number) => {
  return useQuery({
    queryKey: ["statistics", "courses-completion-rate", limit],
    queryFn: async () => {
      const res = await getStatisticsCoursesCompletionRateApi(limit);
      return res?.data ?? [];
    },
  });
};

// Hook lấy Tiến độ trung bình học viên
export const useGetStatisticsStudentsProgress = () => {
  return useQuery({
    queryKey: ["statistics", "students-progress"],
    queryFn: async () => {
      const res = await getStatisticsStudentsProgressApi();
      return res?.data;
    },
  });
};

// Hook lấy Thống kê Đơn hàng
export const useGetStatisticsOrdersSummary = () => {
  return useQuery({
    queryKey: ["statistics", "orders-summary"],
    queryFn: async () => {
      const res = await getStatisticsOrdersSummaryApi();
      return res?.data;
    },
  });
};

// Hook lấy Tổng quan bài học video
export const useGetStatisticsVideosOverview = () => {
  return useQuery({
    queryKey: ["statistics", "videos-overview"],
    queryFn: async () => {
      const res = await getStatisticsVideosOverviewApi();
      return res?.data;
    },
  });
};
