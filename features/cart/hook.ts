import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cartApi } from "./api";
import { IAddToCartRequest } from "@/types/api";
import { useSelector } from "react-redux";
import { RootState } from "@/store/type";

// Lấy danh sách giỏ hàng
export const useGetCart = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  return useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const response = await cartApi.getCart();
      return response.data;
    },
    enabled: !!user,
  });
};

// Lấy tổng số liệu giỏ hàng (số item, tổng tiền,...)
export const useGetCartTotal = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  return useQuery({
    queryKey: ["cartTotal"],
    queryFn: async () => {
      const response = await cartApi.getCartTotal();
      return response.data;
    },
    enabled: !!user,
  });
};

// Thêm khóa học vào giỏ
export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: IAddToCartRequest) => cartApi.addToCart(data),
    onSuccess: () => {
      // Invalidate để cập nhật lại dữ liệu giỏ hàng
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["cartTotal"] });
    },
  });
};

// Xóa khóa học khỏi giỏ
export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => cartApi.removeFromCart(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["cartTotal"] });
    },
  });
};

// Xóa toàn bộ giỏ hàng
export const useClearCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => cartApi.clearCart(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["cartTotal"] });
    },
  });
};
