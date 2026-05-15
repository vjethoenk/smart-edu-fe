"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  BookOpen,
  FileText,
  GripVertical,
  Settings,
  Video,
  BarChart,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { useCreateSection } from "@/features/section/hook";
import VideoModal from "@/app/admin/courses/components/VideoModal";
import { useCourseStore } from "@/features/course/store";
import { EActiveView } from "@/features/course/enum";
import { useGetByIdCourse } from "@/features/course/hook";
import CourseMonitoring from "./components/CourseMonitoring";
import QuizPage from "@/app/admin/courses/components/QuizPage";
import PdfModal from "@/app/admin/courses/components/PdfModel";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useUpdateLesson } from "@/features/lesson/hook";

const LESSON_TYPES = [
  {
    id: "video",
    label: "Video",
    icon: Video,
    color: "text-blue-500",
    hoverBorder: "hover:border-blue-500",
    hoverBg: "hover:bg-blue-50",
  },
  {
    id: "pdf",
    label: "Tài liệu",
    icon: FileText,
    color: "text-green-500",
    hoverBorder: "hover:border-green-500",
    hoverBg: "hover:bg-green-50",
  },
  {
    id: "question",
    label: "Bài tập",
    icon: BookOpen,
    color: "text-purple-500",
    hoverBorder: "hover:border-purple-500",
    hoverBg: "hover:bg-purple-50",
  },
  {
    id: "quiz",
    label: "Quiz",
    icon: BookOpen,
    color: "text-orange-500",
    hoverBorder: "hover:border-orange-500",
    hoverBg: "hover:bg-orange-50",
  },
];

