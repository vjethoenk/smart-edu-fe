"use client";

import { Loader2, BarChart3, CheckCircle2, Users } from "lucide-react";
import { useGetCourseMonitoring } from "@/features/course/hook";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface CourseMonitoringProps {
  courseId: string;
}

const CourseMonitoring = ({ courseId }: CourseMonitoringProps) => {
  const { data, isLoading, isError } = useGetCourseMonitoring(courseId);

  // Xử lý loading
  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-10 flex items-center justify-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
          <span className="text-sm text-slate-500">
            Đang tải số liệu giảng dạy...
          </span>
        </CardContent>
      </Card>
    );
  }

  // Xử lý error hoặc không có data
  if (isError || !data) {
    return (
      <Card>
        <CardContent className="py-6">
          <p className="text-sm text-red-600 text-center">
            Không thể tải thông tin theo dõi khóa học.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Chuẩn hóa dữ liệu sau khi đã đảm bảo data tồn tại
  const completionRate = data.completionRate ?? 0;
  const normalizedCompletionRate =
    completionRate <= 1 ? completionRate * 100 : completionRate;

  const averageProgress = data.averageProgress ?? 0;
  const normalizedAverageProgress =
    averageProgress <= 1 ? averageProgress * 100 : averageProgress;

  // Đảm bảo topStudents luôn là một mảng để tránh lỗi .length hoặc .map
  const topStudents = data.topStudents ?? [];

  return (
    <Card className="space-y-4">
      <CardHeader>
        <CardTitle>Theo dõi học viên</CardTitle>
        <CardDescription>
          Tổng quan số lượng học viên và tỷ lệ hoàn thành khóa học.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Chỉ số tổng quát */}
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-slate-500" />
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-500">
                  Học viên đăng ký
                </p>
                <p className="text-xl font-bold text-slate-900">
                  {data.enrolledCount ?? 0}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center gap-3">
              <BarChart3 className="h-5 w-5 text-slate-500" />
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-500">
                  Tỉ lệ hoàn thành
                </p>
                <p className="text-xl font-bold text-slate-900">
                  {Math.round(normalizedCompletionRate)}%
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-slate-500" />
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-500">
                  Học viên đã xong
                </p>
                <p className="text-xl font-bold text-slate-900">
                  {data.completedStudents ?? 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Thanh tiến độ trung bình */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500 font-medium">
              Tỉ lệ tiến độ trung bình
            </span>
            <span className="font-bold text-indigo-600">
              {Math.round(normalizedAverageProgress)}%
            </span>
          </div>
          <Progress
            value={Math.round(normalizedAverageProgress)}
            className="h-2"
          />
        </div>

        {/* Danh sách học viên tiêu biểu */}
        <div className="pt-2">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-bold text-slate-800">
              Học viên theo dõi hàng đầu
            </p>
            <span className="text-xs bg-slate-100 px-2 py-1 rounded-full text-slate-500 font-medium">
              {topStudents.length} học viên
            </span>
          </div>

          <div className="space-y-3">
            {topStudents.length > 0 ? (
              topStudents.map((student) => (
                <div
                  key={student.userId}
                  className="rounded-xl border border-slate-100 bg-slate-50/50 p-3 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <div>
                      <p className="font-semibold text-slate-900">
                        {student.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        Đã học {student.completedLessons}/{student.totalLessons}{" "}
                        bài
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-indigo-600">
                        {student.progressPercent}%
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-center text-slate-400 py-4">
                Chưa có dữ liệu học viên
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseMonitoring;
