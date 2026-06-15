"use client";

import { useQueries } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import {
  BookOpen,
  Users,
  Video,
  Loader2,
  GraduationCap,
  TrendingUp,
  Award,
} from "lucide-react";

import { useGetCourses } from "@/features/course/hook";
import { getCourseMonitoringApi } from "@/features/course/api";
import { RootState } from "@/store/type";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function InstructorDashboard() {
  const { user } = useSelector((state: RootState) => state.auth);
  const { data: courses, isLoading: isCoursesLoading, isError } = useGetCourses();

  // Lọc các khóa học thuộc về giảng viên đăng nhập
  const instructorCourses = courses?.filter((c) => c.createBy.email === user?.email) || [];

  // Lấy dữ liệu giám sát (monitoring) của từng khóa học song song bằng useQueries
  const monitoringQueries = useQueries({
    queries: instructorCourses.map((c) => ({
      queryKey: ["courseMonitoring", c._id],
      queryFn: () => getCourseMonitoringApi(c._id).then((res) => res.data),
      enabled: !!c._id,
    })),
  });

  const isMonitoringLoading = monitoringQueries.some((q) => q.isLoading);

  if (isCoursesLoading || isMonitoringLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
        <p className="text-gray-500 text-sm font-medium">Đang tải dữ liệu thống kê...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 font-medium">Có lỗi xảy ra khi tải dữ liệu thống kê.</p>
      </div>
    );
  }

  // Tính toán dữ liệu thống kê
  const totalCourses = instructorCourses.length;
  const totalEnrollments = monitoringQueries.reduce((acc, q) => acc + (q.data?.enrolledCount || 0), 0);
  const totalLessons = monitoringQueries.reduce((acc, q) => acc + (q.data?.totalLessons || 0), 0);

  const activeQueries = monitoringQueries.filter((q) => q.data !== undefined);
  const averageProgress =
    activeQueries.length > 0
      ? Math.round(
        activeQueries.reduce((acc, q) => acc + (q.data?.averageProgress || 0), 0) / activeQueries.length
      )
      : 0;

  // Chuẩn bị dữ liệu biểu đồ
  const chartData = instructorCourses.map((c, idx) => {
    const monitoring = monitoringQueries[idx]?.data;
    return {
      title: c.title,
      students: monitoring?.enrolledCount || 0,
      progress: Math.round(monitoring?.averageProgress || 0),
    };
  });

  const maxStudents = Math.max(...chartData.map((d) => d.students), 5);

  return (
    <div className="p-8 space-y-8 min-h-screen bg-slate-50/50">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-800 bg-clip-text text-transparent">
            Tổng quan
          </h1>
          <p className="text-slate-500 mt-1 font-medium">
            Chào mừng giảng viên <span className="text-indigo-600 font-semibold">{user?.name}</span>. Quản lý khóa học và theo dõi học tập của học viên.
          </p>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Khóa Học */}
        <Card className="border-0 shadow-md bg-white hover:shadow-lg transition-all duration-300 rounded-2xl overflow-hidden group">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-slate-500 text-sm font-semibold tracking-wide uppercase">Khóa Học Đang Dạy</p>
              <p className="text-4xl font-extrabold text-slate-800 group-hover:text-indigo-600 transition-colors">
                {totalCourses}
              </p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <BookOpen className="w-7 h-7 text-indigo-600" />
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Học Viên */}
        <Card className="border-0 shadow-md bg-white hover:shadow-lg transition-all duration-300 rounded-2xl overflow-hidden group">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-slate-500 text-sm font-semibold tracking-wide uppercase">Tổng Lượt Học Viên</p>
              <p className="text-4xl font-extrabold text-slate-800 group-hover:text-blue-600 transition-colors">
                {totalEnrollments}
              </p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Users className="w-7 h-7 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Bài Học */}
        <Card className="border-0 shadow-md bg-white hover:shadow-lg transition-all duration-300 rounded-2xl overflow-hidden group">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-slate-500 text-sm font-semibold tracking-wide uppercase">Tổng Số Bài Học</p>
              <p className="text-4xl font-extrabold text-slate-800 group-hover:text-amber-600 transition-colors">
                {totalLessons}
              </p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Video className="w-7 h-7 text-amber-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Biểu đồ số lượng học viên */}
        <Card className="border-0 shadow-md bg-white rounded-2xl lg:col-span-3">
          <CardHeader className="border-b border-slate-50 pb-5">
            <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              Lượng học viên theo từng khóa học
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {chartData.length > 0 ? (
              <div className="space-y-4">
                {/* Khu vực vẽ cột dọc */}
                <div className="flex items-end justify-between h-64 pt-6 gap-3 px-2 border-b border-slate-200">
                  {chartData.map((data, i) => {
                    const heightPercent = maxStudents > 0 ? (data.students / maxStudents) * 100 : 0;
                    return (
                      <div key={i} className="flex flex-col items-center flex-1 h-full justify-end group relative">
                        {/* Tooltip khi hover */}
                        <div className="absolute bottom-full mb-2 hidden group-hover:flex flex-col items-center z-10 transition-opacity">
                          <div className="bg-slate-800 text-white text-xs rounded py-1 px-2.5 whitespace-nowrap shadow-lg font-semibold">
                            {data.students} học viên
                          </div>
                          <div className="w-2 h-2 bg-slate-800 rotate-45 -mt-1"></div>
                        </div>

                        {/* Thanh cột gradient */}
                        <div
                          style={{ height: `${heightPercent || 4}%` }}
                          className="w-full bg-gradient-to-t from-indigo-600 to-violet-400 hover:from-indigo-700 hover:to-violet-500 rounded-t-lg transition-all duration-500 shadow-sm"
                        />

                        {/* Tiêu đề ngắn bên dưới */}
                        <span className="text-[10px] font-semibold text-slate-500 mt-2 text-center line-clamp-1 w-full max-w-[90px]">
                          {data.title}
                        </span>
                      </div>
                    );
                  })}
                </div>
                {/* Trục chú thích */}
                <div className="flex justify-between text-xs text-slate-400 font-medium px-2">
                  <span>Trục đứng: Lượt học viên</span>
                  <span>Khóa học đang dạy</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400 gap-2">
                <GraduationCap className="w-12 h-12 stroke-1" />
                <p className="text-sm font-medium">Bạn chưa tạo khóa học nào để hiển thị thống kê</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tiến độ trung bình của học viên trên từng khóa */}
        <Card className="border-0 shadow-md bg-white rounded-2xl lg:col-span-2">
          <CardHeader className="border-b border-slate-50 pb-5">
            <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-600" />
              Tiến độ trung bình của học viên
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {chartData.length > 0 ? (
              <div className="space-y-6">
                {/* Chỉ số trung bình tổng quan */}
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-xl flex items-center justify-between">
                  <div>
                    <p className="text-slate-500 text-xs font-semibold uppercase">Tiến độ trung bình chung</p>
                    <p className="text-2xl font-black text-indigo-700 mt-0.5">{averageProgress}%</p>
                  </div>
                  <div className="text-xs text-indigo-600 font-bold bg-indigo-100/60 rounded-full px-3 py-1">
                    Học tập tốt
                  </div>
                </div>

                {/* Danh sách các thanh ngang */}
                <div className="space-y-4 max-h-[17.5rem] overflow-y-auto pr-1">
                  {chartData.map((data, i) => (
                    <div key={i} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold text-slate-700">
                        <span className="truncate max-w-[170px]">{data.title}</span>
                        <span className="text-indigo-600">{data.progress}%</span>
                      </div>
                      <Progress value={data.progress} className="h-2 bg-slate-100 [&>div]:bg-gradient-to-r [&>div]:from-indigo-500 [&>div]:to-violet-500" />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400 gap-2">
                <GraduationCap className="w-12 h-12 stroke-1" />
                <p className="text-sm font-medium">Chưa có dữ liệu tiến độ học viên</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
