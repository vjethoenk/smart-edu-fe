"use client";

import { useGetQuestion } from "@/features/quiz/hook";
import { useParams } from "next/navigation";
import { useState } from "react";
import {
  Trophy,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Timer,
  Layers,
  HelpCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { useSaveAnswer, useSubmitQuiz } from "@/features/attempt/hook";
import { useCreateTracking } from "@/features/tracking/hook";
import { useSearchParams } from "next/navigation";

interface Question {
  _id: string;
  content: string;
  options: string[];
}

interface Quiz {
  _id: string;
  title: string;
  description: string;
  limitTime: number;
  passScore: number;
  totalScore: number;
  questions: Question[];
  courseId: string;
  sectionId: string;
}

const QuizDetailPage = () => {
  const { id, attemptId } = useParams();
  const searchParams = useSearchParams();
  const lessonId = searchParams.get("lessonId");
  const courseId = searchParams.get("courseId");

  const { data, isLoading, isError } = useGetQuestion(id as string);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const quiz = data?.data?.[0] as Quiz | undefined;
  const totalQuestions = quiz?.questions?.length || 0;
  const answeredCount = Object.keys(answers).length;
  const progress =
    totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;

  const { mutate: saveAnswer } = useSaveAnswer();
  const { mutate: submitQuiz } = useSubmitQuiz();
  const { mutate: sendTrackingEvent } = useCreateTracking();

  const handleChooseAnswer = (questionId: string, selectedAnswer: string) => {
    saveAnswer({
      attemptId: attemptId as string,
      questionId,
      selectedAnswer,
    });
    setAnswers((prev) => ({ ...prev, [questionId]: selectedAnswer }));
  };
  const handleSubmit = () => {
    submitQuiz(
      { attemptId: attemptId as string },
      {
        onSuccess: () => {
          if (lessonId) {
            sendTrackingEvent({
              data: {
                lessonId,
                itemType: "quiz",
                event: "complete",
                currentTime: 0,
              },
              courseId: courseId || undefined,
            });
          }
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="max-w-6xl mx-auto p-8 space-y-6">
          <Skeleton className="h-40 w-full bg-white/10" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Skeleton className="h-[600px] w-full bg-white/10" />
            </div>
            <div className="lg:col-span-2">
              <Skeleton className="h-[600px] w-full bg-white/10" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <Alert className="max-w-md bg-red-500/10 border-red-500/20 text-white">
          <AlertCircle className="h-5 w-5 text-red-400" />
          <AlertDescription className="text-red-200">
            Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <Alert className="max-w-md bg-yellow-500/10 border-yellow-500/20 text-white">
          <AlertCircle className="h-5 w-5 text-yellow-400" />
          <AlertDescription className="text-yellow-200">
            Không tìm thấy bài quiz hoặc bài quiz chưa có câu hỏi.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const currentQ = quiz.questions[currentQuestion];
  const currentQuestionId = currentQ?._id;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div className="relative max-w-6xl mx-auto p-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <span className="text-purple-400 text-sm font-semibold uppercase tracking-wider">
              Bài kiểm tra
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
            {quiz.title}
          </h1>

          <p className="text-purple-200 text-lg max-w-2xl">
            {quiz.description}
          </p>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <Layers className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-purple-300 text-sm">Tổng số câu</p>
                  <p className="text-white text-2xl font-bold">
                    {quiz.questions.length}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Timer className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-purple-300 text-sm">Thời gian</p>
                  <p className="text-white text-2xl font-bold">
                    {quiz.limitTime > 0
                      ? `${quiz.limitTime} phút`
                      : "Không giới hạn"}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <Trophy className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-purple-300 text-sm">Điểm đạt</p>
                  <p className="text-white text-2xl font-bold">
                    {quiz.passScore > 0 ? quiz.passScore : "Chưa cập nhật"}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 bg-yellow-500/20 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <p className="text-purple-300 text-sm">Đã trả lời</p>
                  <p className="text-white text-2xl font-bold">
                    {answeredCount}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content - 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Question Navigation Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm sticky top-8">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-white font-semibold">
                    Danh sách câu hỏi
                  </h3>
                  <Badge
                    variant="secondary"
                    className="bg-purple-500/20 text-purple-300"
                  >
                    {answeredCount}/{totalQuestions}
                  </Badge>
                </div>

                <Progress value={progress} className="h-2 mb-6 bg-white/10" />

                <div className="grid grid-cols-5 gap-2">
                  {quiz.questions.map((question: Question, idx: number) => (
                    <button
                      key={question._id}
                      onClick={() => setCurrentQuestion(idx)}
                      className={cn(
                        "relative group transition-all duration-200",
                        currentQuestion === idx && "scale-105",
                      )}
                    >
                      <div
                        className={cn(
                          "aspect-square rounded-xl flex items-center justify-center font-medium transition-all",
                          answers[question._id]
                            ? "bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/20"
                            : "bg-white/10 text-purple-200 hover:bg-white/20",
                          currentQuestion === idx &&
                            "ring-2 ring-purple-400 ring-offset-2 ring-offset-transparent",
                        )}
                      >
                        {answers[question._id] ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : (
                          idx + 1
                        )}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Progress Text */}
                <div className="mt-6 pt-6 border-t border-white/10">
                  <div className="flex justify-between text-sm text-purple-300">
                    <span>Hoàn thành</span>
                    <span className="font-semibold text-white">
                      {Math.round(progress)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Current Question */}
          <div className="lg:col-span-2">
            {currentQ && (
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardContent className="p-8">
                  {/* Question Header */}
                  <div className="flex items-center justify-between mb-6">
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 px-4 py-1">
                      Câu hỏi {currentQuestion + 1}/{totalQuestions}
                    </Badge>
                    {answers[currentQuestionId] && (
                      <Badge
                        variant="secondary"
                        className="bg-green-500/20 text-green-300 gap-2"
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        Đã trả lời
                      </Badge>
                    )}
                  </div>

                  {/* Question Content */}
                  <div className="mb-8">
                    <div className="flex items-start gap-3">
                      <HelpCircle className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
                      <h2 className="text-2xl font-semibold text-white leading-relaxed">
                        {currentQ.content}
                      </h2>
                    </div>
                  </div>

                  {/* Options */}
                  <div className="space-y-4">
                    {currentQ.options.map(
                      (option: string, optionIndex: number) => {
                        const isSelected =
                          answers[currentQuestionId] === option;
                        const optionLetter = String.fromCharCode(
                          65 + optionIndex,
                        );

                        return (
                          <button
                            key={optionIndex}
                            onClick={() =>
                              handleChooseAnswer(currentQuestionId, option)
                            }
                            className={cn(
                              "w-full text-left p-4 rounded-xl transition-all duration-300 group",
                              "border hover:scale-[1.02]",
                              isSelected
                                ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-400 shadow-lg shadow-purple-500/10"
                                : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-purple-400/50",
                            )}
                          >
                            <div className="flex items-start gap-4">
                              <div
                                className={cn(
                                  "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-semibold transition-all",
                                  isSelected
                                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                                    : "bg-white/10 text-purple-300 group-hover:bg-white/20",
                                )}
                              >
                                {optionLetter}
                              </div>
                              <span
                                className={cn(
                                  "text-lg flex-1 transition-all",
                                  isSelected
                                    ? "text-white"
                                    : "text-purple-200 group-hover:text-white",
                                )}
                              >
                                {option}
                              </span>
                              {isSelected && (
                                <CheckCircle2 className="w-5 h-5 text-purple-400 flex-shrink-0" />
                              )}
                            </div>
                          </button>
                        );
                      },
                    )}
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex justify-between mt-8 pt-6 border-t border-white/10">
                    <Button
                      variant="outline"
                      onClick={() =>
                        setCurrentQuestion((prev) => Math.max(0, prev - 1))
                      }
                      disabled={currentQuestion === 0}
                      className="bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white disabled:opacity-50"
                    >
                      ← Câu trước
                    </Button>

                    {currentQuestion === totalQuestions - 1 ? (
                      <Button
                        onClick={handleSubmit}
                        disabled={answeredCount === 0}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg shadow-purple-500/25 gap-2"
                      >
                        Nộp bài
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Button
                        onClick={() =>
                          setCurrentQuestion((prev) =>
                            Math.min(totalQuestions - 1, prev + 1),
                          )
                        }
                        className="bg-white/10 hover:bg-white/20 text-white gap-2"
                      >
                        Câu tiếp theo
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Submit Floating Button for Mobile */}
        <div className="fixed bottom-6 right-6 lg:hidden">
          <Button
            onClick={handleSubmit}
            disabled={answeredCount === 0}
            size="lg"
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg shadow-purple-500/25 rounded-full w-14 h-14 p-0"
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuizDetailPage;
