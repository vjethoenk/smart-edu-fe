import { Button } from "@/components/ui/button";
import { Zap, Eye } from "lucide-react";
import { ILesson } from "@/types/api";
import { useCreateAttempt, useGetLatestAttemptByQuiz } from "@/features/attempt/hook";
import { useRouter } from "next/navigation";
import { useLessonTracking } from "@/components/providers/LessonTrackingProvider";
import { useGetLessonProgress } from "@/features/tracking/hook";

const LessonQuiz = ({ lesson }: { lesson: ILesson }) => {
  const { mutate: createAttempt, isPending: isCreating } = useCreateAttempt();
  const router = useRouter();
  const { track } = useLessonTracking();

  // Kiểm tra lesson đã hoàn thành chưa
  const { data: lessonProgressData } = useGetLessonProgress(lesson._id);
  const isCompleted = !!lessonProgressData?.data?.isCompleted;

  // Lấy attempt mới nhất nếu quiz đã được làm
  const { data: latestAttemptData } = useGetLatestAttemptByQuiz(
    isCompleted ? (lesson.quizId as string) : undefined,
  );
  const latestAttemptId = latestAttemptData?.data?._id;

  const handleStartQuiz = () => {
    track("start");
    createAttempt(
      {
        quizId: lesson.quizId as string,
        startTime: new Date(),
        score: 0,
        status: "in_progress",
      },
      {
        onSuccess: (res) => {
          router.push(
            `/quiz/${lesson.quizId}/attempt/${res.data.attemptId}?lessonId=${lesson._id || ""}&courseId=${lesson.courseId || ""}`,
          );
        },
      },
    );
  };

  const handleViewResult = () => {
    if (latestAttemptId) {
      router.push(`/quiz/result/${latestAttemptId}`);
    }
  };

  return (
    <div className="bg-slate-950 text-white p-8 rounded-t-3xl">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-amber-500/15 text-amber-300">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-amber-200">
              Quiz
            </p>
            <h2 className="text-2xl font-semibold">Kiểm tra kiến thức</h2>
          </div>
        </div>
        <p className="text-slate-300">
          Đây là bài kiểm tra tương ứng với nội dung học. Nếu đã có quiz liên
          kết, bạn có thể mở và làm bài ngay.
        </p>
        {lesson.quizId ? (
          <div className="flex gap-3">
            {isCompleted && latestAttemptId ? (
              <Button
                onClick={handleViewResult}
                className="gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
              >
                <Eye className="w-4 h-4" />
                Xem kết quả
              </Button>
            ) : (
              <Button onClick={handleStartQuiz} disabled={isCreating}>
                {isCreating ? "Đang tạo..." : "Vào làm quiz"}
              </Button>
            )}
          </div>
        ) : (
          <div className="rounded-3xl border border-slate-700 bg-slate-900/80 p-5 text-slate-400">
            Quiz chưa được liên kết. Vui lòng chọn bài khác hoặc yêu cầu cập
            nhật.
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonQuiz;
