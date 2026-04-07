"use client";

import { useState } from "react";
import {
  Loader2,
  Trash2,
  Edit2,
  Plus,
  GraduationCap,
  BookOpen,
  BarChart3,
  User,
  FolderOpen,
} from "lucide-react";
import { useGetCourses, useDeleteCourse } from "@/features/course/hook";
import { useGetCategories } from "@/features/category/hook";
import { ICourse } from "@/types/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CourseModal } from "./components/CourseModal";
import { useRouter } from "next/navigation";

const CoursePage = () => {
  const router = useRouter();
  const { data: courses, isLoading, isError } = useGetCourses();
  const { data: categories } = useGetCategories();
  const deleteMutation = useDeleteCourse();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<ICourse | null>(null);

  const handleDeleteCourse = (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa khóa học này?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleEditCourse = (course: ICourse) => {
    setEditingCourse(course);
    setIsModalOpen(true);
  };

  const handleAddCourse = () => {
    setEditingCourse(null);
    setIsModalOpen(true);
  };

  const handleManageContent = (id: string) => {
    router.push(`/admin/courses/${id}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Có lỗi xảy ra khi tải danh sách khóa học</p>
      </div>
    );
  }

  const categoryMap = new Map(
    categories?.map((category) => [category._id, category.name]),
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header Section - Redesigned */}
        <div className="flex flex-col gap-6 rounded-2xl bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-4xl font-bold tracking-tight text-transparent">
              Quản lý khóa học
            </h1>
            <div className="mt-2 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
              <p className="text-sm font-medium text-slate-500">
                Tổng số khóa học:{" "}
                <span className="text-slate-900">{courses?.length || 0}</span>
              </p>
            </div>
          </div>

          <Button
            className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-2.5 text-white shadow-md transition-all hover:shadow-lg hover:shadow-slate-200"
            onClick={handleAddCourse}
          >
            <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />{" "}
            <span>Thêm khóa học mới</span>
          </Button>
        </div>

        {/* Courses Grid - Enhanced Cards */}
        {courses && courses.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            {courses.map((course) => (
              <Card
                key={course._id}
                className="group overflow-hidden p-0 rounded-2xl border-0 bg-white shadow-md transition-all duration-300 hover:shadow-2xl hover:shadow-slate-200"
              >
                <CardContent className="p-0">
                  <div className="relative overflow-hidden">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="h-52 w-full object-cover transition duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>
                    <span
                      className={`absolute left-4 top-4 rounded-full px-2.5 py-1 text-xs  shadow-md ${
                        course.isPublished
                          ? "bg-emerald-500 text-white"
                          : "bg-amber-500 text-white"
                      }`}
                    >
                      {course.isPublished ? "Đã duyệt" : "Chưa duyệt"}
                    </span>
                  </div>

                  <div className="p-5">
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <h3 className="line-clamp-1 text-xl font-bold text-slate-800">
                          {course.title}
                        </h3>
                        <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                          {course.description}
                        </p>
                      </div>
                      <div className="shrink-0 rounded-lg bg-slate-100 px-3 py-1.5 text-right">
                        <p className="font-bold text-slate-800">
                          {course?.price || "0"}đ
                        </p>
                        {/* <p className="text-[10px] font-medium text-slate-400">
                          Giá
                        </p> */}
                      </div>
                    </div>

                    {/* Meta Info */}
                    <div className="mb-5 space-y-2 border-t border-slate-100 pt-4 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-slate-500">
                          <FolderOpen className="h-3.5 w-3.5" /> Danh mục
                        </span>
                        <span className="font-medium text-slate-700">
                          {categoryMap.get(course.categoryId) ||
                            course.categoryId}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-slate-500">
                          <User className="h-3.5 w-3.5" /> Giáo viên
                        </span>
                        <span className="font-medium text-slate-700">
                          Việt Hoàng
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-slate-500">
                          <BarChart3 className="h-3.5 w-3.5" /> Cấp độ
                        </span>
                        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
                          {course.level}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons - Modern Layout */}
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        onClick={() => handleEditCourse(course)}
                        className="border-slate-200 bg-white text-slate-600 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
                      >
                        <Edit2 className="mr-2 h-3.5 w-3.5" /> Sửa
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleManageContent(course._id)}
                        className="border-slate-200 bg-white text-slate-600 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
                      >
                        <BookOpen className="mr-2 h-3.5 w-3.5" /> Nội dung
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleDeleteCourse(course._id)}
                        className="col-span-2 bg-gradient-to-r from-rose-500 to-rose-400 shadow-sm transition-all hover:from-rose-600 hover:to-rose-700"
                      >
                        <Trash2 className="mr-2 h-3.5 w-3.5" /> Xóa khóa học
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          // Empty State - Beautiful and Encouraging
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white/50 py-20 backdrop-blur-sm">
            <div className="rounded-full bg-slate-100 p-6">
              <GraduationCap className="h-12 w-12 text-slate-400" />
            </div>
            <h3 className="mt-6 text-xl font-semibold text-slate-800">
              Chưa có khóa học nào
            </h3>
            <p className="mt-2 max-w-sm text-center text-sm text-slate-500">
              Hãy bắt đầu hành trình giáo dục của bạn bằng cách tạo khóa học đầu
              tiên.
            </p>
            <Button
              onClick={handleAddCourse}
              className="mt-8 rounded-xl bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-2.5 text-white shadow-md transition-all hover:shadow-lg"
            >
              <Plus className="mr-2 h-4 w-4" /> Thêm khóa học ngay
            </Button>
          </div>
        )}

        {/* Modal Component - Make sure it's rendered outside the grid */}
        <CourseModal
          isOpen={isModalOpen}
          onOpenChange={setIsModalOpen}
          course={editingCourse}
        />
      </div>
    </div>
  );
};

export default CoursePage;
