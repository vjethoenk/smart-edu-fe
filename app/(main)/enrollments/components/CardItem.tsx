// CardItem.tsx
import { useGetCategories } from "@/features/category/hook";
import { useGetByIdCourse } from "@/features/course/hook";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, User, ChevronRight, PlayCircle, Layers } from "lucide-react";

const CardItem = ({ courseId }: { courseId: string }) => {
  const { data: course } = useGetByIdCourse(courseId);
  const { data: categories } = useGetCategories();

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
    <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-500 border-0 bg-white rounded-2xl p-0">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          {/* Image Section */}
          <div className="relative md:w-80 h-48 md:h-auto overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600">
            <img
              src={course?.thumbnail || "/api/placeholder/400/300"}
              alt={course?.title}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Play Button Overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center backdrop-blur-sm">
              <div className="bg-white/20 rounded-full p-4 transform scale-90 group-hover:scale-100 transition-transform duration-300">
                <PlayCircle className="w-10 h-10 text-white drop-shadow-lg" />
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="flex-1 p-6 lg:p-7 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Category Badge */}
              <Badge className="bg-gradient-to-r from-indigo-50 to-indigo-100 text-indigo-700 hover:from-indigo-100 hover:to-indigo-200 border-0 px-3 py-1.5 rounded-full font-medium shadow-sm w-fit">
                <Layers className="w-3.5 h-3.5 mr-1.5" />
                {getCategoryName()}
              </Badge>

              {/* Title */}
              <h3 className="text-xl lg:text-2xl font-bold text-gray-800 line-clamp-2 group-hover:text-indigo-600 transition-colors duration-300 leading-tight">
                {course?.title || "Đang tải..."}
              </h3>

              {/* Instructor Info - Enhanced */}
              <div className="flex items-center gap-3 pt-2">
                <Avatar className="h-10 w-10 ring-2 ring-indigo-200 ring-offset-2 transition-all group-hover:ring-indigo-400">
                  <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-sm font-medium">
                    {course?.createBy?.name
                      ? getInitials(course.createBy.name)
                      : "GV"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400 uppercase tracking-wide">
                    Giảng viên
                  </span>
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-indigo-500" />
                    <span className="text-sm font-medium text-gray-700">
                      {course?.createBy?.name || "Đang tải..."}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="relative my-4">
              <div className="w-full border-t border-gray-100"></div>
            </div>

            {/* Button Section */}
            <div className="flex items-center justify-end">
              <Button className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white shadow-md hover:shadow-lg transition-all duration-300 rounded-xl px-6 py-2.5 group/btn">
                <span className="font-medium">Vào học ngay</span>
                <ChevronRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CardItem;
