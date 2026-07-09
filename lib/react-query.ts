import { QueryClientConfig } from "@tanstack/react-query";

export const queryClientConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Tắt tự động refetch khi window focus để tiết kiệm API
      staleTime: 60 * 1000, // Stale time mặc định là 1 phút
      retry: 1, // Tự động thử lại 1 lần khi lỗi
    },
  },
};
