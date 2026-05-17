import axiosClient from "@/lib/axios";
import { ApiResponse, ICartItem, ICartTotalResponse, IAddToCartRequest } from "@/types/api";

export const cartApi = {
  // Thêm khóa học vào giỏ
  addToCart: (data: IAddToCartRequest) => {
    return axiosClient.post<ApiResponse<any>>("v1/cart", data);
  },

  // Lấy danh sách giỏ hàng
  getCart: () => {
    return axiosClient.get<ApiResponse<ICartItem[]>>("v1/cart");
  },

  // Lấy tổng giỏ hàng
  getCartTotal: () => {
    return axiosClient.get<ApiResponse<ICartTotalResponse>>("v1/cart/total");
  },

  // Lấy chi tiết một mục trong giỏ
  getCartItem: (id: string) => {
    return axiosClient.get<ApiResponse<ICartItem>>(`v1/cart/${id}`);
  },

  // Xóa mục khỏi giỏ hàng
  removeFromCart: (id: string) => {
    return axiosClient.delete<ApiResponse<any>>(`v1/cart/${id}`);
  },

  // Xóa toàn bộ giỏ hàng
  clearCart: () => {
    return axiosClient.delete<ApiResponse<any>>("v1/cart");
  },
};
