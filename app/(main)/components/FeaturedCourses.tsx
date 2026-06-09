"use client";
import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetCourses } from "@/features/course/hook";
import { useEnrollment } from "@/features/enrollment/hook";
import { useRouter } from "next/navigation";
import { BookOpen, Star, TrendingUp, Clock, Users } from "lucide-react";
import { formatVND } from "@/hooks/formatVND";
import { useGetCategories } from "@/features/category/hook";
import { useGetPromotions } from "@/features/promotion/hook";
import { useGetStatisticsTopCourses } from "@/features/statistics/hook";

export default function FeaturedCourses() {
  const { data: courses, isLoading, isError } = useGetCourses();
  const {
    data: topCoursesStats,
    isLoading: isLoadingTop,
    isError: isErrorTop,
  } = useGetStatisticsTopCourses({
    type: "students",
    limit: 5,
  });
  const { data: categories } = useGetCategories();
  const { data: enrollments } = useEnrollment();
  const { data: promotions } = useGetPromotions();
  const router = useRouter();
  const categoryMap = new Map(
    categories?.map((category) => [category._id, category.name]),
  );
  const enrolledCourseIds = new Set(
    enrollments?.map((enrollment) => enrollment.courseId) ?? [],
  );

  const getCoursePrice = (course: any) => {
    const originalPrice = parseFloat(String(course.price ?? "0")) || 0;
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

  const topCourses = React.useMemo(() => {
    if (!topCoursesStats) return [];
    const courseMap = new Map(
      (courses ?? []).map((course: any) => [course._id, course]),
    );
    return topCoursesStats
      .map((stat: any) => {
        const courseDetail = courseMap.get(stat.courseId);
        return {
          ...courseDetail,
          ...stat,
          _id: courseDetail?._id ?? stat.courseId,
          title: courseDetail?.title ?? stat.title,
        };
      })
      .filter(
        (course: any) =>
          course.status === "approved" || course.status === undefined,
      )
      .slice(0, 4);
  }, [courses, topCoursesStats]);

  if (isLoading || isLoadingTop) {
    return (
      <div className="container mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-72" />
          </div>
          <Skeleton className="h-5 w-32" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="rounded-2xl overflow-hidden">
              <Skeleton className="h-40 w-full" />
              <CardContent className="p-4 space-y-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-6 w-20" />
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Skeleton className="h-10 w-full rounded-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (isError || isErrorTop) {
    return (
      <div className="container mx-auto px-6 py-16 text-center">
        <div className="text-red-600 mb-4">
          Đã có lỗi xảy ra khi tải khóa học
        </div>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Thử lại
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-16">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div className="mb-4 md:mb-0">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-6 h-6 text-indigo-600" />
            <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Khóa học nổi bật
            </h2>
          </div>
          <p className="text-gray-500">
            Khám phá các kỹ năng hot nhất trên thị trường hiện nay
          </p>
        </div>
        <Button
          variant="ghost"
          onClick={() => router.push("/courses")}
          className="text-indigo-600 hover:text-indigo-700 group"
        >
          Tất cả khóa học
          <span className="ml-2 group-hover:translate-x-1 transition-transform">
            →
          </span>
        </Button>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {topCourses.map((course) => (
          <Card
            key={course._id}
            className="group rounded-2xl overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-none p-0"
          >
            {/* Image Container */}
            <div className="relative overflow-hidden h-48">
              <img
                src={course.thumbnail || "/api/placeholder/400/300"}
                alt={course.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              {/* Overlay Badge */}
              <div className="absolute top-3 left-3">
                <Badge className="bg-indigo-600 hover:bg-indigo-700 text-white">
                  {typeof course.categoryId === "object"
                    ? (course.categoryId as any).name
                    : categoryMap.get(course.categoryId as string) ||
                      String(course.categoryId)}
                </Badge>
              </div>
            </div>

            <CardContent className="p-5 space-y-3">
              {/* Title */}
              <h3 className="font-semibold text-lg line-clamp-2 hover:text-indigo-600 transition-colors">
                {course.title}
              </h3>

              <p className="text-sm text-gray-500 line-clamp-2">
                {course.description ||
                  "Khóa học chất lượng cao với nội dung được cập nhật liên tục"}
              </p>

              <div className="flex items-center gap-2 text-sm text-indigo-600 font-medium">
                <Users className="w-4 h-4" />
                {course.students ?? 0} lượt mua
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-2 pt-2 flex-wrap">
                <span className="text-2xl font-bold text-gray-800">
                  {typeof course.price !== "undefined" && course.price !== null
                    ? formatVND(getCoursePrice(course).finalPrice)
                    : "Liên hệ"}
                </span>
                {typeof course.price !== "undefined" &&
                  course.price !== null &&
                  getCoursePrice(course).originalPrice &&
                  getCoursePrice(course).discountPercentage > 0 && (
                    <>
                      <span className="text-sm line-through text-gray-400">
                        {formatVND(getCoursePrice(course).originalPrice!)}
                      </span>
                      <Badge variant="destructive" className="text-xs">
                        -{getCoursePrice(course).discountPercentage}%
                      </Badge>
                    </>
                  )}
              </div>
            </CardContent>

            <CardFooter className="p-5 border-t-0 pt-0">
              <Button
                onClick={() =>
                  router.push(
                    enrolledCourseIds.has(course._id)
                      ? `/course/${course._id}/view`
                      : `/course/${course._id}`,
                  )
                }
                className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 transition-all duration-300 group/btn h-10"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                {enrolledCourseIds.has(course._id) ? "Vào học" : "Xem chi tiết"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* View More Button for Mobile */}
      <div className="mt-10 text-center md:hidden ">
        <Button
          variant="outline"
          onClick={() => router.push("/courses")}
          className="rounded-full !cursor-pointer"
        >
          Xem tất cả khóa học
        </Button>
      </div>
    </div>
  );
}
