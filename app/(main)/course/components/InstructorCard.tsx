import { IUser } from "@/types/api";
import {
  Mail,
  Award,
  BookOpen,
  MessageCircle,
  ChevronRight,
  Star,
  Users,
  Video,
  GraduationCap,
  CheckCircle,
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
    <div className="group relative top-38 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full opacity-60 -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-pink-100 to-orange-100 rounded-full opacity-40 -ml-16 -mb-16" />

      {/* Header rating badge */}
      <div className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 shadow-sm flex items-center gap-1">
        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
        <span className="text-xs font-bold text-gray-700">4.9</span>
      </div>

      <div className="relative p-6">
        {/* Title */}
        <div className="flex items-center gap-2 mb-5">
          <div className="p-1.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-md">
            <GraduationCap className="w-4 h-4 text-white" />
          </div>
          <h3 className="font-bold text-gray-700 text-sm uppercase tracking-wide">
            Giảng viên
          </h3>
          <div className="flex-1" />
          <div className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
            Chuyên gia
          </div>
        </div>

        {/* Instructor info */}
        <div className="flex items-center gap-4 mb-5">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg group-hover:scale-105 transition-all duration-300">
              <span className="text-3xl font-bold text-white">{initial}</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center shadow-sm">
              <CheckCircle className="w-3.5 h-3.5 text-white" />
            </div>
          </div>

          <div className="flex-1">
            <h4 className="text-xl font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">
              {instructor.name}
            </h4>
            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
              <Award className="w-3 h-3 text-amber-500" />
              Giảng viên xuất sắc 2024
            </p>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-2.5 text-center">
            <Users className="w-4 h-4 text-indigo-500 mx-auto mb-1" />
            <p className="text-lg font-bold text-gray-800">1,234</p>
            <p className="text-[10px] text-gray-500">học viên</p>
          </div>
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-2.5 text-center">
            <Video className="w-4 h-4 text-indigo-500 mx-auto mb-1" />
            <p className="text-lg font-bold text-gray-800">24</p>
            <p className="text-[10px] text-gray-500">khóa học</p>
          </div>
        </div>

        {/* Contact info */}
        {instructor.email && (
          <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-xl mb-4 group-hover:bg-gradient-to-r group-hover:from-indigo-50 group-hover:to-purple-50 transition-all duration-300 cursor-pointer">
            <Mail className="w-4 h-4 text-indigo-500 flex-shrink-0" />
            <span className="truncate text-xs">{instructor.email}</span>
            <ChevronRight className="w-3 h-3 text-gray-400 ml-auto flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
          </div>
        )}

        {/* Bio */}
        <div className="space-y-3">
          <p className="text-sm text-gray-600 leading-relaxed">
            Chuyên gia với hơn 5 năm kinh nghiệm trong lĩnh vực giáo dục trực
            tuyến. Đã đào tạo thành công{" "}
            <span className="font-semibold text-indigo-600">1.000+</span> học
            viên.
          </p>

          <div className="flex items-center gap-4 pt-2 border-t border-gray-100 mt-3">
            <div className="flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-xs text-gray-500">12 khóa học đang mở</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MessageCircle className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-xs text-gray-500">234 đánh giá</span>
            </div>
          </div>
        </div>

        {/* Xem thêm button */}
        <button className="w-full mt-4 text-center text-xs font-medium text-indigo-600 hover:text-indigo-700 flex items-center justify-center gap-1 py-2 rounded-lg hover:bg-indigo-50 transition-colors">
          Xem hồ sơ giảng viên
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
