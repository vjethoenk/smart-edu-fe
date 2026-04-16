"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Eye,
  X,
  CheckCircle,
  Clock,
  Search,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Calendar,
  FolderOpen,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useGetCourses, useUpdateApprovalCourse } from "@/features/course/hook";
import { useGetCategories } from "@/features/category/hook";
import { useApproveQuestion, useGetQuestions } from "@/features/question/hook";
import { ApprovalStatus } from "@/features/course/enum";
import { useRouter } from "next/navigation";

export default function ApprovalPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"course" | "question">("course");
  const [coursePage, setCoursePage] = useState(1);
  const [questionPage, setQuestionPage] = useState(1);
  const pageSize = 10;
  const { data: courses } = useGetCourses();
  const { data: categories } = useGetCategories();
  const { data: questions } = useGetQuestions(undefined, 1000);
  const { mutate: approval } = useUpdateApprovalCourse();
  const { mutate: approveQuestion } = useApproveQuestion();

  const courseData = courses
    ?.filter((e) => e.status !== ApprovalStatus.PENDING)
    .slice();
  const questionData = questions?.data?.data
    ?.filter((q) => q.status !== ApprovalStatus.PENDING)
    .slice();
  const visibleQuestions = questionData?.slice(
    (questionPage - 1) * pageSize,
    questionPage * pageSize,
  );

  const totalCoursePages = courseData
    ? Math.max(1, Math.ceil(courseData.length / pageSize))
    : 1;
  const visibleCourses = courseData?.slice(
    (coursePage - 1) * pageSize,
    coursePage * pageSize,
  );
  const startCourseRecord =
    courseData && courseData.length > 0 ? (coursePage - 1) * pageSize + 1 : 0;
  const endCourseRecord = courseData
    ? Math.min(coursePage * pageSize, courseData.length)
    : 0;

  const questionTotalPages = Math.max(
    1,
    Math.ceil((questionData?.length || 0) / pageSize),
  );
  const questionRecords = questionData || [];
  const startQuestionRecord =
    questionRecords.length > 0 ? (questionPage - 1) * pageSize + 1 : 0;
  const endQuestionRecord = Math.min(
    questionPage * pageSize,
    questionData?.length || 0,
  );

  useEffect(() => {
    if (coursePage > totalCoursePages) {
      setCoursePage(totalCoursePages);
    }
  }, [coursePage, totalCoursePages]);

  useEffect(() => {
    if (questionPage > questionTotalPages) {
      setQuestionPage(questionTotalPages);
    }
  }, [questionPage, questionTotalPages]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "inReview":
        return <Clock className="h-4 w-4 text-amber-500" />;
      case "approved":
        return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      default:
        return null;
    }
  };

  const statusName = (status: string) => {
    switch (status) {
      case "inReview":
        return <div className="text-yellow-500 font-medium">Chờ duyệt</div>;
      case "approved":
        return <div className="text-green-600 font-medium">Đã duyệt</div>;
      default:
        return null;
    }
  };

  const categoryMap = new Map(
    categories?.map((category) => [category._id, category.name]),
  );

  const handleApproval = (id: string) => {
    approval({ id, status: ApprovalStatus.APPROVED });
  };

  const handleQuestionApproval = (id: string) => {
    approveQuestion({ id, status: ApprovalStatus.APPROVED });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30">
      <div className="mx-auto  space-y-6 p-6">
        {/* Header Section với gradient màu chủ đạo */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 transition-all duration-300 p-6 shadow-xl">
          <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 h-64 w-64 rounded-full bg-purple-400/20 blur-3xl" />

          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
                  Quản lý phê duyệt
                </h1>
                <p className="mt-3 text-white/80">
                  Hệ thống kiểm duyệt nội dung và phê duyệt khóa học
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Card className="border-0 bg-white/20 backdrop-blur-md shadow-lg">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-white">24</p>
                  <p className="text-xs text-white/80">Chờ duyệt</p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-white/20 backdrop-blur-md shadow-lg">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-white">156</p>
                  <p className="text-xs text-white/80">Đã duyệt</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Tabs
            value={activeTab}
            onValueChange={(value) => {
              setActiveTab(value as "course" | "question");
            }}
            className="w-full sm:w-auto"
          >
            <TabsList className="bg-white shadow-sm rounded-xl p-1">
              <TabsTrigger
                value="course"
                className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white"
              >
                <BookOpen className="mr-2 h-4 w-4" />
                Phê duyệt Khóa học
              </TabsTrigger>
              <TabsTrigger
                value="question"
                className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white"
              >
                <FolderOpen className="mr-2 h-4 w-4" />
                Phê duyệt Câu hỏi
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder={
                activeTab === "course"
                  ? "Tìm kiếm khóa học..."
                  : "Tìm kiếm câu hỏi..."
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl bg-white"
            />
          </div>
        </div>

        {/* Main Table Card */}
        <Card className="border-0 shadow-xl rounded-2xl overflow-hidden p-0">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              {activeTab === "course" ? (
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border-b border-indigo-100">
                      <TableHead className="font-semibold text-indigo-900">
                        Thông tin khóa học
                      </TableHead>
                      <TableHead className="font-semibold text-indigo-900">
                        Giảng viên
                      </TableHead>
                      <TableHead className="font-semibold text-indigo-900">
                        Chuyên mục
                      </TableHead>
                      <TableHead className="font-semibold text-indigo-900">
                        Ngày nộp
                      </TableHead>
                      <TableHead className="font-semibold text-indigo-900 text-center">
                        Thống kê
                      </TableHead>
                      <TableHead className="font-semibold text-indigo-900 text-center">
                        Thao tác
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {visibleCourses?.map((item) => (
                      <TableRow
                        key={item._id}
                        className="group hover:bg-gradient-to-r hover:from-indigo-50/50 hover:via-purple-50/50 hover:to-pink-50/50 transition-all duration-300"
                      >
                        <TableCell>
                          <div className="flex gap-3">
                            <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100">
                              <div className="flex h-full items-center justify-center">
                                <BookOpen className="h-6 w-6 text-indigo-600" />
                              </div>
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold text-slate-900 line-clamp-1">
                                {item.title}
                              </p>
                              <div className="mt-1 flex items-center gap-2">
                                <Badge
                                  variant="secondary"
                                  className="bg-indigo-50 text-indigo-600 text-xs"
                                >
                                  {item.sections?.length} chương
                                </Badge>
                                <div className="h-1 w-1 bg-indigo-600 rounded-2xl"></div>
                                <Badge
                                  variant="secondary"
                                  className="bg-indigo-50 text-indigo-600 text-xs"
                                >
                                  {item.sections?.map((e) => e.lessons).length}{" "}
                                  bài học
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8 ring-2 ring-white shadow-sm">
                              <AvatarImage src="" />
                              <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xs font-bold">
                                {item.createBy.email?.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium text-slate-900">
                                {item.createBy.email}
                              </p>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell>
                          <Badge className="border-0 font-medium">
                            {typeof item.categoryId === "object"
                              ? (item.categoryId as any).name
                              : categoryMap.get(item.categoryId as string) ||
                                String(item.categoryId)}
                          </Badge>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-indigo-400" />
                            <div>
                              <p className="text-sm font-medium text-slate-900">
                                {item.createdAt}
                              </p>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center justify-center gap-2">
                            {getStatusIcon(item.status as string)}
                            <Badge
                              variant="outline"
                              className={
                                item.status === ApprovalStatus.APPROVED
                                  ? "bg-green-50 text-green-600 border-green-600"
                                  : "bg-amber-50 text-amber-700 border-amber-200"
                              }
                            >
                              {statusName(item.status as string)}
                            </Badge>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 rounded-lg hover:bg-indigo-50 hover:text-indigo-600"
                              onClick={() => {
                                router.push(`courses/${item._id}`);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {item.status !== ApprovalStatus.APPROVED ? (
                              <>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 w-8 rounded-lg hover:bg-red-50 hover:text-red-600"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => handleApproval(item._id)}
                                  className="gap-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md hover:shadow-lg transition-all hover:from-indigo-600 hover:to-purple-700"
                                >
                                  <CheckCircle className="h-3 w-3" />
                                  Phê duyệt
                                </Button>
                              </>
                            ) : (
                              <></>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border-b border-indigo-100">
                      <TableHead className="font-semibold text-indigo-900">
                        #
                      </TableHead>
                      <TableHead className="font-semibold text-indigo-900">
                        Câu hỏi
                      </TableHead>
                      <TableHead className="font-semibold text-indigo-900">
                        Đáp án
                      </TableHead>
                      <TableHead className="font-semibold text-indigo-900 text-center">
                        Trạng thái
                      </TableHead>
                      <TableHead className="font-semibold text-indigo-900 text-center">
                        Thao tác
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {visibleQuestions?.length ? (
                      visibleQuestions.map((item, index) => (
                        <TableRow
                          key={item._id}
                          className="group hover:bg-gradient-to-r hover:from-indigo-50/50 hover:via-purple-50/50 hover:to-pink-50/50 transition-all duration-300"
                        >
                          <TableCell className="text-sm text-slate-500 font-medium">
                            {(questionPage - 1) * pageSize + index + 1}
                          </TableCell>
                          <TableCell className="font-medium text-slate-900">
                            {item.content}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {item.options?.map((option, idx) => (
                                <Badge
                                  key={idx}
                                  variant="secondary"
                                  className="bg-indigo-50 text-indigo-700"
                                >
                                  {option}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge
                              className={
                                item.status === "approved"
                                  ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                                  : item.status === "inReview"
                                    ? "bg-amber-100 text-amber-700 border-amber-200"
                                    : "bg-slate-100 text-slate-700 border-slate-200"
                              }
                            >
                              {item.status === "approved"
                                ? "Đã duyệt"
                                : item.status === "inReview"
                                  ? "Đang trình duyệt"
                                  : "Mới"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 rounded-lg text-indigo-600"
                              onClick={() => handleQuestionApproval(item._id!)}
                            >
                              Phê duyệt
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          Không có câu hỏi phù hợp.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </div>

            {/* Footer Pagination */}
            <div className="flex flex-col gap-4 border-t border-indigo-100 bg-gradient-to-r from-indigo-50/50 via-purple-50/50 to-pink-50/50 p-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-600">
                Hiển thị{" "}
                <span className="font-medium text-indigo-600">
                  {activeTab === "course"
                    ? `${startCourseRecord}-${endCourseRecord}`
                    : `${startQuestionRecord}-${endQuestionRecord}`}
                </span>{" "}
                trên tổng số{" "}
                <span className="font-medium text-indigo-600">
                  {activeTab === "course"
                    ? courseData?.length || 0
                    : questionData?.length || 0}
                </span>{" "}
                {activeTab === "course" ? "khóa học" : "câu hỏi"}
              </p>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className={`h-8 w-8 rounded-lg border-indigo-200 hover:border-indigo-500 hover:text-indigo-600 ${activeTab === "course" ? (coursePage === 1 ? "opacity-50 pointer-events-none" : "") : questionPage === 1 ? "opacity-50 pointer-events-none" : ""}`}
                  onClick={() =>
                    activeTab === "course"
                      ? coursePage > 1 && setCoursePage(coursePage - 1)
                      : questionPage > 1 && setQuestionPage(questionPage - 1)
                  }
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                {Array.from(
                  {
                    length:
                      activeTab === "course"
                        ? totalCoursePages
                        : questionTotalPages,
                  },
                  (_, index) => index + 1,
                ).map((page) => (
                  <Button
                    key={page}
                    variant={
                      page ===
                      (activeTab === "course" ? coursePage : questionPage)
                        ? "default"
                        : "outline"
                    }
                    size="icon"
                    className={`h-8 w-8 rounded-lg ${
                      page ===
                      (activeTab === "course" ? coursePage : questionPage)
                        ? "bg-indigo-500 text-white hover:bg-indigo-600"
                        : "border-indigo-200 hover:border-indigo-500 hover:text-indigo-600"
                    }`}
                    onClick={() =>
                      activeTab === "course"
                        ? setCoursePage(page)
                        : setQuestionPage(page)
                    }
                  >
                    {page}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="icon"
                  className={`h-8 w-8 rounded-lg border-indigo-200 hover:border-indigo-500 hover:text-indigo-600 ${activeTab === "course" ? (coursePage === totalCoursePages ? "opacity-50 pointer-events-none" : "") : questionPage === questionTotalPages ? "opacity-50 pointer-events-none" : ""}`}
                  onClick={() =>
                    activeTab === "course"
                      ? coursePage < totalCoursePages &&
                        setCoursePage(coursePage + 1)
                      : questionPage < questionTotalPages &&
                        setQuestionPage(questionPage + 1)
                  }
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
