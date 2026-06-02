import axiosClient from "@/lib/axios";
import { ApiResponse } from "@/types/api";

// 1. Lấy tổng quan nhanh (KPIs chính)
export const getStatisticsOverviewApi = () => {
  return axiosClient.get<ApiResponse<{
    totalUsers: number;
    totalInstructors: number;
    totalCourses: number;
    totalOrders: number;
    totalRevenue: number;
    totalEnrollments: number;
    totalLessons: number;
  }>>("/v1/statistics/overview");
};

// 2. Lấy doanh thu nhóm theo khoảng thời gian
export const getStatisticsRevenueApi = (params: {
  period?: "day" | "week" | "month" | "year";
  start?: string;
  end?: string;
}) => {
  return axiosClient.get<ApiResponse<Array<{
    period: string;
    revenue: number;
    orders: number;
  }>>>("/v1/statistics/revenue", { params });
};

// 3. Lấy dữ liệu biểu đồ doanh thu 12 tháng theo năm
export const getStatisticsRevenueMonthlyChartApi = (year?: number) => {
  return axiosClient.get<ApiResponse<Array<{
    month: string;
    revenue: number;
  }>>>("/v1/statistics/revenue/monthly-chart", { params: { year } });
};

// 4. Lấy top khóa học theo tiêu chí
export const getStatisticsTopCoursesApi = (params: {
  type: "revenue" | "sales" | "students" | "rating";
  limit?: number;
}) => {
  return axiosClient.get<ApiResponse<Array<{
    courseId: string;
    title: string;
    revenue?: number;
    sales?: number;
    students?: number;
    rating?: number;
  }>>>("/v1/statistics/courses/top", { params });
};

// 5. Lấy trung bình tiến độ/hoàn thành của mỗi khóa học
export const getStatisticsCoursesCompletionRateApi = (limit?: number) => {
  return axiosClient.get<ApiResponse<Array<{
    courseId: string;
    title: string;
    averageProgress: number; // or matching backend field
    completionRate?: number;
  }>>>("/v1/statistics/courses/completion-rate", { params: { limit } });
};

// 6. Thống kê học viên (Tiến độ TB & Khóa học hoàn thành)
export const getStatisticsStudentsProgressApi = () => {
  return axiosClient.get<ApiResponse<{
    avgProgress: number;
    completedCourses: number;
  }>>("/v1/statistics/students/progress");
};

// 7. Thống kê đơn hàng (Tổng & theo trạng thái)
export const getStatisticsOrdersSummaryApi = () => {
  return axiosClient.get<ApiResponse<{
    totalOrders: number;
    totalRevenue: number;
    statusSummary: Array<{
      status: string;
      count: number;
      revenue: number;
    }>;
  }>>("/v1/statistics/orders/summary");
};

// 8. Thống kê video/bài học
export const getStatisticsVideosOverviewApi = () => {
  return axiosClient.get<ApiResponse<{
    totalVideos: number;
    totalDuration: number; // Tổng số giây hoặc phút
  }>>("/v1/statistics/videos/overview");
};
