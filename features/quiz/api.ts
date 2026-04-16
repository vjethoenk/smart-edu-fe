import axiosClient from "@/lib/axios";
import { ApiResponse, IQuiz } from "@/types/api";

export interface QuizResponse {
  data: IQuiz[];
  total: number;
}

export const getQuizzesApi = (courseId: string, sectionId?: string) => {
  const params = sectionId
    ? `?courseId=${courseId}&sectionId=${sectionId}`
    : `?courseId=${courseId}`;
  return axiosClient.get<ApiResponse<QuizResponse>>(`/v1/quizzes${params}`);
};

export const createQuizApi = (data: IQuiz) => {
  return axiosClient.post<any, ApiResponse<IQuiz>>("/v1/quizzes", data);
};

export const updateQuizApi = (id: string, data: Partial<IQuiz>) => {
  return axiosClient.put<any, ApiResponse<IQuiz>>(`/v1/quizzes/${id}`, data);
};

export const getQuizByIdApi = (id: string) => {
  return axiosClient.get<ApiResponse<IQuiz>>(`/v1/quizzes/${id}`);
};

export const deleteQuizApi = (id: string) => {
  return axiosClient.delete<any, ApiResponse<void>>(`/v1/quizzes/${id}`);
};
