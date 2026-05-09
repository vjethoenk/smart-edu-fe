import axiosClient from "@/lib/axios";
import { ApiResponse, IPayment } from "@/types/api";

export const createPaymentApi = (data: {
  courseId: string;
  amount: number;
}) => {
  return axiosClient.post<any, ApiResponse<IPayment>>(`v1/payments`, data);
};

export const cancelPaymentApi = (orderCode: number) => {
  return axiosClient.put<any, ApiResponse<IPayment>>(
    `v1/payments/cancel/${orderCode}`,
  );
};
interface PaymentStatusData {
  status: string;
  orderCode: number;
}
export const getPaymentStatusApi = (orderCode: number) => {
  return axiosClient.get<ApiResponse<PaymentStatusData>>(
    `v1/payments/status/${orderCode}`,
  );
};
