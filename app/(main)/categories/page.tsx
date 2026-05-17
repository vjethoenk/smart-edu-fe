"use client";

import { useMemo, useState } from "react";
import { useGetCategories } from "@/features/category/hook";
import { useGetCourses } from "@/features/course/hook";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Layers, Search, BookOpen, ArrowRight, TrendingUp, MonitorPlay, Code, Palette, Briefcase, Calculator, Music, HeartPulse } from "lucide-react";
import { useRouter } from "next/navigation";

// Hàm hỗ trợ chọn icon dựa trên tên danh mục (demo)
const getCategoryIcon = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes("công nghệ") || n.includes("it") || n.includes("phần mềm")) return <MonitorPlay className="w-8 h-8" />;
  if (n.includes("lập trình") || n.includes("code")) return <Code className="w-8 h-8" />;
  if (n.includes("thiết kế") || n.includes("design") || n.includes("mỹ thuật")) return <Palette className="w-8 h-8" />;
  if (n.includes("kinh doanh") || n.includes("marketing") || n.includes("business")) return <Briefcase className="w-8 h-8" />;
  if (n.includes("tài chính") || n.includes("kế toán")) return <Calculator className="w-8 h-8" />;
  if (n.includes("âm nhạc") || n.includes("nghệ thuật")) return <Music className="w-8 h-8" />;
  if (n.includes("sức khỏe") || n.includes("y tế")) return <HeartPulse className="w-8 h-8" />;
  return <Layers className="w-8 h-8" />;
};

export default function CategoryPage() {
  const { data: categories, isLoading: isLoadingCats, isError: isErrorCats } = useGetCategories();
  const { data: courses, isLoading: isLoadingCourses } = useGetCourses();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  // Map category ID to number of courses
  const courseCountMap = useMemo(() => {
    const map = new Map<string, number>();
    if (!courses) return map;

    courses.forEach(course => {
      const catId = typeof course.categoryId === 'object' ? (course.categoryId as any)._id : course.categoryId;
      if (catId) {
        map.set(catId, (map.get(catId) || 0) + 1);
      }
    });
    return map;
  }, [courses]);

  // Filter categories
  const filteredCategories = useMemo(() => {
    if (!categories) return [];
    return categories.filter(cat => 
      cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [categories, searchQuery]);

  if (isLoadingCats || isLoadingCourses) {
    return (
      <div className="min-h-screen bg-gray-50/50">
        <div className="container mx-auto px-4 py-12">
          <div className="mb-12 space-y-4 text-center">
            <Skeleton className="h-12 w-64 mx-auto" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="rounded-2xl border-0 shadow-sm">
                <CardContent className="p-6">
                  <Skeleton className="w-16 h-16 rounded-2xl mb-4" />
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isErrorCats) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4 text-lg">Đã có lỗi xảy ra khi tải danh mục</div>
          <Button variant="outline" onClick={() => window.location.reload()}>Thử lại</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/30">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="bg-white/10 backdrop-blur border-white/20 text-indigo-100 mb-4 px-4 py-1.5 text-sm">
              <TrendingUp className="w-4 h-4 mr-2 inline-block" /> Định hướng tương lai
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight text-white">
              Khám phá các thể loại
            </h1>
            <p className="text-lg text-indigo-200 mb-10 max-w-2xl mx-auto">
              Lựa chọn chuyên ngành phù hợp với đam mê của bạn. Hàng ngàn khóa học đang chờ đón bạn khám phá.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-xl mx-auto">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                placeholder="Tìm kiếm thể loại..."
                className="pl-12 h-14 rounded-full border-0 shadow-xl text-gray-900 placeholder:text-gray-400 text-base focus-visible:ring-2 focus-visible:ring-indigo-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Tất cả thể loại</h2>
            <p className="text-gray-500 mt-1">
              Tìm thấy <span className="font-bold text-indigo-600">{filteredCategories.length}</span> danh mục
            </p>
          </div>
        </div>

        {filteredCategories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCategories.map((category, index) => {
              const courseCount = courseCountMap.get(category._id) || 0;
              const colorClasses = [
                "bg-blue-50 text-blue-600",
                "bg-indigo-50 text-indigo-600",
                "bg-purple-50 text-purple-600",
                "bg-pink-50 text-pink-600",
                "bg-rose-50 text-rose-600",
                "bg-orange-50 text-orange-600",
                "bg-emerald-50 text-emerald-600",
                "bg-teal-50 text-teal-600",
              ];
              const colorClass = colorClasses[index % colorClasses.length];

              return (
                <Card
                  key={category._id}
                  className="group rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white cursor-pointer"
                  onClick={() => router.push(`/course`)}
                >
                  <CardContent className="p-6 h-full flex flex-col">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 ${colorClass}`}>
                      {getCategoryIcon(category.name)}
                    </div>
                    
                    <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-1">
                      {category.name}
                    </h3>
                    
                    <p className="text-sm text-gray-500 mb-6 line-clamp-2 flex-grow">
                      {category.description || "Khám phá các khóa học hấp dẫn trong danh mục này để phát triển kỹ năng của bạn."}
                    </p>
                    
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                      <div className="flex items-center text-sm font-medium text-gray-700 bg-gray-50 px-3 py-1 rounded-lg">
                        <BookOpen className="w-4 h-4 mr-2 text-indigo-500" />
                        {courseCount} khóa học
                      </div>
                      <Button variant="ghost" size="icon" className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-full h-8 w-8">
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <div className="text-6xl mb-6 opacity-80">📁</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Không tìm thấy thể loại</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-8">
              Không có danh mục nào khớp với từ khóa "{searchQuery}". Vui lòng thử lại với tên khác.
            </p>
            <Button 
              variant="default" 
              className="rounded-full px-8 bg-indigo-600 hover:bg-indigo-700"
              onClick={() => setSearchQuery("")}
            >
              Xóa tìm kiếm
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
