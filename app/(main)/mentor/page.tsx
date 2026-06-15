"use client";

import { useState, useMemo } from "react";
import { useGetCourses } from "@/features/course/hook";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Mail, BookOpen, Star, Award } from "lucide-react";

interface MentorStats {
  _id: string;
  name: string;
  email: string;
  courseCount: number;
}

const MentorAll = () => {
  const { data: courses, isLoading, isError } = useGetCourses();
  const [searchQuery, setSearchQuery] = useState("");

  // Extract unique mentors from courses and count their courses
  const mentors = useMemo(() => {
    if (!courses) return [];

    const mentorMap = new Map<string, MentorStats>();

    courses.forEach((course) => {
      if (course.createBy && course.createBy._id) {
        const mentorId = course.createBy._id;
        if (!mentorMap.has(mentorId)) {
          mentorMap.set(mentorId, {
            _id: mentorId,
            name: course.createBy.name,
            email: course.createBy.email,
            courseCount: 1,
          });
        } else {
          const mentor = mentorMap.get(mentorId)!;
          mentor.courseCount += 1;
        }
      }
    });

    return Array.from(mentorMap.values());
  }, [courses]);

  // Filter mentors by search query
  const filteredMentors = useMemo(() => {
    return mentors.filter(
      (mentor) =>
        mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mentor.email.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [mentors, searchQuery]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50/50">
        <div className="container mx-auto px-4 py-12">
          <div className="mb-12 space-y-4">
            <Skeleton className="h-12 w-64 mx-auto" />
            <Skeleton className="h-6 w-96 mx-auto" />
            <Skeleton className="h-12 w-full md:w-1/2 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="rounded-2xl border-0 shadow-sm">
                <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                  <Skeleton className="w-24 h-24 rounded-full" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-10 w-full mt-4" />
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
      <div className="min-h-screen bg-gray-50/50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4 text-lg">
            Đã có lỗi xảy ra khi tải danh sách giảng viên
          </div>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Thử lại
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-800 text-white">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="bg-white/10 backdrop-blur border-white/20 text-blue-200 mb-4 px-4 py-1.5">
              <Award className="w-4 h-4 mr-2 inline-block" /> Đội ngũ chuyên gia
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-white">
              Gặp gỡ Giảng viên của chúng tôi
            </h1>
            <p className="text-lg text-indigo-200 mb-10 max-w-2xl mx-auto">
              Học hỏi từ những chuyên gia hàng đầu trong ngành với nhiều năm
              kinh nghiệm thực chiến và đam mê chia sẻ kiến thức.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-xl mx-auto">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                placeholder="Tìm kiếm giảng viên theo tên hoặc email..."
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
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Tất cả giảng viên
            </h2>
            <p className="text-gray-500 mt-1">
              Tìm thấy{" "}
              <span className="font-bold text-indigo-600">
                {filteredMentors.length}
              </span>{" "}
              chuyên gia
            </p>
          </div>
        </div>

        {filteredMentors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredMentors.map((mentor) => (
              <Card
                key={mentor._id}
                className="group rounded-2xl p-0 overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white"
              >
                <div className="h-24 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
                <CardContent className="p-6 relative text-center pt-0">
                  <Avatar className="w-24 h-24 border-4 border-white shadow-md mx-auto -mt-12 mb-4 bg-white">
                    <AvatarFallback className="text-2xl font-bold bg-indigo-50 text-indigo-600">
                      {getInitials(mentor.name)}
                    </AvatarFallback>
                  </Avatar>

                  <Badge
                    variant="secondary"
                    className="mb-3 bg-blue-50 text-blue-700 hover:bg-blue-100 border-0"
                  >
                    Giảng viên
                  </Badge>

                  <h3 className="font-bold text-xl text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">
                    {mentor.name}
                  </h3>

                  <div className="flex items-center justify-center text-sm text-gray-500 mb-4 gap-1.5">
                    <Mail className="w-3.5 h-3.5" />
                    <span className="truncate max-w-[200px]">
                      {mentor.email}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 py-4 border-t border-gray-50">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-gray-900 font-bold mb-1">
                        <BookOpen className="w-4 h-4 text-indigo-500" />
                        <span>{mentor.courseCount}</span>
                      </div>
                      <span className="text-xs text-gray-500">Khóa học</span>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-gray-900 font-bold mb-1">
                        <Star className="w-4 h-4 text-yellow-400" />
                        {/* <span>4.8</span> */}
                      </div>
                      <span className="text-xs text-gray-500">Đánh giá</span>
                    </div>
                  </div>

                  {/* <Button className="w-full mt-2 bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white transition-colors border-0">
                    Xem hồ sơ
                  </Button> */}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <div className="text-6xl mb-6 opacity-80">👨‍🏫</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              Không tìm thấy giảng viên
            </h3>
            <p className="text-gray-500 max-w-md mx-auto mb-8">
              Không có giảng viên nào khớp với từ khóa "{searchQuery}". Vui lòng
              thử lại với tên hoặc email khác.
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
};

export default MentorAll;
