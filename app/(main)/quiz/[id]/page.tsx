"use client";
import { useGetQuestion } from "@/features/quiz/hook";
import { useParams } from "next/navigation";

const QuizDetailPage = () => {
  const { id } = useParams();
  const { data: questions } = useGetQuestion(id as string);

  return <></>;
};
export default QuizDetailPage;