const CourseDetailPage = () => {
  const { id } = useParams();
  const courseId = id as string;

  const { activeView, setActiveView, setCourseId } = useCourseStore();
  const [selectedType, setSelectedType] = useState("");
  const [selectedSectionId, setSelectedSectionId] = useState("");
  const [lessonId, setLessonId] = useState("");
  const [selectedQuizId, setSelectedQuizId] = useState("");
  const [isMonitoringModalOpen, setIsMonitoringModalOpen] = useState(false);

  const { mutate: createSection } = useCreateSection();
  const { data: coursesDetail } = useGetByIdCourse(courseId);

  useEffect(() => {
    setCourseId(courseId);
    return () => setCourseId(null);
  }, [courseId, setCourseId]);

  const handleCreateSection = (title: string) => {
    if (!title.trim()) return;
    createSection({ title, courseId });
    setActiveView(EActiveView.NONE);
  };

  const handleSelectLessonType = (type: string) => {
    setSelectedType(type);
    setActiveView(EActiveView.MODAL);
  };

  const toggleSectionInput = () => {
    setActiveView(
      activeView === EActiveView.SECTION_INPUT
        ? EActiveView.NONE
        : EActiveView.SECTION_INPUT,
    );
  };

  const openLessonTypeSelector = () => {
    setActiveView(EActiveView.LESSON_TYPE_SELECTOR);
  };

  const openViewLesson = () => {
    setActiveView(EActiveView.VIEW_LESSON);
  };

  const [selectedLesson, setSelectedLesson] = useState<any>(null);
  const [completionTime, setCompletionTime] = useState<string>("");
  const [completionPercentage, setCompletionPercentage] = useState<string>("");
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const { mutate: updateLesson } = useUpdateLesson();

  const handleSaveCompletionSettings = () => {
    const payload = {
      completionConditions: {
        duration: completionTime ? parseInt(completionTime) : undefined,
      },
    };
    updateLesson({
      id: selectedLesson._id,
      data: payload,
    });
    setIsSettingsModalOpen(false);
  };

  const handleOpenSettings = (
    e: React.MouseEvent,
    lesson: any,
    sectionId: string,
  ) => {
    e.stopPropagation();
    setSelectedLesson(lesson);
    setSelectedSectionId(sectionId);
    setCompletionTime(lesson.completionTime?.toString() || "");
    setCompletionPercentage(lesson.completionPercentage?.toString() || "");
    setIsSettingsModalOpen(true);
  };

  const renderLeftContent = () => {
    switch (activeView) {
      case "section_input":
        return (
          <Input
            autoFocus
            className="w-full border border-gray-300"
            placeholder="Nhập tên chương học"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleCreateSection(e.currentTarget.value);
                e.currentTarget.value = "";
              }
            }}
          />
        );

      case "lesson_type_selector":
        return (
          <div className="grid grid-cols-3 gap-4">
            {LESSON_TYPES.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSelectLessonType(item.id)}
                className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-gray-200 p-6 transition-all hover:shadow-md ${item.hoverBorder} ${item.hoverBg}`}
              >
                <item.icon className={`h-8 w-8 ${item.color}`} />
                <span className="text-sm font-medium text-gray-700">
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        );

      case "modal":
        const modalLabels: Record<string, React.ReactNode> = {
          video: (
            <VideoModal sectionId={selectedSectionId} type={selectedType} />
          ),
          pdf: <PdfModal sectionId={selectedSectionId} type={selectedType} />,
          question: (
            <QuizPage
              lessonId={lessonId}
              type={selectedType}
              sectionId={selectedSectionId}
            />
          ),
          quiz: (
            <QuizPage
              quizId={selectedQuizId}
              type={selectedType}
              sectionId={selectedSectionId}
            />
          ),
        };
        return <div>{modalLabels[selectedType] || null}</div>;

      case "view_lesson":
        if (selectedType === "quiz") {
          return (
            <QuizPage
              quizId={selectedQuizId}
              sectionId={selectedSectionId}
              type={selectedType}
            />
          );
        }
        return (
          <VideoModal
            lessonId={lessonId}
            type={selectedType}
            sectionId={selectedSectionId}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6 p-6">
        <div>{renderLeftContent()}</div>
      </div>

      <div className="w-full bg-[#f3f3f3] border-[#b9b9c0] border-l-2 p-6 min-h-[90vh] flex flex-col justify-between">
        <div className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Nội dung</h2>
            <div className="flex gap-2">
              <button
                className="border-none text-[#4D44E3] text-sm cursor-pointer font-medium hover:text-[#3F3DC9] transition-all"
                onClick={toggleSectionInput}
              >
                + Thêm chương học
              </button>
            </div>
          </div>

          <Accordion type="single" collapsible className="space-y-3">
            {coursesDetail?.sections?.map((s, index) => (
              <AccordionItem value={`section-${index + 1}`} key={s._id}>
                <Card className="rounded-xl shadow-sm bg-[#ffffff]">
                  <AccordionTrigger className="px-3 py-1 hover:no-underline">
                    <div className="flex items-center gap-2 font-semibold text-gray-700">
                      <GripVertical className="w-4 h-4 opacity-50" />
                      <span>{s.title}</span>
                    </div>
                  </AccordionTrigger>

                  <AccordionContent className="px-3 pb-3 h-auto">
                    <div className="space-y-2">
                      {s.lessons?.map((l) => (
                        <div
                          className="flex border border-gray-300 items-center justify-between p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
                          key={l._id}
                          onClick={() => {
                            openViewLesson();
                            setLessonId(l._id as string);
                            setSelectedSectionId(s._id as string);
                            setSelectedType(l.type || "video");
                            setSelectedQuizId(l.quizId || "");
                          }}
                        >
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <GripVertical className="w-3 h-3 opacity-50" />
                            <span>{l.title}</span>
                          </div>

                          <button
                            onClick={(e) =>
                              handleOpenSettings(e, l, s._id as string)
                            }
                            className="p-1 rounded hover:bg-gray-200 transition-colors"
                          >
                            <Settings className="w-4 h-4 text-gray-500" />
                          </button>
                        </div>
                      ))}

                      <Button
                        variant="ghost"
                        className="w-full justify-center text-xs text-gray-500 border border-gray-300 border-dashed cursor-pointer hover:bg-gray-100"
                        onClick={() => {
                          setSelectedSectionId(s._id as string);
                          setSelectedQuizId("");
                          openLessonTypeSelector();
                        }}
                      >
                        + ADD LESSON
                      </Button>
                    </div>
                  </AccordionContent>
                </Card>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Stats Card at bottom */}
        <Card
          className="bg-gradient-to-r from-[#4D44E3] to-[#6B5EE8] text-white p-4 cursor-pointer hover:shadow-lg transition-all mt-6"
          onClick={() => setIsMonitoringModalOpen(true)}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xl font-bold mt-1">Thống kê chi tiết</p>
            </div>
            <div className="bg-white/20 p-3 rounded-full">
              <BarChart className="w-6 h-6" />
            </div>
          </div>
        </Card>
      </div>

      <Dialog open={isSettingsModalOpen} onOpenChange={setIsSettingsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cài đặt tỷ lệ hoàn thành bài học</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Tên bài học:
                <span className="ml-2 text-gray-900 font-semibold">
                  {selectedLesson?.title}
                </span>
              </label>
            </div>

            {selectedType === "quiz" ? (
              <div className="space-y-2">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-gray-700 mb-2">
                    Quiz sẽ được đánh dấu hoàn thành khi học viên:
                  </p>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    <li>Submit bài làm thành công</li>
                    <li>Đạt được điểm số yêu cầu (nếu có)</li>
                  </ul>
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Thời gian học (giây)
                  </label>
                  <Input
                    type="number"
                    placeholder="Nhập thời gian cần học (giây)"
                    value={completionTime}
                    onChange={(e) => setCompletionTime(e.target.value)}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500">
                    Học viên cần học ít nhất thời gian này để được tính hoàn
                    thành
                  </p>
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsSettingsModalOpen(false)}
            >
              Hủy
            </Button>
            <Button onClick={handleSaveCompletionSettings}>Lưu cài đặt</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* CourseMonitoring Modal */}
      <Dialog
        open={isMonitoringModalOpen}
        onOpenChange={setIsMonitoringModalOpen}
      >
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle></DialogTitle>
          </DialogHeader>
          <CourseMonitoring courseId={courseId} />
          <DialogFooter>
            <Button onClick={() => setIsMonitoringModalOpen(false)}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CourseDetailPage;
