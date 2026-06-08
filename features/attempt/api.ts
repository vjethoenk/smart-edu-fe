import axiosClient from "@/lib/axios";
import {
  ApiResponse,
  IAttempt,
  IAttemptAnswerResponse,
  ICreateAttemptAnswer,
  IQuizAttemptResponse,
  IQuizResultData,
  ISubmitQuizResponse,
} from "@/types/api";
export const createAttemptApi = (data: IAttempt) => {
  return axiosClient.post<ApiResponse<IQuizAttemptResponse>>(
    "/v1/attempts",
    data,
  );
};

export const saveAnswerApi = (data: ICreateAttemptAnswer) => {
  return axiosClient.post<ApiResponse<IAttemptAnswerResponse>>(
    `/v1/attempts/${data.attemptId}/answers`,
    {
      questionId: data.questionId,
      selectedAnswer: data.selectedAnswer,
    },
  );
};
export interface ISubmitQuizPayload {
  attemptId: string;
}
export const submitAnswersApi = (data: ISubmitQuizPayload) => {
  return axiosClient.put<ApiResponse<ISubmitQuizResponse>>(
    `/v1/attempts/${data.attemptId}/submit`,
  );
};

export const getAttemptResultsApi = (attemptId: string) => {
  return axiosClient.get<ApiResponse<IQuizResultData>>(
    `/v1/attempts/${attemptId}/result`,
  );
};

export const getAttemptAnswersApi = (attemptId: string) => {
  return axiosClient.get<ApiResponse<IAttemptAnswerResponse[]>>(
    `/v1/attempt-answers/attempt/${attemptId}`,
  );
};

export const getLatestAttemptByQuizApi = (quizId: string) => {
  return axiosClient.get<ApiResponse<IAttempt>>(
    `/v1/attempts/quiz/${quizId}/latest`,
  );
};
