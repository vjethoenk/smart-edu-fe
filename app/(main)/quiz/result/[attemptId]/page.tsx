// QuizResult.tsx
"use client";

import {
  CheckCircle,
  XCircle,
  Clock,
  Award,
  TrendingUp,
  AlertCircle,
  Flag,
  Loader2,
  Target,
  Zap,
  BarChart,
  Star,
  Calendar,
  Timer,
  PartyPopper,
  BookOpen,
} from "lucide-react";

import { useParams, useRouter } from "next/navigation";
import { useGetAttemptResults } from "@/features/attempt/hook";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function QuizResult() {
  const { attemptId } = useParams();
  const router = useRouter();

  const {
    data: response,
    isLoading,
    error,
  } = useGetAttemptResults(attemptId as string);

  const handleRetry = () => {
    router.back();
  };

  const handleBack = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-12 text-center">
            <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mx-auto mb-4" />
            <p className="text-slate-600">Đang tải kết quả bài làm...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-red-200">
          <CardContent className="p-12 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="font-semibold text-slate-800 mb-2">Có lỗi xảy ra</h3>
            <p className="text-slate-500 text-sm mb-6">
              Không thể tải kết quả bài làm. Vui lòng thử lại sau.
            </p>
            <Button onClick={handleBack} variant="outline" className="w-full">
              Quay lại
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const data = response?.data;
  if (!data) return null;

  // Format time
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Calculate time taken
  const timeTaken = (() => {
    const start = new Date(data.startTime);
    const end = new Date(data.endTime);
    const diffMs = end.getTime() - start.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffSecs = Math.floor((diffMs % 60000) / 1000);
    return `${diffMins}:${diffSecs.toString().padStart(2, "0")}`;
  })();

  const scorePercentage =
    data.totalScore > 0 ? (data.correctCount / data.totalQuestions) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto space-y-6">
        {/* Header Card */}
        <Card className="border-0 shadow-xl overflow-hidden p-0">
          <div className="relative h-32 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500">
            <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                {data.quizTitle}
              </h1>
              <div className="flex flex-wrap gap-4 text-sm text-white/90">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(data.startTime)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Timer className="w-4 h-4" />
                  <span>Thời gian: {timeTaken} phút</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Main Score Card */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6 md:p-8">
            {/* Score Circle */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative mb-4">
                <div className="w-40 h-40 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 p-1 shadow-lg">
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-slate-800">
                        {data.correctCount}/{data.totalQuestions}
                      </div>
                      <div className="text-sm text-slate-500 mt-1">
                        Đúng / Tổng
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-2 -right-2">
                  {data.isPassed ? (
                    <div className="bg-gradient-to-r from-green-400 to-emerald-500 rounded-full p-2 shadow-lg">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                  ) : (
                    <div className="bg-gradient-to-r from-orange-400 to-red-500 rounded-full p-2 shadow-lg">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                  )}
                </div>
              </div>

              {/* Status Badge */}
              <Badge
                className={cn(
                  "px-4 py-2 text-sm font-semibold rounded-full shadow-md",
                  data.isPassed
                    ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                    : "bg-gradient-to-r from-orange-500 to-red-500 text-white",
                )}
              >
                {data.isPassed ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-1" />
                    HOÀN THÀNH XUẤT SẮC
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 mr-1" />
                    CẦN CỐ GẮNG HƠN
                  </>
                )}
              </Badge>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 text-center">
                <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-700">
                  {data.correctCount}
                </div>
                <div className="text-xs text-green-600 font-medium">
                  Câu đúng
                </div>
              </div>

              <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-4 text-center">
                <XCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-red-700">
                  {data.incorrectCount}
                </div>
                <div className="text-xs text-red-600 font-medium">Câu sai</div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 text-center">
                <Target className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-indigo-700">
                  {Math.round((data.correctCount / data.totalQuestions) * 100)}%
                </div>
                <div className="text-xs text-indigo-600 font-medium">
                  Độ chính xác
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 text-center">
                <Star className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-700">
                  {data.totalScore}
                </div>
                <div className="text-xs text-purple-600 font-medium">
                  Điểm số
                </div>
              </div>
            </div>

            {/* Message Section */}
            <div
              className={cn(
                "rounded-xl p-4 mb-8 border-2",
                data.isPassed
                  ? "bg-green-50 border-green-200"
                  : "bg-orange-50 border-orange-200",
              )}
            >
              <div className="flex items-start gap-3">
                {data.isPassed ? (
                  <>
                    <PartyPopper className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold mb-1 text-green-800">
                        Chúc mừng bạn đã vượt qua bài quiz!
                      </h3>
                      <p className="text-sm text-green-700">
                        Bạn đã hoàn thành xuất sắc bài quiz. Hãy tiếp tục phát
                        huy nhé!
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <BookOpen className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold mb-1 text-orange-800">
                        Đừng nản lòng, hãy thử lại!
                      </h3>
                      <p className="text-sm text-orange-700">
                        Luyện tập thêm và thử lại lần nữa. Thành công sẽ đến với
                        bạn!
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleRetry}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg transition-all duration-200 transform hover:scale-105"
              >
                <Flag className="w-4 h-4 mr-2" />
                Làm lại bài quiz
              </Button>
              <Button
                onClick={handleBack}
                variant="outline"
                className="flex-1 border-2 hover:bg-slate-50"
              >
                <BarChart className="w-4 h-4 mr-2" />
                Xem chi tiết câu hỏi
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
