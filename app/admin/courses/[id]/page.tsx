"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { BookOpen, FileText, GripVertical, Video } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { useCreateSection, useGetSections } from "@/features/section/hook";
import VideoModal from "../components/VideoModal";
import { useCourseStore } from "@/features/course/store";
import { EActiveView } from "@/features/course/enum";
import { useGetLessons } from "@/features/lesson/hook";
import { useGetByIdCourse, useGetCourses } from "@/features/course/hook";

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
    id: "doc",
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
];

const CourseDetailPage = () => {
  const { id } = useParams();
  const courseId = id as string;

  const { activeView, setActiveView, setCourseId } = useCourseStore();
  const [selectedType, setSelectedType] = useState("");
  const [selectedSectionId, setSelectedSectionId] = useState("");
  const [lessonId, setLessonId] = useState("");

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
          doc: "Document Modal",
          question: "Question Modal",
        };
        return <div>{modalLabels[selectedType] || null}</div>;

      case "view_lesson":
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

      <div className="w-full bg-[#f3f3f3] border-[#b9b9c0] border-l-2 p-6 min-h-[90vh]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Nội dung</h2>
          <button
            className="border-none text-[#4D44E3] text-sm cursor-pointer font-medium hover:text-[#3F3DC9] transition-all"
            onClick={toggleSectionInput}
          >
            + Thêm chương học
          </button>
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
                        }}
                      >
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <GripVertical className="w-3 h-3 opacity-50" />
                          <span>{l.title}</span>
                        </div>
                      </div>
                    ))}

                    <Button
                      variant="ghost"
                      className="w-full justify-center text-xs text-gray-500 border border-gray-300 border-dashed cursor-pointer hover:bg-gray-100"
                      onClick={() => {
                        setSelectedSectionId(s._id as string);
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
    </div>
  );
};

export default CourseDetailPage;
