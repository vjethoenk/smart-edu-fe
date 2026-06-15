import { FileText } from "lucide-react";
import { ILesson } from "@/types/api";

const LessonPdf = ({ lesson }: { lesson: ILesson }) => {
  return (
    <div className="bg-slate-950 text-white">
      {lesson.pdfUrl ? (
        <div className="space-y-4">
          <div className="relative overflow-hidden bg-slate-900 border-b border-slate-400  ">
            <iframe
              src={`${lesson.pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
              className="w-full aspect-[16/10]"
              title={lesson.title}
            />
          </div>
        </div>
      ) : (
        <div className="p-20 text-center rounded-b-3xl bg-slate-900">
          <div className="mx-auto mb-4 w-20 h-20 rounded-full bg-white/10 flex items-center justify-center">
            <FileText className="w-8 h-8 text-white/70" />
          </div>
          <p className="text-slate-300 text-lg font-medium">
            PDF chưa được cập nhật
          </p>
          <p className="text-slate-400 mt-2">
            Vui lòng chọn bài khác hoặc quay lại sau.
          </p>
        </div>
      )}
    </div>
  );
};

export default LessonPdf;
