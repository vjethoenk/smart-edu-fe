"use client";

import { useState, useMemo, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Users,
  Award,
  TrendingUp,
  Search,
  BookOpen,
  GraduationCap,
  Mail,
  Loader2,
  BookmarkCheck,
  UserCheck,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetCourses, useGetCourseMonitoring } from "@/features/course/hook";

interface StudentProgressManagementProps {
  role: "ADMIN" | "INSTRUCTOR";
}

export function StudentProgressManagement({
  role,
}: StudentProgressManagementProps) {
  const currentUser = useSelector((state: any) => state.auth.user);
  const { data: courses = [], isLoading: isLoadingCourses } = useGetCourses();

  const [selectedTeacherId, setSelectedTeacherId] = useState<string>("");
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // 1. Extract instructors list dynamically from all courses (only for ADMIN)
  const teachers = useMemo(() => {
    if (role !== "ADMIN") return [];
    const uniqueMap = new Map();
    courses.forEach((course: any) => {
      if (course.createBy && course.createBy._id) {
        uniqueMap.set(course.createBy._id, course.createBy);
      }
    });
    return Array.from(uniqueMap.values());
  }, [courses, role]);

  // 2. Filter courses list based on role and selected teacher
  const filteredCourses = useMemo(() => {
    if (role === "INSTRUCTOR") {
      // Instructors can only see their own courses
      return courses.filter((c: any) => c.createBy?._id === currentUser?._id);
    }

    // Admin filters courses based on selected teacher (if any)
    if (!selectedTeacherId) return courses;
    return courses.filter((c: any) => c.createBy?._id === selectedTeacherId);
  }, [courses, role, currentUser, selectedTeacherId]);

  // 3. Auto-select the first course when lists are ready or filtered
  useEffect(() => {
    if (filteredCourses.length > 0) {
      // If currently selected course is not in the filtered list, select the first one
      const exists = filteredCourses.some(
        (c: any) => c._id === selectedCourseId,
      );
      if (!exists) {
        setSelectedCourseId(filteredCourses[0]._id);
      }
    } else {
      setSelectedCourseId("");
    }
  }, [filteredCourses, selectedCourseId]);

  // 4. Fetch Monitoring data for selected course
  const { data: monitoringData, isLoading: isLoadingMonitoring } =
    useGetCourseMonitoring(selectedCourseId);

  // 5. Search filter students
  const filteredStudents = useMemo(() => {
    const students = monitoringData?.topStudents ?? [];
    if (!searchQuery.trim()) return students;

    const query = searchQuery.toLowerCase().trim();
    return students.filter(
      (student: any) =>
        student.name.toLowerCase().includes(query) ||
        (student.email && student.email.toLowerCase().includes(query)),
    );
  }, [monitoringData, searchQuery]);

  // 6. Selected course detail for displays
  const currentCourse = useMemo(() => {
    return courses.find((c: any) => c._id === selectedCourseId);
  }, [courses, selectedCourseId]);

  // Helper: progress bar color based on percentage
  const getProgressColor = (percent: number) => {
    if (percent === 100) return "bg-gradient-to-r from-emerald-500 to-teal-500";
    if (percent >= 30) return "bg-gradient-to-r from-indigo-500 to-violet-500";
    return "bg-gradient-to-r from-amber-500 to-rose-500";
  };

  const getProgressBg = (percent: number) => {
    if (percent === 100) return "bg-emerald-50";
    if (percent >= 30) return "bg-indigo-50";
    return "bg-amber-50";
  };

  if (isLoadingCourses) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
        <p className="text-slate-500 text-sm font-medium animate-pulse">
          Đang tải danh sách khóa học...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-8xl mx-auto pb-12">
      {/* Upper Banner Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-8 md:p-10 shadow-xl border border-white/5">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-indigo-300 text-xs font-semibold backdrop-blur-md uppercase tracking-wider">
              <UserCheck className="w-3.5 h-3.5" />
              {role === "ADMIN" ? "Quản trị hệ thống" : "Cổng giảng dạy"}
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Quản Lý Học Viên & Tiến Độ
            </h1>
            <p className="text-slate-300 max-w-2xl text-sm md:text-base leading-relaxed">
              Theo dõi chi tiết các học viên đã đăng ký và thanh toán khóa học.
              Giám sát tiến độ học tập từng bài học để hỗ trợ kịp thời.
            </p>
          </div>
        </div>
      </div>

      {/* Filter Section Card */}
      <Card className="shadow-md border-slate-100 bg-white/80 backdrop-blur-md ">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-end">
            {/* Admin filters: Teacher dropdown */}
            {role === "ADMIN" && (
              <div className="col-span-1 md:col-span-3 space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Giáo viên giảng dạy
                </label>
                <Select
                  value={selectedTeacherId}
                  onChange={(e) => setSelectedTeacherId(e.target.value)}
                  className="w-full bg-slate-50 border-slate-200 hover:border-slate-300 transition-colors focus:ring-indigo-500"
                >
                  <option value="">Tất cả Giáo viên</option>
                  {teachers.map((teacher: any) => (
                    <option key={teacher._id} value={teacher._id}>
                      {teacher.name} ({teacher.email})
                    </option>
                  ))}
                </Select>
              </div>
            )}

            {/* Course dropdown */}
            <div
              className={
                role === "ADMIN"
                  ? "col-span-1 md:col-span-5 space-y-2"
                  : "col-span-1 md:col-span-8 space-y-2"
              }
            >
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Chọn khóa học giám sát
              </label>
              <Select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="w-full bg-slate-50 border-slate-200 hover:border-slate-300 transition-colors focus:ring-indigo-500"
                disabled={filteredCourses.length === 0}
              >
                {filteredCourses.length === 0 ? (
                  <option value="">Không có khóa học nào</option>
                ) : (
                  filteredCourses.map((course: any) => (
                    <option key={course._id} value={course._id}>
                      {course.title}{" "}
                      {role === "ADMIN" &&
                        `— GV: ${course.createBy?.name || "N/A"}`}
                    </option>
                  ))
                )}
              </Select>
            </div>

            {/* Search filter input */}
            <div className="col-span-1 md:col-span-4 space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Tìm kiếm học viên
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Nhập tên hoặc email học viên..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Area */}
      {selectedCourseId ? (
        isLoadingMonitoring ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse border-slate-100">
                  <CardContent className="h-28" />
                </Card>
              ))}
            </div>
            <Card className="animate-pulse border-slate-100">
              <CardContent className="h-64" />
            </Card>
          </div>
        ) : (
          <div className="space-y-8">
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1: Total Enrolled */}
              <Card className="relative overflow-hidden border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 group">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-500" />
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Học viên thực tế
                      </p>
                      <h3 className="text-3xl font-extrabold text-slate-800 tracking-tight">
                        {monitoringData?.enrolledCount ?? 0}
                      </h3>
                      <Badge className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-[10px] uppercase font-bold tracking-wider rounded-md">
                        Đã thanh toán
                      </Badge>
                    </div>
                    <div className="p-3.5 bg-indigo-50 rounded-xl text-indigo-600 group-hover:scale-110 transition-transform duration-300">
                      <Users className="w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Card 2: Completion Rate */}
              <Card className="relative overflow-hidden border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 group">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500" />
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Tỷ lệ hoàn thành khóa
                      </p>
                      <h3 className="text-3xl font-extrabold text-slate-800 tracking-tight">
                        {monitoringData?.completionRate ?? 0}%
                      </h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <BookmarkCheck className="w-3.5 h-3.5 text-emerald-500 inline" />
                        <span>
                          <strong>
                            {monitoringData?.completedStudents ?? 0}
                          </strong>{" "}
                          học viên học xong 100%
                        </span>
                      </p>
                    </div>
                    <div className="p-3.5 bg-emerald-50 rounded-xl text-emerald-600 group-hover:scale-110 transition-transform duration-300">
                      <Award className="w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Card 3: Class Average Progress */}
              <Card className="relative overflow-hidden border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 group">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-violet-500" />
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2 flex-1">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Tiến độ trung bình
                      </p>
                      <h3 className="text-3xl font-extrabold text-slate-800 tracking-tight">
                        {Math.round(monitoringData?.averageProgress ?? 0)}%
                      </h3>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-violet-500 to-indigo-500 h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${monitoringData?.averageProgress ?? 0}%`,
                          }}
                        />
                      </div>
                    </div>
                    <div className="p-3.5 bg-violet-50 rounded-xl text-violet-600 ml-4 group-hover:scale-110 transition-transform duration-300">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Students Table Area */}
            <Card className="border-slate-100 shadow-md bg-white overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-50/50">
                <div>
                  <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-indigo-600" />
                    <span>Danh Sách Học Viên Chi Tiết</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Đang xem khóa học:{" "}
                    <strong className="text-slate-700">
                      {currentCourse?.title}
                    </strong>
                  </p>
                </div>

                <Badge className="bg-indigo-600 text-white font-medium px-2.5 py-1 text-xs self-start sm:self-center">
                  Tổng số: {filteredStudents.length} học viên
                </Badge>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent bg-slate-50/20">
                      <TableHead className="font-semibold text-slate-700 py-4 pl-6">
                        Học viên
                      </TableHead>
                      <TableHead className="font-semibold text-slate-700">
                        Khóa học
                      </TableHead>
                      <TableHead className="font-semibold text-slate-700 text-center">
                        Bài học hoàn thành
                      </TableHead>
                      <TableHead className="font-semibold text-slate-700 min-w-[200px]">
                        Tiến độ học tập
                      </TableHead>
                      <TableHead className="font-semibold text-slate-700 text-center pr-6">
                        Trạng thái
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="text-center py-16 text-slate-400"
                        >
                          <div className="flex flex-col items-center justify-center gap-3">
                            <Users className="w-12 h-12 text-slate-200" />
                            <p className="font-medium text-slate-500">
                              Không tìm thấy học viên nào
                            </p>
                            <p className="text-xs text-slate-400 max-w-xs">
                              Thử nhập từ khóa khác hoặc chưa có học viên nào
                              tham gia khóa học này.
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredStudents.map((student: any, idx: number) => {
                        const progress = student.progressPercent ?? 0;
                        return (
                          <TableRow
                            key={student.userId || idx}
                            className="hover:bg-slate-50/50 transition-colors group"
                          >
                            {/* Student identity */}
                            <TableCell className="py-4 pl-6">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center font-bold text-indigo-700 text-sm group-hover:scale-105 transition-transform">
                                  {student.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="space-y-0.5">
                                  <h4 className="font-semibold text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors">
                                    {student.name}
                                  </h4>
                                  <div className="flex items-center gap-1 text-slate-500 text-xs">
                                    <Mail className="w-3 h-3 text-slate-400" />
                                    <span>{student.email || "N/A"}</span>
                                  </div>
                                </div>
                              </div>
                            </TableCell>

                            {/* Course name */}
                            <TableCell className="max-w-[200px] truncate">
                              <span className="text-slate-600 text-sm font-medium">
                                {currentCourse?.title}
                              </span>
                            </TableCell>

                            {/* Completed lesson count */}
                            <TableCell className="text-center">
                              <div className="inline-flex items-center justify-center px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                                {student.completedLessons} /{" "}
                                {student.totalLessons} bài học
                              </div>
                            </TableCell>

                            {/* Progress bar and details */}
                            <TableCell>
                              <div className="space-y-2">
                                <div className="flex justify-between items-center text-xs">
                                  <span className="font-semibold text-slate-700">
                                    {progress}%
                                  </span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden shadow-inner relative">
                                  <div
                                    className={`h-full rounded-full transition-all duration-500 ${getProgressColor(progress)}`}
                                    style={{ width: `${progress}%` }}
                                  />
                                </div>
                              </div>
                            </TableCell>

                            {/* Status badging */}
                            <TableCell className="text-center pr-6">
                              {progress === 100 ? (
                                <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-md text-xs font-medium">
                                  Hoàn thành
                                </Badge>
                              ) : progress > 0 ? (
                                <Badge className="bg-indigo-500/10 text-indigo-600 hover:bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-md text-xs font-medium">
                                  Đang học
                                </Badge>
                              ) : (
                                <Badge className="bg-slate-500/10 text-slate-500 hover:bg-slate-500/10 border border-slate-500/20 px-2.5 py-1 rounded-md text-xs font-medium">
                                  Chưa học
                                </Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </div>
        )
      ) : (
        /* Empty states when no courses are present in list */
        <Card className="border-dashed border-2 border-slate-200 shadow-none bg-slate-50/50">
          <CardContent className="flex flex-col items-center justify-center py-20 text-center gap-4">
            <div className="p-4 bg-indigo-50 rounded-full border border-indigo-100 text-indigo-600 animate-bounce">
              <GraduationCap className="w-12 h-12" />
            </div>
            <div className="space-y-1 max-w-sm">
              <h3 className="font-bold text-slate-800 text-lg">
                Chưa có khóa học nào hoạt động
              </h3>
              <p className="text-slate-500 text-sm">
                {role === "ADMIN"
                  ? "Hệ thống hiện tại chưa có khóa học nào được đăng ký và xuất bản. Hãy thêm khóa học mới trước."
                  : "Bạn chưa có khóa học giảng dạy nào được phát hành. Vui lòng tạo và đăng ký khóa học."}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
