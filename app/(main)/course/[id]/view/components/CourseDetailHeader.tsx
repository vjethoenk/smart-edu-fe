// CourseDetailHeader.tsx - Phiên bản tối giản & đẹp mắt
"use client";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  GraduationCap,
  Award,
  Users,
  Star,
  Sparkles,
  CheckCircle,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ICourse } from "@/types/api";
import { useState } from "react";
import CourseProgress from "@/components/CourseProgress";
import { ChatPanel } from "@/components/chat/ChatPanel";

const getInitials = (name?: string) =>
  (name || "Course")
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export default function CourseDetailHeader({
  course,
  totalSections,
  totalLessons,
  progress,
}: {
  course: ICourse;
  totalSections: number;
  totalLessons: number;
  progress?: number;
}) {
  const progressValue = Math.min(100, Math.max(0, progress ?? 0));
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="mt-8 space-y-6 container mx-auto max-w-5xl">
      {/* Main Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 md:p-8">
          {/* Header: Title + Toggle */}
          <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Badge className="bg-indigo-600 text-white border-0 rounded-full px-3 py-1 text-xs">
                  {course.level || "Cơ bản"}
                </Badge>
                <Badge variant="outline" className="rounded-full text-xs">
                  <GraduationCap className="w-3 h-3 mr-1" />
                  Có giấy khen
                </Badge>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800 leading-tight">
                {course.title}
              </h1>
            </div>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
            >
              {isExpanded ? "Thu gọn" : "Chi tiết"}
              <span className="text-lg">
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronUp className="w-4 h-4" />
                )}
              </span>
            </button>
          </div>

          {/* Progress Section */}
          {/* <div className="bg-slate-50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-indigo-600" />
                <span className="font-medium text-slate-700 text-sm">
                  Tiến độ
                </span>
              </div>
              <span className="text-xl font-bold text-indigo-600">
                {Math.round(progressValue)}%
              </span>
            </div>
            <Progress value={progressValue} className="h-2 bg-white" />
            <p className="text-xs text-slate-500 mt-2">
              {progressValue === 100
                ? "Hoàn thành xuất sắc! 🎉"
                : `${100 - Math.round(progressValue)}% nữa để nhận giấy khen`}
            </p>
          </div> */}
          <CourseProgress courseId={course._id} />
        </div>

        {/* Expanded Section - Chỉ hiển thị khi nhấn */}
        {isExpanded && (
          <div className="border-t border-slate-100 bg-slate-50/50 p-6 space-y-5">
            {/* Mô tả */}
            {course.description && (
              <div>
                <h3 className="font-semibold text-slate-800 mb-2 flex items-center gap-2 text-sm">
                  <Sparkles className="w-4 h-4 text-indigo-500" />
                  Giới thiệu
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {course.description}
                </p>
              </div>
            )}

            {/* Giảng viên */}
            <div className="flex flex-col gap-4 p-3 rounded-xl bg-white border border-slate-200">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-indigo-600 text-white text-sm">
                    {getInitials(course.createBy?.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-xs text-slate-500">Giảng viên</p>
                  <p className="font-semibold text-slate-800 text-sm">
                    {course.createBy?.name}
                  </p>
                </div>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="secondary" className="w-full md:w-auto">
                    Nhắn tin với giảng viên
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-5xl w-full">
                  <DialogHeader>
                    <DialogTitle>
                      Nhắn tin với {course.createBy?.name}
                    </DialogTitle>
                    <DialogDescription>
                      Bắt đầu trò chuyện trực tiếp với giảng viên của khóa học.
                    </DialogDescription>
                  </DialogHeader>
                  <ChatPanel
                    title="Chat với giảng viên"
                    subtitle={`Khóa học ${course.title}`}
                    defaultCourseId={course._id}
                    defaultReceiverId={course.createBy?._id}
                  />
                </DialogContent>
              </Dialog>
            </div>

            {/* Bạn sẽ học được */}
            <div>
              <h3 className="font-semibold text-slate-800 mb-2 text-sm">
                Bạn sẽ học được
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {[
                  "Kiến thức nền tảng vững chắc",
                  "Thực hành qua dự án thực tế",
                  "Nhận giấy khen sau khóa học",
                  "Hỗ trợ trực tiếp từ giảng viên",
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 text-sm text-slate-600"
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Component phụ cho thống kê
function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string | number;
}) {
  return (
    <div className="bg-white rounded-xl p-3 text-center border border-slate-100">
      <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center mx-auto mb-1.5">
        <Icon className="w-4 h-4 text-indigo-600" />
      </div>
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-base font-bold text-slate-800">{value}</p>
    </div>
  );
}
