import { useGetCategories } from "@/features/category/hook";
import { useGetByIdCourse } from "@/features/course/hook";
import { useGetCourseProgress } from "@/features/tracking/hook";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, User, ChevronRight, PlayCircle, Layers, Clock, Star } from "lucide-react";

const CardItem = ({ courseId }: { courseId: string }) => {
  const { data: course } = useGetByIdCourse(courseId);
  const { data: categories } = useGetCategories();
  const { data: progressData } = useGetCourseProgress(courseId);
  const progress = progressData?.data?.progressPercent ?? 0;

  const categoryMap = new Map(
    categories?.map((category) => [category._id, category.name]),
  );

  const getCategoryName = () => {
    if (!course?.categoryId) return "Chưa phân loại";
    if (typeof course.categoryId === "object") {
      return (course.categoryId as any).name;
    }
    return (
      categoryMap.get(course?.categoryId as string) ||
      String(course?.categoryId)
    );
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="group hover:shadow-lg transition-all p-0 duration-300 border border-gray-100 bg-white rounded-xl overflow-hidden">
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Image - Nhỏ gọn hơn */}
          <div className="relative w-28 h-28 md:w-32 md:h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600">
            <img
              src={course?.thumbnail || "/api/placeholder/400/300"}
              alt={course?.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <PlayCircle className="w-8 h-8 text-white drop-shadow-lg" />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                {/* Category */}
                <Badge variant="secondary" className="mb-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-0 px-2 py-0.5 text-xs">
                  <Layers className="w-3 h-3 mr-1" />
                  {getCategoryName()}
                </Badge>

                {/* Title */}
                <h3 className="text-base md:text-lg font-semibold text-gray-900 line-clamp-2 mb-1 group-hover:text-indigo-600 transition-colors">
                  {course?.title || "Đang tải..."}
                </h3>

                {/* Instructor */}
                <div className="flex items-center gap-2 mb-2">
                  <Avatar className="h-5 w-5">
                    <AvatarFallback className="bg-indigo-100 text-indigo-600 text-[10px]">
                      {course?.createBy?.name ? getInitials(course.createBy.name) : "GV"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-gray-600">
                    {course?.createBy?.name || "Đang tải..."}
                  </span>
                </div>
              </div>

              {/* Button */}
              <Button
                size="sm"
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-3 py-1.5 h-auto text-xs md:text-sm flex-shrink-0"
              >
                Vào học
                <ChevronRight className="w-3 h-3 ml-1" />
              </Button>
            </div>

            {/* Progress */}
            <div className="mt-3">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Tiến độ học tập</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-full rounded-full" style={{ width: `${progress}%` }} />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CardItem;