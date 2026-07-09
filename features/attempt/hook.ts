import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createAttemptApi,
  getAttemptAnswersApi,
  getAttemptResultsApi,
  getLatestAttemptByQuizApi,
  saveAnswerApi,
  submitAnswersApi,
} from "./api";
import { toast } from "sonner";
import { IAttempt } from "@/types/api";
import { useAttemptStore } from "./store";
import { useRouter } from "next/navigation";

export const useCreateAttempt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: IAttempt) => createAttemptApi(data),

    onSuccess: (res, variables) => {
      useAttemptStore.getState().setAttemptId(res.data.attemptId);
      toast.success("Tạo bài làm thành công");
      // Invalidate latestAttempt khi tạo bài làm mới
      queryClient.invalidateQueries({ queryKey: ["latestAttempt", variables.quizId] });
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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitAnswersApi,
    onSuccess(res) {
      if (res.data.attemptId) {
        // Invalidate latestAttempt khi nộp bài
        queryClient.invalidateQueries({ queryKey: ["latestAttempt", res.data.quizId] });
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
    staleTime: Infinity, // Kết quả bài thi là tĩnh, không bao giờ thay đổi
    gcTime: 30 * 60 * 1000, // Cache trong 30 phút
  });
};

export const useGetAttemptAnswers = (attemptId: string) => {
  return useQuery({
    queryKey: ["attemptAnswers", attemptId],
    queryFn: () => getAttemptAnswersApi(attemptId),
    enabled: !!attemptId,
    staleTime: Infinity, // Đáp án bài thi là tĩnh
    gcTime: 30 * 60 * 1000,
  });
};

export const useGetLatestAttemptByQuiz = (quizId?: string) => {
  return useQuery({
    queryKey: ["latestAttempt", quizId],
    queryFn: () => getLatestAttemptByQuizApi(quizId as string),
    enabled: !!quizId,
    staleTime: 5 * 60 * 1000, // Cache trạng thái mới nhất trong 5 phút
  });
};
