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
import {
  BookOpen,
  Star,
  Users,
  Search,
  Filter,
  TrendingUp,
  Clock,
  ChevronDown,
  X,
  SlidersHorizontal,
  Tag,
  DollarSign,
  Gift,
  Sparkles,
  Gem,
  Layers,
  Library,
  GraduationCap,
  Code,
  Palette,
  Music,
  Camera,
  Briefcase,
  Heart,
  Zap,
} from "lucide-react";
import { formatVND } from "@/hooks/formatVND";
import { useGetPromotions } from "@/features/promotion/hook";

const CourseAll = () => {
  const { data: courses, isLoading, isError } = useGetCourses();
  const { data: categories } = useGetCategories();
  const { data: enrollments } = useEnrollment();
  const { data: promotions } = useGetPromotions();
  const router = useRouter();

  const getCoursePrice = (course: any) => {
    const originalPrice = parseFloat(course.price.toString() || "0");
    const promo = promotions?.find(
      (p) =>
        p.isActive &&
        new Date(p.endDate) > new Date() &&
        (typeof p.courseId === "string"
          ? p.courseId
          : (p.courseId as any)._id) === course._id,
    );

    if (promo) {
      return {
        originalPrice,
        finalPrice: originalPrice * (1 - promo.discountPercentage / 100),
        discountPercentage: promo.discountPercentage,
      };
    }
    return {
      originalPrice: null,
      finalPrice: originalPrice,
      discountPercentage: 0,
    };
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | "ALL">(
    "ALL",
  );
  const [priceSort, setPriceSort] = useState<"none" | "low-high" | "high-low">(
    "none",
  );
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>("ALL");
  const [isFilterMobileOpen, setIsFilterMobileOpen] = useState(false);

  const priceRanges = [
    { id: "ALL", label: "Tất cả", min: 0, max: Infinity, icon: Layers },
    { id: "free", label: "Miễn phí", min: 0, max: 0, icon: Gift },
    {
      id: "500k",
      label: "Dưới 500.000đ",
      min: 0,
      max: 500000,
      icon: DollarSign,
    },
    {
      id: "500k-1m",
      label: "500.000đ - 1.000.000đ",
      min: 500000,
      max: 1000000,
      icon: Tag,
    },
    {
      id: "1m-2m",
      label: "1.000.000đ - 2.000.000đ",
      min: 1000000,
      max: 2000000,
      icon: Sparkles,
    },
    {
      id: "above-2m",
      label: "Trên 2.000.000đ",
      min: 2000000,
      max: Infinity,
      icon: Gem,
    },
  ];

  // Map category icons
  const getCategoryIcon = (categoryName: string) => {
    const iconMap: { [key: string]: any } = {
      "Lập trình": Code,
      "Thiết kế": Palette,
      "Âm nhạc": Music,
      "Nhiếp ảnh": Camera,
      "Kinh doanh": Briefcase,
      "Phát triển bản thân": Heart,
      "Khoa học": GraduationCap,
      "Ngôn ngữ": BookOpen,
    };
    return iconMap[categoryName] || Library;
  };

  const categoryMap = useMemo(() => {
    return new Map(
      categories?.map((category) => [category._id, category.name]),
    );
  }, [categories]);

  const enrolledCourseIds = useMemo(() => {
    return new Set(enrollments?.map((enrollment) => enrollment.courseId) ?? []);
  }, [enrollments]);

  // Filter courses
  const filteredCourses = useMemo(() => {
    if (!courses) return [];

    let filtered = courses.filter((course) => {
      if (course.status !== "approved") return false;

      const matchSearch = course.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const courseCategoryId =
        typeof course.categoryId === "object"
          ? (course.categoryId as any)._id
          : course.categoryId;
      const matchCategory =
        selectedCategory === "ALL" || courseCategoryId === selectedCategory;

      const coursePrice = getCoursePrice(course).finalPrice;
      const priceRange = priceRanges.find((r) => r.id === selectedPriceRange);
      const matchPriceRange =
        !priceRange ||
        (coursePrice >= priceRange.min && coursePrice <= priceRange.max);

      return matchSearch && matchCategory && matchPriceRange;
    });

    if (priceSort === "low-high") {
      filtered = [...filtered].sort((a, b) => {
        const priceA = getCoursePrice(a).finalPrice;
        const priceB = getCoursePrice(b).finalPrice;
        return priceA - priceB;
      });
    } else if (priceSort === "high-low") {
      filtered = [...filtered].sort((a, b) => {
        const priceA = getCoursePrice(a).finalPrice;
        const priceB = getCoursePrice(b).finalPrice;
        return priceB - priceA;
      });
    }

    return filtered;
  }, [courses, searchQuery, selectedCategory, selectedPriceRange, priceSort]);

  const hasActiveFilters =
    selectedCategory !== "ALL" ||
    selectedPriceRange !== "ALL" ||
    priceSort !== "none";

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
              <Card
                key={i}
                className="rounded-xl overflow-hidden border-0 shadow-lg"
              >
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
          <div className="text-red-600 mb-4 text-lg">
            Đã có lỗi xảy ra khi tải danh sách khóa học
          </div>
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
            className="rounded-full"
          >
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
                onClick={() => {}}
              >
                Tìm kiếm
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Mobile Filter Button */}
        <div className="lg:hidden mb-6">
          <Button
            onClick={() => setIsFilterMobileOpen(!isFilterMobileOpen)}
            className="w-full bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
            variant="outline"
          >
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Bộ lọc{" "}
            {hasActiveFilters &&
              `(${[
                selectedCategory !== "ALL" ? 1 : 0,
                selectedPriceRange !== "ALL" ? 1 : 0,
                priceSort !== "none" ? 1 : 0,
              ].reduce((a, b) => a + b, 0)})`}
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filter - Desktop */}
          <div
            className={`lg:block ${isFilterMobileOpen ? "block" : "hidden"} lg:w-80 flex-shrink-0`}
          >
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 sticky top-24">
              {/* Filter Header */}
              <div className="p-5 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-indigo-600" />
                    <h3 className="font-semibold text-gray-900">Bộ lọc</h3>
                  </div>
                  {hasActiveFilters && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedCategory("ALL");
                        setSelectedPriceRange("ALL");
                        setPriceSort("none");
                      }}
                      className="text-xs text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      Xóa tất cả
                    </Button>
                  )}
                </div>
              </div>

              <div className="p-5 space-y-6">
                {/* Danh mục */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpen className="w-4 h-4 text-indigo-600" />
                    <span className="text-sm font-semibold text-gray-700">
                      Danh mục
                    </span>
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    <button
                      onClick={() => setSelectedCategory("ALL")}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center gap-2 ${
                        selectedCategory === "ALL"
                          ? "bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <Layers className="w-4 h-4" />
                      Tất cả khóa học
                    </button>
                    {categories?.map((cat) => {
                      const IconComponent = getCategoryIcon(cat.name);
                      return (
                        <button
                          key={cat._id}
                          onClick={() => setSelectedCategory(cat._id)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center gap-2 ${
                            selectedCategory === cat._id
                              ? "bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md"
                              : "text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          <IconComponent className="w-4 h-4" />
                          {cat.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Khoảng giá */}
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2 mb-3">
                    <DollarSign className="w-4 h-4 text-indigo-600" />
                    <span className="text-sm font-semibold text-gray-700">
                      Khoảng giá
                    </span>
                  </div>
                  <div className="space-y-2">
                    {priceRanges.map((range) => {
                      const IconComponent = range.icon;
                      return (
                        <button
                          key={range.id}
                          onClick={() => setSelectedPriceRange(range.id)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${
                            selectedPriceRange === range.id
                              ? "bg-gradient-to-r from-indigo-600  to-indigo-500 text-white shadow-md"
                              : "text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <IconComponent className="w-4 h-4" />
                            <span>{range.label}</span>
                          </span>
                          {selectedPriceRange === range.id && (
                            <ChevronDown className="w-4 h-4 transform -rotate-90" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Sắp xếp */}
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-4 h-4 text-indigo-600" />
                    <span className="text-sm font-semibold text-gray-700">
                      Sắp xếp
                    </span>
                  </div>
                  <div className="space-y-2">
                    <button
                      onClick={() => setPriceSort("low-high")}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${
                        priceSort === "low-high"
                          ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-lg">↑</span>
                        <span>Giá tăng dần</span>
                      </span>
                      {priceSort === "low-high" && (
                        <ChevronDown className="w-4 h-4 transform -rotate-90" />
                      )}
                    </button>
                    <button
                      onClick={() => setPriceSort("high-low")}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${
                        priceSort === "high-low"
                          ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-lg">↓</span>
                        <span>Giá giảm dần</span>
                      </span>
                      {priceSort === "high-low" && (
                        <ChevronDown className="w-4 h-4 transform -rotate-90" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Active Filters Summary */}
                {hasActiveFilters && (
                  <div className="pt-4 border-t border-gray-100">
                    <div className="p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl">
                      <div className="text-xs text-gray-600 mb-2">
                        Đang lọc theo:
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {selectedCategory !== "ALL" && (
                          <Badge className="bg-indigo-100 text-indigo-700 text-xs border-0">
                            {
                              categories?.find(
                                (c) => c._id === selectedCategory,
                              )?.name
                            }
                          </Badge>
                        )}
                        {selectedPriceRange !== "ALL" && (
                          <Badge className="bg-indigo-100 text-indigo-700 text-xs border-0">
                            {
                              priceRanges.find(
                                (r) => r.id === selectedPriceRange,
                              )?.label
                            }
                          </Badge>
                        )}
                        {priceSort !== "none" && (
                          <Badge className="bg-indigo-100 text-indigo-700 text-xs border-0">
                            {priceSort === "low-high"
                              ? "Giá tăng dần"
                              : "Giá giảm dần"}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Stats Bar */}
            <div className="bg-white rounded-xl p-4 mb-6 shadow-sm border border-gray-100 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-indigo-600" />
                </div>
                <div>
                  <span className="text-sm text-gray-500">Hiển thị</span>
                  <span className="font-semibold text-gray-900 ml-1">
                    {filteredCourses.length} khóa học
                  </span>
                </div>
              </div>

              {hasActiveFilters && (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-gray-400">Bộ lọc:</span>
                  {selectedCategory !== "ALL" && (
                    <Badge
                      variant="secondary"
                      className="bg-gray-100 text-gray-700"
                    >
                      {
                        categories?.find((c) => c._id === selectedCategory)
                          ?.name
                      }
                      <X
                        className="w-3 h-3 ml-1 cursor-pointer hover:text-red-500"
                        onClick={() => setSelectedCategory("ALL")}
                      />
                    </Badge>
                  )}
                  {selectedPriceRange !== "ALL" && (
                    <Badge
                      variant="secondary"
                      className="bg-gray-100 text-gray-700"
                    >
                      {
                        priceRanges.find((r) => r.id === selectedPriceRange)
                          ?.label
                      }
                      <X
                        className="w-3 h-3 ml-1 cursor-pointer hover:text-red-500"
                        onClick={() => setSelectedPriceRange("ALL")}
                      />
                    </Badge>
                  )}
                  {priceSort !== "none" && (
                    <Badge
                      variant="secondary"
                      className="bg-gray-100 text-gray-700"
                    >
                      {priceSort === "low-high"
                        ? "Giá tăng dần"
                        : "Giá giảm dần"}
                      <X
                        className="w-3 h-3 ml-1 cursor-pointer hover:text-red-500"
                        onClick={() => setPriceSort("none")}
                      />
                    </Badge>
                  )}
                </div>
              )}
            </div>

            {/* Courses Grid */}
            {filteredCourses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                  <Card
                    key={course._id}
                    className="group rounded-xl overflow-hidden p-0 border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white cursor-pointer"
                    onClick={() =>
                      router.push(
                        enrolledCourseIds.has(course._id)
                          ? `/course/${course._id}/view`
                          : `/course/${course._id}`,
                      )
                    }
                  >
                    <div className="relative overflow-hidden h-44">
                      <img
                        src={course.thumbnail || "/api/placeholder/400/300"}
                        alt={course.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-black/60 backdrop-blur-sm text-white border-0 text-xs">
                          {typeof course.categoryId === "object"
                            ? (course.categoryId as any).name
                            : categoryMap.get(course.categoryId as string) ||
                              String(course.categoryId)}
                        </Badge>
                      </div>
                    </div>

                    <CardContent className="p-4 space-y-2">
                      <h3 className="font-semibold text-sm line-clamp-2 text-gray-900 group-hover:text-indigo-600 transition-colors">
                        {course.title}
                      </h3>

                      <p className="text-xs text-gray-500 line-clamp-2">
                        {course.description ||
                          "Khóa học chất lượng cao với nội dung được cập nhật liên tục"}
                      </p>

                      <div className="pt-2 flex items-baseline gap-2 flex-wrap">
                        <span className="text-lg font-bold text-gray-900">
                          {formatVND(getCoursePrice(course).finalPrice)}
                        </span>
                        {getCoursePrice(course).originalPrice &&
                          getCoursePrice(course).discountPercentage > 0 && (
                            <>
                              <span className="text-xs line-through text-gray-400">
                                {formatVND(
                                  getCoursePrice(course).originalPrice!,
                                )}
                              </span>
                              <Badge
                                variant="destructive"
                                className="text-[10px] px-1 py-0 h-4"
                              >
                                -{getCoursePrice(course).discountPercentage}%
                              </Badge>
                            </>
                          )}
                      </div>
                    </CardContent>

                    <CardFooter className="p-4 pt-0 border-t-0">
                      <Button
                        size="sm"
                        className="w-full rounded-lg bg-gray-900 hover:bg-indigo-600 text-white text-sm h-9 transition-colors"
                      >
                        {enrolledCourseIds.has(course._id)
                          ? "Tiếp tục học"
                          : "Xem chi tiết"}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
                <div className="text-7xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Không tìm thấy khóa học nào
                </h3>
                <p className="text-gray-500 max-w-md mx-auto mb-6">
                  Vui lòng thử nghiệm lại với các từ khóa tìm kiếm khác
                </p>
                <Button
                  variant="outline"
                  className="rounded-full border-gray-200 hover:border-indigo-300 hover:text-indigo-600"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("ALL");
                    setSelectedPriceRange("ALL");
                    setPriceSort("none");
                  }}
                >
                  Xóa bộ lọc
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseAll;
