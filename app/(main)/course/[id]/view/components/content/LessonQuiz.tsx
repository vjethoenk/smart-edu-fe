import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen, Zap } from "lucide-react";
import { ILesson } from "@/types/api";

const LessonQuiz = ({ lesson }: { lesson: ILesson }) => {
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
          <Link href={`/quiz/${lesson.quizId}`}>
            <Button>Vào làm quiz</Button>
          </Link>
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
