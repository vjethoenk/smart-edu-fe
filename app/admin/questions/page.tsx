"use client";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  BookOpen,
} from "lucide-react";
import { useState } from "react";
import QuestionModel from "./components/QuestionModel";
import { useGetQuestions, useUpdateQuestion } from "@/features/question/hook";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function AdminQuestions() {
  const [isOpenQuestionModel, setIsOpenQuestionModel] = useState(false);
  const [modelMode, setModelMode] = useState<"create" | "view" | "edit">(
    "create",
  );
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 3;
  const { mutate: browseQuestion } = useUpdateQuestion();

  const handleAddQuestion = () => {
    setModelMode("create");
    setSelectedQuestion(null);
    setIsOpenQuestionModel(true);
  };

  const { data } = useGetQuestions(currentPage - 1);
  const questionItems = data?.data?.data ? [...data.data.data] : [];

  const handleBrowseQuestion = (id: string) => {
    browseQuestion({ id, body: { status: "inReview" } });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-0">
            Hoạt động
          </Badge>
        );
      case "inactive":
        return (
          <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100 border-0">
            Không hoạt động
          </Badge>
        );
      case "inReview":
        return (
          <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-0">
            Đang trình duyệt
          </Badge>
        );
      case "approved":
        return (
          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-0">
            Đã duyệt
          </Badge>
        );
      default:
        return (
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-0">
            Mới
          </Badge>
        );
    }
  };

  return (
    <>
      {!isOpenQuestionModel && (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
          <div className="mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <div className="space-y-6">
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-8 shadow-xl">
                <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -ml-16 -mb-16 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl"></div>

                <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                  <div className="space-y-3">
                    <h1 className="text-4xl font-bold tracking-tight text-white ">
                      Quản lý câu hỏi
                    </h1>

                    <div className="flex items-center gap-4 mt-5">
                      <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 backdrop-blur-sm">
                        <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></div>
                        <p className="text-sm text-slate-300">
                          Tổng số câu hỏi:{" "}
                          <span className="font-semibold text-white">
                            {data?.data?.total || 0}
                          </span>
                        </p>
                      </div>
                      <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 backdrop-blur-sm">
                        <p className="text-sm text-slate-300">
                          Trang hiện tại:{" "}
                          <span className="font-semibold text-white">
                            {currentPage}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button
                    className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-2.5 text-white shadow-lg transition-all hover:shadow-xl hover:shadow-emerald-500/25 hover:scale-105"
                    onClick={handleAddQuestion}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-700 opacity-0 transition-opacity group-hover:opacity-100"></div>
                    <Plus className="relative h-5 w-5 transition-transform group-hover:rotate-90" />
                    <span className="relative font-medium">
                      Thêm câu hỏi mới
                    </span>
                  </Button>
                </div>
              </div>

              {/* Search and Filter Bar */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    placeholder="Tìm kiếm câu hỏi..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-xl bg-white"
                  />
                </div>
                <Button
                  variant="outline"
                  className="gap-2 rounded-xl border-slate-200 hover:border-emerald-500 hover:text-emerald-600"
                >
                  <Filter className="h-4 w-4" />
                  Lọc câu hỏi
                </Button>
              </div>

              {/* Enhanced Table */}
              <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-r from-slate-50 to-white border-b border-slate-200">
                      <TableHead className="w-12 text-center font-semibold text-slate-700">
                        #
                      </TableHead>
                      <TableHead className="font-semibold text-slate-700 min-w-[300px]">
                        Nội dung câu hỏi
                      </TableHead>
                      <TableHead className="font-semibold text-slate-700">
                        Đáp án
                      </TableHead>
                      <TableHead className="font-semibold text-slate-700 text-center">
                        Trạng thái
                      </TableHead>
                      <TableHead className="font-semibold text-slate-700 text-center w-24">
                        Tùy chọn
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {questionItems.length > 0 ? (
                      questionItems.map((item, index) => (
                        <TableRow
                          key={item._id}
                          className="group hover:bg-slate-50/50 transition-colors border-b border-slate-100"
                        >
                          <TableCell className="text-center text-sm text-slate-500 font-medium">
                            {(currentPage - 1) * pageSize + index + 1}
                          </TableCell>
                          <TableCell className="font-medium text-slate-900">
                            <div className="space-y-1">
                              <p className="line-clamp-2">{item.content}</p>
                              <div className="flex items-center gap-2 text-xs text-slate-400">
                                <span>ID: {item._id?.slice(-6)}</span>
                                <span>•</span>
                                <span>
                                  Ngày tạo: {new Date().toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {item.options &&
                              typeof item.options === "object" ? (
                                Object.values(item.options)
                                  .slice(0, 2)
                                  .map((opt: any, idx: number) => (
                                    <Badge
                                      key={idx}
                                      variant="secondary"
                                      className="bg-slate-100 text-slate-700"
                                    >
                                      {opt}
                                    </Badge>
                                  ))
                              ) : (
                                <span className="text-sm text-slate-500">
                                  Chưa có đáp án
                                </span>
                              )}
                              {item.options &&
                                Object.keys(item.options).length > 2 && (
                                  <Badge
                                    variant="secondary"
                                    className="bg-slate-100"
                                  >
                                    +{Object.keys(item.options).length - 2}
                                  </Badge>
                                )}
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            {getStatusBadge(item.status || "active")}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-center">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 hover:text-emerald-600"
                                onClick={() => {
                                  setModelMode("view");
                                  setSelectedQuestion(item);
                                  setIsOpenQuestionModel(true);
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 hover:text-indigo-600"
                                onClick={() => handleBrowseQuestion(item._id!)}
                              >
                                <BookOpen className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 hover:text-blue-600"
                                onClick={() => {
                                  setModelMode("edit");
                                  setSelectedQuestion(item);
                                  setIsOpenQuestionModel(true);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 hover:text-red-600"
                                onClick={() => {
                                  // Add delete action here if needed
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="h-64 text-center">
                          <div className="flex flex-col items-center justify-center gap-3">
                            <div className="rounded-full bg-slate-100 p-4">
                              <Search className="h-8 w-8 text-slate-400" />
                            </div>
                            <p className="text-slate-500">
                              Chưa có câu hỏi nào
                            </p>
                            <Button
                              variant="outline"
                              onClick={handleAddQuestion}
                              className="mt-2 gap-2"
                            >
                              <Plus className="h-4 w-4" />
                              Thêm câu hỏi đầu tiên
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>

                {/* Table Footer với Pagination */}
                {data?.data?.data && data.data.data.length > 0 && (
                  <div className="border-t border-slate-200 bg-slate-50/50 px-6 py-4">
                    <div className="flex items-center justify-between">
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                if (currentPage > 1)
                                  setCurrentPage(currentPage - 1);
                              }}
                              className={
                                currentPage === 1
                                  ? "pointer-events-none opacity-50"
                                  : ""
                              }
                            />
                          </PaginationItem>
                          {Array.from(
                            {
                              length: Math.max(
                                1,
                                Math.ceil((data?.data?.total || 0) / pageSize),
                              ),
                            },
                            (_, index) => index + 1,
                          ).map((page) => (
                            <PaginationItem key={page}>
                              <PaginationLink
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setCurrentPage(page);
                                }}
                                isActive={currentPage === page}
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          ))}
                          <PaginationItem>
                            <PaginationEllipsis />
                          </PaginationItem>
                          <PaginationItem>
                            <PaginationNext
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                if (
                                  currentPage <
                                  Math.ceil((data?.data?.total || 0) / pageSize)
                                ) {
                                  setCurrentPage(currentPage + 1);
                                }
                              }}
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      <QuestionModel
        isOpenQuestionModel={isOpenQuestionModel}
        setIsOpenQuestionModel={setIsOpenQuestionModel}
        mode={modelMode}
        initialData={selectedQuestion}
      />
    </>
  );
}
