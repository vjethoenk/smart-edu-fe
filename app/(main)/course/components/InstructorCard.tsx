import { IUser } from "@/types/api";
import {
  Mail,
  Award,
  BookOpen,
  MessageCircle,
  ChevronRight,
} from "lucide-react";

export default function InstructorCard({
  instructor,
}: {
  instructor: IUser | undefined;
}) {
  if (!instructor) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-2xl text-center border border-gray-200">
        <Award className="w-12 h-12 text-gray-300 mx-auto mb-2" />
        <p className="text-gray-400 text-sm">Chưa có thông tin giảng viên</p>
      </div>
    );
  }

  const getInitial = (name: string) => {
    if (!name) return "?";
    const words = name.trim().split(" ");
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  };

  const initial = getInitial(instructor.name || "");

  return (
    <div className="group relative sticky bg-white rounded-4xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full opacity-50 -mr-10 -mt-10" />

      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-100 rounded-lg">
              <Award className="w-4 h-4 text-indigo-600" />
            </div>
            <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">
              Giảng viên
            </h3>
          </div>
        </div>

        {/* Instructor info */}
        <div className="flex items-center gap-4 mb-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300">
              <span className="text-3xl font-bold text-white">{initial}</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full" />
            </div>
          </div>

          <div className="flex-1">
            <h4 className="text-xl font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">
              {instructor.name}
            </h4>
            <p className="text-xs text-gray-500 mt-0.5">Chuyên gia hàng đầu</p>
          </div>
        </div>

        {/* Contact info */}
        {instructor.email && (
          <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2.5 rounded-xl mb-4 group-hover:bg-indigo-50 transition-colors">
            <Mail className="w-4 h-4 text-indigo-500 flex-shrink-0" />
            <span className="truncate">{instructor.email}</span>
            <ChevronRight className="w-3 h-3 text-gray-400 ml-auto flex-shrink-0" />
          </div>
        )}

        {/* Bio & stats */}
        <div className="space-y-3">
          <p className="text-sm text-gray-600 leading-relaxed">
            Chuyên gia với hơn 5 năm kinh nghiệm trong lĩnh vực giáo dục trực
            tuyến. Đã đào tạo thành công 1,000+ học viên.
          </p>

          <div className="flex items-center gap-4 pt-2">
            <div className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-indigo-400" />
              <span className="text-xs text-gray-500">12 khóa học</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MessageCircle className="w-4 h-4 text-indigo-400" />
              <span className="text-xs text-gray-500">234 đánh giá</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
