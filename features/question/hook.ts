import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  approveQuestionApi,
  createQuestionApi,
  getAllQuestionApi,
  updateQuestionApi,
  QUESTION_PAGE_SIZE,
} from "./api";
import { toast } from "sonner";

export const useGetQuestions = (
  pageIndex?: number,
  limit = QUESTION_PAGE_SIZE,
) => {
  return useQuery({
    queryKey: ["question", pageIndex, limit],
    queryFn: async () => {
      const res = await getAllQuestionApi(pageIndex, limit);
      return {
        data: res.data,
      };
    },
  });
};

export const useApproveQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      approveQuestionApi(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["question"] });
      toast.success("Trình duyệt câu hỏi thành công");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Có lỗi xảy ra khi phê duyệt câu hỏi",
      );
    },
  });
};

export const useCreateQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createQuestionApi,
    onSuccess: (data, variables: any) => {
      queryClient.invalidateQueries({ queryKey: ["question"] });
      toast.success("Tạo câu hỏi thành công");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Có lỗi xảy ra");
    },
  });
};

export const useUpdateQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateQuestionApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["question"] });
      toast.success("Cập nhật câu hỏi thành công");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Có lỗi xảy ra");
    },
  });
};
