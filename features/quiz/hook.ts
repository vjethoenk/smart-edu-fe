import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createQuizApi,
  updateQuizApi,
  getQuizByIdApi,
  deleteQuizApi,
  getQuizzesApi,
} from "./api";
import { IQuiz } from "@/types/api";
import { toast } from "sonner";

export const useCreateQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createQuizApi,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["quiz"] });
      toast.success("Tạo bài quiz thành công");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Có lỗi xảy ra");
    },
  });
};

export const useUpdateQuiz = () => {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<IQuiz> }) =>
      updateQuizApi(id, data),
  });
};

export const useGetQuizzesApi = (courseId: string, sectionId?: string) => {
  return useQuery({
    queryKey: ["quizzes", courseId, sectionId],
    queryFn: () => getQuizzesApi(courseId, sectionId),
    enabled: !!courseId,
  });
};

export const useGetQuizById = (id: string) => {
  return useQuery({
    queryKey: ["quiz", id],
    queryFn: () => getQuizByIdApi(id),
    enabled: !!id,
  });
};

export const useDeleteQuiz = () => {
  return useMutation({
    mutationFn: (id: string) => deleteQuizApi(id),
  });
};
