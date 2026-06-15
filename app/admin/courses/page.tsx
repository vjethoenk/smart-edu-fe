"use client";

import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/type";
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
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
} from "lucide-react";
import {
  useGetCourses,
  useDeleteCourse,
  useUpdateApprovalCourse,
} from "@/features/course/hook";
import { useGetCategories } from "@/features/category/hook";
import { ICourse } from "@/types/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CourseModal } from "./components/CourseModal";
import { useRouter } from "next/navigation";
import { ApprovalStatus } from "@/features/course/enum";

const ITEMS_PER_PAGE = 6;

const CoursePage = () => {
  const router = useRouter();
  const { role } = useSelector((state: RootState) => state.auth);
  const { data: courses, isLoading, isError } = useGetCourses();
  const { data: categories } = useGetCategories();
  const updateApproval = useUpdateApprovalCourse();
  const deleteMutation = useDeleteCourse();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<ICourse | null>(null);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterTeacher, setFilterTeacher] = useState("all");
  const [filterLevel, setFilterLevel] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

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

  const handleApproval = async (id: string) => {
    await updateApproval.mutateAsync({ id, status: ApprovalStatus.IN_REVIEW });
  };

  const categoryMap = useMemo(
    () => new Map(categories?.map((cat) => [cat._id, cat.name])),
    [categories],
  );

  // Lấy danh sách giáo viên unique
  const teacherList = useMemo(() => {
    if (!courses) return [];
    const seen = new Set<string>();
    return courses
      .map((c) => c.createBy)
      .filter((t) => {
        if (seen.has(t._id)) return false;
        seen.add(t._id);
        return true;
      });
  }, [courses]);

  // Lọc + tìm kiếm + sắp xếp mới nhất
  const filteredCourses = useMemo(() => {
    if (!courses) return [];

    let result = [...courses];

    // Sắp xếp mới nhất lên đầu
    result.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });

    // Tìm kiếm theo tiêu đề / mô tả
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.description?.toLowerCase().includes(q) ||
          c.createBy.name.toLowerCase().includes(q),
      );
    }

    // Lọc theo danh mục
    if (filterCategory !== "all") {
      result = result.filter((c) => {
        const catId =
          typeof c.categoryId === "object"
            ? (c.categoryId as any)._id
            : c.categoryId;
        return catId === filterCategory;
      });
    }

    // Lọc theo giáo viên
    if (filterTeacher !== "all") {
      result = result.filter((c) => c.createBy._id === filterTeacher);
    }

    // Lọc theo cấp độ
    if (filterLevel !== "all") {
      result = result.filter((c) => c.level === filterLevel);
    }

    // Lọc theo trạng thái
    if (filterStatus !== "all") {
      result = result.filter((c) => c.status === filterStatus);
    }

    return result;
  }, [courses, searchQuery, filterCategory, filterTeacher, filterLevel, filterStatus]);

  // Phân trang
  const totalPages = Math.ceil(filteredCourses.length / ITEMS_PER_PAGE);
  const paginatedCourses = filteredCourses.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Reset page khi filter thay đổi
  const handleFilterChange = (setter: (v: string) => void) => (v: string) => {
    setter(v);
    setCurrentPage(1);
  };

  const hasActiveFilter =
    searchQuery || filterCategory !== "all" || filterTeacher !== "all" || filterLevel !== "all" || filterStatus !== "all";

  const clearAllFilters = () => {
    setSearchQuery("");
    setFilterCategory("all");
    setFilterTeacher("all");
    setFilterLevel("all");
    setFilterStatus("all");
    setCurrentPage(1);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col gap-6 rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex flex-row justify-between gap-2">
            <div>
              <h1 className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-4xl font-bold tracking-tight text-transparent">
                Quản lý khóa học
              </h1>
              <div className="mt-2 flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                <p className="text-sm font-medium text-slate-500">
                  Tổng số:{" "}
                  <span className="text-slate-900">{courses?.length || 0}</span>{" "}
                  khóa học
                  {hasActiveFilter && (
                    <span className="ml-2 text-indigo-600">
                      · Đang hiển thị {filteredCourses.length} kết quả
                    </span>
                  )}
                </p>
              </div>
            </div>
            <Button
              className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-2.5 text-white shadow-md transition-all hover:shadow-lg hover:shadow-slate-200"
              onClick={handleAddCourse}
              disabled={role === "ADMIN"}
            >
              <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />{" "}
              <span>Thêm khóa học mới</span>
            </Button>
          </div>

          <div className="rounded-2xl bg-white  space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Tìm kiếm theo tên khóa học, mô tả, giáo viên..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-10 text-sm text-slate-800 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
              />
              {searchQuery && (
                <button
                  onClick={() => { setSearchQuery(""); setCurrentPage(1); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Filters Row */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5 text-sm font-medium text-slate-500">
                <SlidersHorizontal className="h-4 w-4" />
                <span>Bộ lọc:</span>
              </div>

              {/* Filter Danh mục */}
              <select
                value={filterCategory}
                onChange={(e) => handleFilterChange(setFilterCategory)(e.target.value)}
                className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 cursor-pointer"
              >
                <option value="all">Tất cả danh mục</option>
                {categories?.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>

              {/* Filter Giáo viên */}
              <select
                value={filterTeacher}
                onChange={(e) => handleFilterChange(setFilterTeacher)(e.target.value)}
                className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 cursor-pointer"
              >
                <option value="all">Tất cả giáo viên</option>
                {teacherList.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.name}
                  </option>
                ))}
              </select>

              {/* Filter Cấp độ */}
              <select
                value={filterLevel}
                onChange={(e) => handleFilterChange(setFilterLevel)(e.target.value)}
                className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 cursor-pointer"
              >
                <option value="all">Tất cả cấp độ</option>
                <option value="Cơ bản">Cơ bản</option>
                <option value="Trung cấp">Trung cấp</option>
                <option value="Nâng cao">Nâng cao</option>
              </select>

              {/* Filter Trạng thái */}
              <select
                value={filterStatus}
                onChange={(e) => handleFilterChange(setFilterStatus)(e.target.value)}
                className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 cursor-pointer"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value={ApprovalStatus.APPROVED}>Đã duyệt</option>
                <option value={ApprovalStatus.IN_REVIEW}>Đang trình duyệt</option>
                <option value="PENDING">Chưa duyệt</option>
              </select>

              {/* Clear Filters */}
              {hasActiveFilter && (
                <button
                  onClick={clearAllFilters}
                  className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600 transition hover:bg-red-100"
                >
                  <X className="h-3.5 w-3.5" />
                  Xóa bộ lọc
                </button>
              )}
            </div>
          </div>
        </div>


        {/* Courses Grid */}
        {paginatedCourses.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
              {paginatedCourses.map((course) => (
                <Card
                  key={course._id}
                  className="group overflow-hidden p-0 rounded-2xl border-0 bg-white shadow-md transition-all duration-300 hover:shadow-2xl hover:shadow-slate-200"
                >
                  <CardContent className="p-0">
                    <div
                      className="relative overflow-hidden cursor-pointer"
                      onClick={() => handleManageContent(course._id)}
                    >
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="h-52 w-full object-cover transition duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>
                      <span
                        className={`absolute left-4 top-4 rounded-full px-2.5 py-1 text-xs shadow-md ${course.status === ApprovalStatus.APPROVED
                          ? "bg-emerald-500 text-white"
                          : course.status === ApprovalStatus.IN_REVIEW
                            ? "bg-amber-500 text-white"
                            : "bg-gray-500 text-white"
                          }`}
                      >
                        {course.status === ApprovalStatus.APPROVED
                          ? "Đã duyệt"
                          : course.status === ApprovalStatus.IN_REVIEW
                            ? "Đang trình duyệt"
                            : "Chưa duyệt"}
                      </span>
                      {/* Badge mới nhất */}
                      {course.createdAt &&
                        Date.now() - new Date(course.createdAt).getTime() <
                        7 * 24 * 60 * 60 * 1000 && (
                          <span className="absolute right-4 top-4 rounded-full bg-indigo-600 px-2.5 py-1 text-xs text-white shadow-md">
                            Mới
                          </span>
                        )}
                    </div>

                    <div className="p-5">
                      <div className="mb-4 flex items-start justify-between gap-3">
                        <div
                          className="flex-1 cursor-pointer"
                          onClick={() => handleManageContent(course._id)}
                        >
                          <h3 className="line-clamp-1 text-xl font-bold text-slate-800">
                            {course.title}
                          </h3>
                          <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                            {course.description}
                          </p>
                        </div>
                        <div className="shrink-0 rounded-lg bg-slate-100 px-3 py-1.5 text-right">
                          <p className="font-bold text-slate-800">
                            {Number(course?.price || 0).toLocaleString("vi-VN")}đ
                          </p>
                        </div>
                      </div>

                      {/* Meta Info */}
                      <div className="mb-5 space-y-2 border-t border-slate-100 pt-4 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5 text-slate-500">
                            <FolderOpen className="h-3.5 w-3.5" /> Danh mục
                          </span>
                          <span className="font-medium text-slate-700">
                            {typeof course.categoryId === "object"
                              ? (course.categoryId as any).name
                              : categoryMap.get(course.categoryId as string) ||
                              String(course.categoryId)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5 text-slate-500">
                            <User className="h-3.5 w-3.5" /> Giáo viên
                          </span>
                          <span className="font-medium text-slate-700">
                            {course.createBy.name}
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

                      {/* Action Buttons */}
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          variant="outline"
                          onClick={() => handleEditCourse(course)}
                          disabled={role === "ADMIN"}
                          className="border-slate-200 bg-white text-slate-600 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Edit2 className="mr-2 h-3.5 w-3.5" /> Sửa
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleApproval(course._id)}
                          disabled={
                            course.status === ApprovalStatus.IN_REVIEW ||
                            role === "ADMIN"
                          }
                          className="border-slate-200 bg-white text-slate-600 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <BookOpen className="mr-2 h-3.5 w-3.5" /> Trình duyệt
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleDeleteCourse(course._id)}
                          className="col-span-2 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 py-2"
                        >
                          <Trash2 className="mr-2 h-3.5 w-3.5" /> Xóa khóa học
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 py-4">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  const isActive = page === currentPage;
                  const isNear =
                    page === 1 ||
                    page === totalPages ||
                    Math.abs(page - currentPage) <= 1;

                  if (!isNear) {
                    if (page === 2 || page === totalPages - 1) {
                      return (
                        <span key={page} className="px-1 text-slate-400">
                          ...
                        </span>
                      );
                    }
                    return null;
                  }

                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition ${isActive
                        ? "bg-gradient-to-r from-slate-800 to-slate-900 text-white shadow-md"
                        : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                        }`}
                    >
                      {page}
                    </button>
                  );
                })}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>

                <span className="ml-2 text-sm text-slate-500">
                  Trang {currentPage}/{totalPages} · {filteredCourses.length} khóa học
                </span>
              </div>
            )}
          </>
        ) : (
          // Empty State
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white/50 py-20 backdrop-blur-sm">
            <div className="rounded-full bg-slate-100 p-6">
              <GraduationCap className="h-12 w-12 text-slate-400" />
            </div>
            {hasActiveFilter ? (
              <>
                <h3 className="mt-6 text-xl font-semibold text-slate-800">
                  Không tìm thấy khóa học nào
                </h3>
                <p className="mt-2 max-w-sm text-center text-sm text-slate-500">
                  Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc của bạn
                </p>
                <Button
                  onClick={clearAllFilters}
                  variant="outline"
                  className="mt-6 rounded-xl"
                >
                  <X className="mr-2 h-4 w-4" /> Xóa tất cả bộ lọc
                </Button>
              </>
            ) : (
              <>
                <h3 className="mt-6 text-xl font-semibold text-slate-800">
                  Chưa có khóa học nào
                </h3>
                <p className="mt-2 max-w-sm text-center text-sm text-slate-500">
                  Hãy bắt đầu hành trình giáo dục của bạn bằng cách tạo khóa học đầu tiên.
                </p>
                <Button
                  onClick={handleAddCourse}
                  className="mt-8 rounded-xl bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-2.5 text-white shadow-md transition-all hover:shadow-lg"
                >
                  <Plus className="mr-2 h-4 w-4" /> Thêm khóa học ngay
                </Button>
              </>
            )}
          </div>
        )}

        {/* Modal Component */}
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
