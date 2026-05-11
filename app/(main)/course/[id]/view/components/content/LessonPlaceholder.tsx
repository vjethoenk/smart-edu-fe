import { PlayCircle } from "lucide-react";

export const LessonPlaceholder = () => (
  <div className="bg-gradient-to-br from-slate-100 via-white to-indigo-50 rounded-3xl border border-slate-200 p-16 text-center shadow-sm">
    <div className="max-w-md mx-auto">
      <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center shadow-inner">
        <PlayCircle className="w-16 h-16 text-indigo-400" />
      </div>
      <h3 className="text-2xl font-bold text-slate-800 mb-3">
        Chào mừng bạn đến với khóa học
      </h3>
      <p className="text-slate-500 text-lg">
        Chọn một bài học từ danh sách bên phải để bắt đầu
      </p>
    </div>
  </div>
);
