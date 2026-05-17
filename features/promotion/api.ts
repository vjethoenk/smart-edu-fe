import axiosClient from "@/lib/axios";
import { ApiResponse, IPromotion, IPromotionInput } from "@/types/api";

export const promotionApi = {
  // Lấy danh sách khuyến mãi
  getPromotions: () => {
    return axiosClient.get<ApiResponse<IPromotion[]>>("/v1/promotions");
  },

  // Lấy khuyến mãi theo mã
  getPromotionByCode: (code: string) => {
    return axiosClient.get<ApiResponse<IPromotion>>(`/v1/promotions/by-code/${code}`);
  },

  // Lấy khuyến mãi theo khóa học
  getPromotionsByCourse: (courseId: string) => {
    return axiosClient.get<ApiResponse<IPromotion[]>>(`/v1/promotions/by-course/${courseId}`);
  },

  // Lấy chi tiết khuyến mãi
  getPromotionById: (id: string) => {
    return axiosClient.get<ApiResponse<IPromotion>>(`/v1/promotions/${id}`);
  },

  // Tạo khuyến mãi
  createPromotion: (data: IPromotionInput) => {
    return axiosClient.post<ApiResponse<IPromotion>>("/v1/promotions", data);
  },

  // Cập nhật khuyến mãi
  updatePromotion: (id: string, data: Partial<IPromotionInput>) => {
    return axiosClient.patch<ApiResponse<IPromotion>>(`/v1/promotions/${id}`, data);
  },

  // Xóa khuyến mãi
  deletePromotion: (id: string) => {
    return axiosClient.delete<ApiResponse<any>>(`/v1/promotions/${id}`);
  },
};
