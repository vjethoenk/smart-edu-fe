import axiosClient from "@/lib/axios";
import {
  ApiResponse,
  ICreateQuizQuestion,
  IQuestion,
  QuestionResponse,
} from "@/types/api";

export const QUESTION_PAGE_SIZE = 10;

export const getAllQuestionApi = (
  pageIndex?: number,
  limit: number = QUESTION_PAGE_SIZE,
) => {
  const query =
    pageIndex != null
      ? `?skip=${pageIndex * limit}&limit=${limit}`
      : `?skip=0&limit=${limit}`;

  return axiosClient.get<ApiResponse<QuestionResponse>>(
    `/v1/questions${query}`,
  );
};

export const approveQuestionApi = (id: string, status: string) => {
  return axiosClient.put(`/v1/questions/approval/${id}`, {
    status,
  });
};

export const createQuestionApi = (data: IQuestion) => {
  return axiosClient.post<any, ApiResponse<IQuestion>>("/v1/questions", data);
};

export const updateQuestionApi = (data: {
  id: string;
  body: Partial<IQuestion>;
}) => {
  return axiosClient.patch<any, ApiResponse<IQuestion>>(
    `/v1/questions/${data.id}`,
    data.body,
  );
};

export const addQuestionToQuizApi = (
  quizId: string,
  data: ICreateQuizQuestion,
) => {
  return axiosClient.post<any, ApiResponse<ICreateQuizQuestion>>(
    `/v1/quizzes/${quizId}/questions`,
    data,
  );
};
