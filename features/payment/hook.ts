import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cancelPaymentApi, createPaymentApi, getPaymentStatusApi } from "./api";
import { toast } from "sonner";

export const useCreatePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPaymentApi,
    onSuccess: (data, variables: any) => {
      queryClient.invalidateQueries({ queryKey: ["payment"] });
      toast.success("Tạo thanh toán thành công");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Có lỗi xảy ra");
    },
  });
};

export const useCancelPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelPaymentApi,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment"] });
      toast.success("Hủy thanh toán thành công");
    },

    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Có lỗi xảy ra");
    },
  });
};

export const usePaymentStatus = (orderCode: number) => {
  return useQuery({
    queryKey: ["payment", orderCode],
    queryFn: () => getPaymentStatusApi(orderCode),
    refetchInterval: (query) => {
      const response = query.state.data;
      const currentStatus = response?.data?.status;

      if (currentStatus === "SUCCESS" || currentStatus === "CANCELLED") {
        return false;
      }
      return 3000;
    },
    enabled: !!orderCode,
  });
};
