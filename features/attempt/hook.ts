import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createAttemptApi,
  getAttemptResultsApi,
  saveAnswerApi,
  submitAnswersApi,
} from "./api";
import { toast } from "sonner";
import { IAttempt } from "@/types/api";
import { useAttemptStore } from "./store";
import { useRouter } from "next/navigation";

export const useCreateAttempt = () => {
  return useMutation({
    mutationFn: (data: IAttempt) => createAttemptApi(data),

    onSuccess: (res) => {
      useAttemptStore.getState().setAttemptId(res.data.attemptId);
      toast.success("Tạo bài làm thành công");
    },

    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Có lỗi xảy ra");
    },
  });
};

export const useSaveAnswer = () => {
  return useMutation({
    mutationFn: saveAnswerApi,

    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Lưu đáp án thất bại");
    },
  });
};

export const useSubmitQuiz = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: submitAnswersApi,
    onSuccess(res) {
      if (res.data.attemptId) {
        router.push(`/quiz/result/${res.data.attemptId}`);
      }
    },
  });
};

export const useGetAttemptResults = (attemptId: string) => {
  return useQuery({
    queryKey: ["attemptResults", attemptId],
    queryFn: () => getAttemptResultsApi(attemptId),
    enabled: !!attemptId,
  });
};
