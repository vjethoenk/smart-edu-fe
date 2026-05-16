"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetCourses } from "@/features/course/hook";
import { useEnrollment } from "@/features/enrollment/hook";
import { useGetCategories } from "@/features/category/hook";
import { useRouter } from "next/navigation";
import { BookOpen, Star, Users, Search, Filter, ArrowRight, TrendingUp, Clock } from "lucide-react";
import { formatVND } from "@/hooks/formatVND";

const CourseAll = () => {
  const { data: courses, isLoading, isError } = useGetCourses();
  const { data: categories } = useGetCategories();
  const { data: enrollments } = useEnrollment();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | "ALL">("ALL");

  const categoryMap = useMemo(() => {
    return new Map(categories?.map((category) => [category._id, category.name]));
  }, [categories]);

  const enrolledCourseIds = useMemo(() => {
    return new Set(enrollments?.map((enrollment) => enrollment.courseId) ?? []);
  }, [enrollments]);

  // Filter courses
  const filteredCourses = useMemo(() => {
    if (!courses) return [];

    return courses.filter((course) => {
      // Search by title
      const matchSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());

      // Filter by category
      const courseCategoryId = typeof course.categoryId === 'object' ? (course.categoryId as any)._id : course.categoryId;
      const matchCategory = selectedCategory === "ALL" || courseCategoryId === selectedCategory;

      return matchSearch && matchCategory;
    });
  }, [courses, searchQuery, selectedCategory]);

  // Get featured courses (first 4 for demo)
  const featuredCourses = useMemo(() => {
    return filteredCourses.slice(0, 4);
  }, [filteredCourses]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 py-12">
          <div className="mb-12 space-y-4">
            <Skeleton className="h-12 w-64 mx-auto" />
            <Skeleton className="h-6 w-96 mx-auto" />
            <Skeleton className="h-12 w-full md:w-1/2 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="rounded-xl overflow-hidden border-0 shadow-lg">
                <Skeleton className="h-52 w-full" />
                <CardContent className="p-5 space-y-3">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-8 w-28" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😔</div>
          <div className="text-red-600 mb-4 text-lg">Đã có lỗi xảy ra khi tải danh sách khóa học</div>
          <Button variant="outline" onClick={() => window.location.reload()} className="rounded-full">
            Thử lại
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/30">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-500 to-purple-600 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="bg-white/20 backdrop-blur text-white border-0 mb-4 px-4 py-1">
              Nền tảng học tập hàng đầu
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-indigo-100 to-purple-100 bg-clip-text text-transparent">
              Khám phá kiến thức mới
            </h1>
            <p className="text-lg md:text-xl text-indigo-100 mb-8">
              Hàng ngàn khóa học chất lượng cao từ các chuyên gia hàng đầu
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                placeholder="Tìm kiếm khóa học bạn quan tâm..."
                className="pl-12 pr-32 h-14 rounded-2xl border-0 shadow-2xl text-gray-900 placeholder:text-gray-400 text-base"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button
                className="absolute right-1 top-1 h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-6"
                onClick={() => { }}
              >
                Tìm kiếm
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: "Khóa học", value: courses?.length || 0, icon: BookOpen },
            { label: "Học viên", value: "10,000+", icon: Users },
            { label: "Giảng viên", value: "100+", icon: TrendingUp },
            { label: "Đánh giá", value: "4.8/5", icon: Star }
          ].map((stat, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-full mb-3">
                <stat.icon className="w-6 h-6 text-indigo-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Categories Filter */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Danh mục khóa học</h2>
              <p className="text-gray-500 mt-1">Chọn danh mục để lọc khóa học phù hợp</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Filter className="w-4 h-4" />
              <span>Lọc theo danh mục</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              variant={selectedCategory === "ALL" ? "default" : "outline"}
              className={`rounded-full px-6 py-2 h-auto font-medium transition-all ${selectedCategory === "ALL"
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md"
                : "hover:border-indigo-300 hover:text-indigo-600"
                }`}
              onClick={() => setSelectedCategory("ALL")}
            >
              Tất cả
            </Button>
            {categories?.map((cat) => (
              <Button
                key={cat._id}
                variant={selectedCategory === cat._id ? "default" : "outline"}
                className={`rounded-full px-6 py-2 h-auto font-medium transition-all ${selectedCategory === cat._id
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md"
                  : "hover:border-indigo-300 hover:text-indigo-600"
                  }`}
                onClick={() => setSelectedCategory(cat._id)}
              >
                {cat.name}
              </Button>
            ))}
          </div>
        </div>



        {/* All Courses Section */}
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Tất cả khóa học</h2>
            <p className="text-gray-500 mt-1">
              Tìm thấy <span className="font-bold text-indigo-600">{filteredCourses.length}</span> khóa học
            </p>
          </div>

          {filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredCourses.map((course) => (
                <Card
                  key={course._id}
                  className="group rounded-2xl p-0 overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-1 bg-white cursor-pointer"
                  onClick={() => router.push(enrolledCourseIds.has(course._id) ? `/course/${course._id}/view` : `/course/${course._id}`)}
                >
                  <div className="relative overflow-hidden h-48">
                    <img
                      src={course.thumbnail || "/api/placeholder/400/300"}
                      alt={course.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-indigo-600/90 backdrop-blur-sm text-white border-0 text-xs">
                        {typeof course.categoryId === "object"
                          ? (course.categoryId as any).name
                          : categoryMap.get(course.categoryId as string) || String(course.categoryId)}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-4 space-y-2 ">
                    <h3 className="font-semibold text-base line-clamp-2 text-gray-900 group-hover:text-indigo-600 transition-colors">
                      {course.title}
                    </h3>

                    <p className="text-xs text-gray-500 line-clamp-2">
                      {course.description || "Khóa học chất lượng cao với nội dung được cập nhật liên tục"}
                    </p>


                    <div className="pt-2">
                      <span className="text-xl font-bold text-gray-900">
                        {formatVND(parseFloat(course.price.toString()))}
                      </span>
                    </div>
                  </CardContent>

                  <CardFooter className="p-4 pt-0 border-t-0">
                    <Button
                      size="sm"
                      className="w-full rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm h-9"
                    >
                      {enrolledCourseIds.has(course._id) ? "Tiếp tục học" : "Xem chi tiết"}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
              <div className="text-7xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Không tìm thấy khóa học nào</h3>
              <p className="text-gray-500 max-w-md mx-auto mb-6">
                Vui lòng thử nghiệm lại với các từ khóa tìm kiếm khác
              </p>
              <Button
                variant="outline"
                className="rounded-full border-gray-200 hover:border-indigo-300 hover:text-indigo-600"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("ALL");
                }}
              >
                Xóa bộ lọc
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseAll;