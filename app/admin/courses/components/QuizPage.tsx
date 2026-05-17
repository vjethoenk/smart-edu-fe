"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Trash2,
  Clock,
  Trophy,
  Star,
  FileText,
  Settings,
  HelpCircle,
  MoveUp,
  MoveDown,
  Check,
  Search,
  FileUp,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useGetQuestions, useImportQuestions } from "@/features/question/hook";
import { toast } from "sonner";
import { ApprovalStatus, EActiveView } from "@/features/course/enum";
import {
  useCreateQuiz,
  useUpdateQuiz,
  useGetQuizById,
} from "@/features/quiz/hook";
import { useCourseStore } from "@/features/course/store";
import { useCreateLesson } from "@/features/lesson/hook";

const QUESTIONS_PER_PAGE = 10;

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN");
};

interface QuizPageProps {
  quizId?: string;
  sectionId?: string;
  type: string;
  lessonId?: string;
}

export default function QuizPage({
  quizId,
  sectionId,
  lessonId,
  type,
}: QuizPageProps) {
  const { data: questionList } = useGetQuestions(undefined, 1000);
  const availableQuestions = questionList?.data.data;
  const { courseId } = useCourseStore();
  const { data: quizData } = useGetQuizById(quizId || "");
  const quizDetails = quizData?.data;
  const { mutate: createLesson } = useCreateLesson();
  const setActiveView = useCourseStore((state) => state.setActiveView);

  const [quizInfo, setQuizInfo] = useState({
    title: "Bài quiz",
    description: "Tạo 1 mô tả cho bài",
  });

  const { mutateAsync: createQuizAsync, isPending: isCreating } =
    useCreateQuiz();
  const { mutate: updateQuiz, isPending: isUpdating } = useUpdateQuiz();
  const { mutateAsync: importQuestions, isPending: isImporting } =
    useImportQuestions();

  const [questions, setQuestions] = useState<any[]>([]);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [settings, setSettings] = useState({
    limitTime: 0,
    passScore: 0,
    totalScore: 0,
    shuffleQuestions: false,
    showResult: true,
  });

  const handleImportWord = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    if (fileExtension !== "docx" && fileExtension !== "doc") {
      toast.error("Vui lòng tải lên file Word (.docx hoặc .doc)");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await importQuestions(formData);
      if (res?.data && Array.isArray(res.data.data)) {
        const importedList = res.data.data;
        if (importedList.length === 0) {
          toast.warning("Không tìm thấy câu hỏi nào trong file Word!");
          return;
        }

        // Avoid duplicate questions by ID
        const currentIds = new Set(questions.map((q) => q._id));
        const filteredNewQuestions = importedList.filter(
          (q: any) => !currentIds.has(q._id),
        );

        if (filteredNewQuestions.length === 0) {
          toast.info("Tất cả câu hỏi trong file đã tồn tại trong bài quiz!");
          return;
        }

        const formattedQuestions = filteredNewQuestions.map(
          (q: any, idx: number) => ({
            ...q,
            order: questions.length + idx + 1,
          }),
        );

        setQuestions((prev) => [...prev, ...formattedQuestions]);
        toast.success(
          `Import thành công ${formattedQuestions.length} câu hỏi vào bài quiz!`,
        );
      } else {
        toast.error("Không thể đọc dữ liệu câu hỏi từ phản hồi của máy chủ");
      }
    } catch (error) {
      // error is handled by mutation onError
    } finally {
      // Reset input value to allow uploading the same file again if needed
      e.target.value = "";
    }
  };

  // Load quiz data when editing
  useEffect(() => {
    if (quizDetails) {
      setQuizInfo({
        title: quizDetails.title,
        description: quizDetails.description,
      });
      setQuestions(quizDetails.questions || []);
      setSettings({
        limitTime: quizDetails.limitTime || 0,
        passScore: quizDetails.passScore || 0,
        totalScore: quizDetails.totalScore || 0,
        shuffleQuestions: quizDetails.shuffleQuestions || false,
        showResult: quizDetails.showResult !== false,
      });
    }
  }, [quizDetails]);

  const filteredQuestions = availableQuestions?.filter(
    (q) =>
      q.status === ApprovalStatus.APPROVED &&
      q.content.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Calculate pagination for questions dialog
  const totalPages = Math.ceil(
    (filteredQuestions?.length || 0) / QUESTIONS_PER_PAGE,
  );
  const startIndex = (currentPage - 1) * QUESTIONS_PER_PAGE;
  const paginatedQuestions = filteredQuestions?.slice(
    startIndex,
    startIndex + QUESTIONS_PER_PAGE,
  );

  const handleAddQuestion = (question: any) => {
    if (!questions.find((q) => q._id === question._id)) {
      setQuestions([
        ...questions,
        { ...question, order: questions.length + 1 },
      ]);
    }
  };

  const handleRemoveQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q._id !== id));
  };

  const handleMoveUp = (index: number) => {
    if (index > 0) {
      const newQuestions = [...questions];
      [newQuestions[index], newQuestions[index - 1]] = [
        newQuestions[index - 1],
        newQuestions[index],
      ];
      setQuestions(newQuestions);
    }
  };

  const handleMoveDown = (index: number) => {
    if (index < questions.length - 1) {
      const newQuestions = [...questions];
      [newQuestions[index], newQuestions[index + 1]] = [
        newQuestions[index + 1],
        newQuestions[index],
      ];
      setQuestions(newQuestions);
    }
  };

  const handleAddQuiz = async () => {
    if (!quizInfo.title.trim()) {
      alert("Vui lòng nhập tên bài quiz");
      return;
    }

    const quizPayload = {
      title: quizInfo.title,
      description: quizInfo.description,
      courseId: courseId || "",
      sectionId: sectionId || "",
      questions: questions.map((q) => ({
        content: q.content,
        options: q.options,
        correctAnswer: q.correctAnswer,
        _id: q._id,
      })),
      limitTime: settings.limitTime,
      passScore: settings.passScore,
      totalScore: settings.totalScore,
      shuffleQuestions: settings.shuffleQuestions,
      showResult: settings.showResult,
    };

    if (quizId) {
      updateQuiz({ id: quizId, data: quizPayload });
      return;
    }

    try {
      const response = await createQuizAsync(quizPayload);
      const createdQuizId = response?.data?._id;
      if (createdQuizId && sectionId) {
        createLesson({
          title: quizInfo.title,
          content: quizInfo.description,
          type,
          sectionId,
          courseId: courseId || "",
          quizId: createdQuizId,
        });
        setActiveView(EActiveView.NONE);
      }
    } catch (error) {
      // error handled by hook toast
    }
  };

  const totalScore = questions.reduce((sum, q) => sum + q.score, 0);

  return (
    <div className="min-h-screen ">
      <div className="mx-auto space-y-6 p-4">
        {/* Header với màu trầm */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-700 via-slate-800 to-slate-900 p-6 shadow-xl">
          <div className="relative flex items-center justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-white">
                Chi tiết bài Quiz
              </h1>
              <p className="text-slate-300">
                Quản lý nội dung và cấu hình bài kiểm tra
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleAddQuiz}
                disabled={isCreating || isUpdating}
                className="bg-slate-600 text-white hover:bg-slate-700"
              >
                {isCreating || isUpdating ? "Đang lưu..." : "Lưu bài quiz"}
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs - nằm ở trên cùng, không phải bên trái */}
        <Tabs defaultValue="content" className="w-full flex flex-col">
          <div className="flex justify-center items-center flex-row">
            <TabsList className="bg-slate-200/50 rounded-xl p-1 w-full max-w-md">
              <TabsTrigger
                value="content"
                className="flex-1 rounded-lg data-[state=active]:bg-slate-700 data-[state=active]:text-white"
              >
                <FileText className="mr-2 h-4 w-4" />
                Nội dung
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="flex-1 rounded-lg data-[state=active]:bg-slate-700 data-[state=active]:text-white"
              >
                <Settings className="mr-2 h-4 w-4" />
                Cài đặt
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tab Nội dung */}
          <TabsContent value="content" className="mt-6 space-y-6">
            {/* Thông tin cơ bản */}
            <Card className="border-0 shadow-md rounded-2xl bg-white">
              <CardContent className="space-y-4 p-6">
                <div className="space-y-2">
                  <Label className="text-base font-semibold text-slate-700">
                    Tên bài quiz <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={quizInfo.title}
                    onChange={(e) =>
                      setQuizInfo({ ...quizInfo, title: e.target.value })
                    }
                    placeholder="Nhập tên bài quiz"
                    className="border-slate-200 focus:border-slate-500 focus:ring-slate-500 rounded-xl bg-slate-50"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-base font-semibold text-slate-700">
                    Mô tả
                  </Label>
                  <Textarea
                    value={quizInfo.description}
                    onChange={(e) =>
                      setQuizInfo({ ...quizInfo, description: e.target.value })
                    }
                    placeholder="Nhập mô tả cho bài quiz"
                    rows={3}
                    className="border-slate-200 focus:border-slate-500 focus:ring-slate-500 rounded-xl bg-slate-50"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Danh sách câu hỏi */}
            <Card className="border-0 shadow-md rounded-2xl bg-white">
              <CardContent className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800">
                      Danh sách câu hỏi
                    </h3>
                    <p className="text-sm text-slate-500">
                      {questions.length} câu hỏi • Tổng điểm: {totalScore}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      disabled={isImporting}
                      onClick={() =>
                        document.getElementById("word-import-input")?.click()
                      }
                      className="gap-2 border-slate-200 text-slate-700 shadow-sm hover:bg-slate-100 hover:text-slate-900"
                    >
                      {isImporting ? (
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-500 border-t-transparent" />
                      ) : (
                        <FileUp className="h-4 w-4 text-slate-500" />
                      )}
                      {isImporting ? "Đang import..." : "Import từ Word"}
                    </Button>
                    <input
                      id="word-import-input"
                      type="file"
                      accept=".docx,.doc"
                      className="hidden"
                      onChange={handleImportWord}
                    />

                    <Button
                      onClick={() => setIsOpenModal(true)}
                      className="gap-2 bg-slate-700 text-white shadow-md hover:bg-slate-800"
                    >
                      <Plus className="h-4 w-4" />
                      Thêm câu hỏi
                    </Button>
                  </div>
                </div>

                {questions.length > 0 ? (
                  <div className="space-y-3">
                    {questions.map((question, index) => (
                      <div
                        key={question._id}
                        className="group rounded-xl border border-slate-200 bg-slate-50/30 p-4 transition-all hover:shadow-md"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex flex-col items-center gap-1">
                            <span className="text-sm font-semibold text-slate-500">
                              #{index + 1}
                            </span>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 rounded-lg hover:bg-slate-200"
                                onClick={() => handleMoveUp(index)}
                                disabled={index === 0}
                              >
                                <MoveUp className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 rounded-lg hover:bg-slate-200"
                                onClick={() => handleMoveDown(index)}
                                disabled={index === questions.length - 1}
                              >
                                <MoveDown className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <Badge className="bg-slate-600 text-white">
                                Trắc nghiệm
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                {question.score} điểm
                              </Badge>
                            </div>
                            <p className="mt-2 font-medium text-slate-800">
                              {question.content}
                            </p>
                            <div className="mt-2 space-y-1">
                              {question.options.map(
                                (option: string, idx: number) => (
                                  <div
                                    key={idx}
                                    className="flex items-center gap-2 text-sm"
                                  >
                                    <div
                                      className={`h-3 w-3 rounded-full ${option === question.correctAnswer
                                        ? "bg-emerald-600"
                                        : "bg-slate-400"
                                        }`}
                                    />
                                    <span
                                      className={
                                        option === question.correctAnswer
                                          ? "font-medium text-emerald-700"
                                          : "text-slate-600"
                                      }
                                    >
                                      {option}
                                    </span>
                                    {option === question.correctAnswer && (
                                      <Badge className="ml-2 bg-emerald-100 text-emerald-700 text-[10px]">
                                        Đáp án đúng
                                      </Badge>
                                    )}
                                  </div>
                                ),
                              )}
                            </div>
                          </div>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-lg hover:bg-red-100 hover:text-red-600"
                            onClick={() => handleRemoveQuestion(question._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-12">
                    <HelpCircle className="mb-3 h-12 w-12 text-slate-400" />
                    <p className="text-slate-500">Chưa có câu hỏi nào</p>
                    <div className="mt-3 flex gap-2">
                      <Button
                        variant="outline"
                        disabled={isImporting}
                        onClick={() =>
                          document
                            .getElementById("word-import-input-empty")
                            ?.click()
                        }
                        className="gap-2 border-slate-300 bg-white text-slate-700 shadow-sm hover:bg-slate-100 hover:text-slate-900"
                      >
                        {isImporting ? (
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-500 border-t-transparent" />
                        ) : (
                          <FileUp className="h-4 w-4 text-slate-500" />
                        )}
                        {isImporting ? "Đang import..." : "Import từ Word"}
                      </Button>
                      <input
                        id="word-import-input-empty"
                        type="file"
                        accept=".docx,.doc"
                        className="hidden"
                        onChange={handleImportWord}
                      />

                      <Button
                        onClick={() => setIsOpenModal(true)}
                        className="gap-2 bg-slate-700 text-white shadow-md hover:bg-slate-800 border-0"
                      >
                        <Plus className="h-4 w-4" />
                        Thêm câu hỏi đầu tiên
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Cài đặt */}
          <TabsContent value="settings" className="mt-6 space-y-6">
            <Card className="border-0 shadow-md rounded-2xl bg-white">
              <CardContent className="space-y-6 p-6">
                <div className="space-y-2">
                  <Label className="text-base font-semibold text-slate-700 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-slate-500" />
                    Thời gian làm bài (phút)
                  </Label>
                  <Input
                    type="number"
                    value={settings.limitTime}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        limitTime: parseInt(e.target.value),
                      })
                    }
                    className="max-w-[200px] border-slate-200 focus:border-slate-500 focus:ring-slate-500 rounded-xl bg-slate-50"
                  />
                  <p className="text-xs text-slate-500">
                    Để trống hoặc nhập 0 nếu không giới hạn thời gian
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-base font-semibold text-slate-700 flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-slate-500" />
                    Điểm qua bài
                  </Label>
                  <div className="flex items-center gap-4">
                    <Input
                      type="number"
                      value={settings.passScore}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          passScore: parseInt(e.target.value),
                        })
                      }
                      className="max-w-[200px] border-slate-200 focus:border-slate-500 focus:ring-slate-500 rounded-xl bg-slate-50"
                    />
                  </div>
                  <p className="text-xs text-slate-500">
                    Học viên cần đạt tối thiểu {settings.passScore} để vượt qua
                    bài kiểm tra
                  </p>
                </div>

                <div className="space-y-2 border-b pb-4 border-slate-200">
                  <Label className="text-base font-semibold text-slate-700 flex items-center gap-2">
                    <Star className="h-4 w-4 text-slate-500" />
                    Tổng điểm
                  </Label>
                  <div className="flex items-center gap-4">
                    <Input
                      type="number"
                      value={settings.totalScore}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          totalScore: parseInt(e.target.value),
                        })
                      }
                      className="max-w-[200px] border-slate-200 focus:border-slate-500 focus:ring-slate-500 rounded-xl bg-slate-50"
                    />
                  </div>
                  <p className="text-xs text-slate-500">
                    Tổng điểm tối đa của bài quiz (hiện tại: {totalScore} điểm
                    từ các câu hỏi)
                  </p>
                </div>

                <div className="rounded-xl bg-slate-100 p-4">
                  <h4 className="mb-2 font-semibold text-slate-800">
                    Tóm tắt cấu hình
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-slate-600">Thời gian:</span>
                      <span className="ml-2 font-medium text-slate-800">
                        {settings.limitTime > 0
                          ? `${settings.limitTime} phút`
                          : "Không giới hạn"}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-600">Điểm qua bài:</span>
                      <span className="ml-2 font-medium text-slate-800">
                        {settings.passScore}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-600">Tổng điểm:</span>
                      <span className="ml-2 font-medium text-slate-800">
                        {settings.totalScore}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-600">Số câu hỏi:</span>
                      <span className="ml-2 font-medium text-slate-800">
                        {questions.length}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={isOpenModal} onOpenChange={setIsOpenModal}>
        <DialogContent className="max-w-3xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-slate-800">
              Thêm câu hỏi vào bài quiz
            </DialogTitle>
          </DialogHeader>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Tìm kiếm câu hỏi..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10 border-slate-200 focus:border-slate-500 focus:ring-slate-500 rounded-xl bg-slate-50"
            />
          </div>

          <div className="max-h-[400px] space-y-3 overflow-y-auto">
            {paginatedQuestions?.map((question) => {
              const isAdded = questions.some((q) => q._id === question._id);
              return (
                <div
                  key={question._id}
                  className={`rounded-xl border p-4 transition-all ${isAdded
                    ? "border-emerald-200 bg-emerald-50/30"
                    : "border-slate-200 bg-white hover:shadow-md"
                    }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-slate-600 text-white">
                          Trắc nghiệm
                        </Badge>
                        <Badge variant="secondary">{question.score} điểm</Badge>
                        <Badge
                          className={
                            question.status === "approved"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-amber-100 text-amber-700"
                          }
                        >
                          {question.status === "approved"
                            ? "Đã duyệt"
                            : "Chờ duyệt"}
                        </Badge>
                      </div>
                      <p className="mt-2 font-medium text-slate-800">
                        {question.content}
                      </p>
                      <div className="mt-2 space-y-1">
                        {question.options.map((option: string, idx: number) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2 text-sm"
                          >
                            <div
                              className={`h-2 w-2 rounded-full ${option === question.correctAnswer
                                ? "bg-emerald-600"
                                : "bg-slate-400"
                                }`}
                            />
                            <span className="text-slate-600">{option}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-2 text-xs text-slate-400">
                        Ngày tạo: {formatDate(question?.createdAt as string)}
                      </div>
                    </div>
                    {isAdded ? (
                      <Badge className="ml-3 bg-emerald-100 text-emerald-700 border-0">
                        <Check className="mr-1 h-3 w-3" />
                        Đã thêm
                      </Badge>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => handleAddQuestion(question)}
                        className="ml-3 gap-1 bg-slate-700 text-white hover:bg-slate-800"
                      >
                        <Plus className="h-3 w-3" />
                        Thêm
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}

            {paginatedQuestions?.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12">
                <HelpCircle className="h-12 w-12 text-slate-400" />
                <p className="mt-2 text-slate-500">
                  Không tìm thấy câu hỏi nào
                </p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center border-t pt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => setCurrentPage(page)}
                          isActive={page === currentPage}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ),
                  )}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpenModal(false)}>
              Đóng
            </Button>
            <Button
              className="bg-slate-700 text-white hover:bg-slate-800"
              onClick={() => setIsOpenModal(false)}
            >
              Xác nhận ({questions.length} câu hỏi)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
