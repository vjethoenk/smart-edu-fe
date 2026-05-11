// CourseDetailSidebar.tsx
"use client";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  ChevronRight,
  Play,
  CheckCircle2,
  Circle,
  X,
} from "lucide-react";
import { ISection, ILesson } from "@/types/api";
import { getLessonTypeIcon } from "./LessonTypeIcon";

const getLessonTypeLabel = (type?: string) => {
  switch (type?.toLowerCase()) {
    case "video":
      return "Video";
    case "pdf":
      return "PDF";
    case "quiz":
      return "Quiz";
    default:
      return "Khác";
  }
};

export default function CourseDetailSidebar({
  sections,
  activeSectionId,
  activeLessonId,
  onSelectLesson,
  onClose,
}: {
  sections: ISection[];
  activeSectionId: string;
  activeLessonId: string;
  onSelectLesson: (sectionId: string, lessonId: string) => void;
  onClose?: () => void;
}) {
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);

  useEffect(() => {
    setExpandedSections(sections.map((section) => section._id || ""));
  }, [sections]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections((current) =>
      current.includes(sectionId)
        ? current.filter((id) => id !== sectionId)
        : [...current, sectionId],
    );
  };

  const isLessonCompleted = (lessonId: string) =>
    completedLessons.includes(lessonId);

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-white to-slate-50/50">
      <div className="p-6 bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-10">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 bg-gradient-to-b from-indigo-600 to-purple-600 rounded-full"></div>
            <h2 className="text-slate-900 font-bold text-xl">
              Nội dung khóa học
            </h2>
          </div>
          {onClose && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full hover:bg-slate-100 transition-colors duration-200"
            >
              <X className="w-5 h-5" />
            </Button>
          )}
        </div>
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-slate-500">{sections.length} chương</span>
          <span className="text-indigo-600 font-medium">
            {sections.reduce(
              (sum, section) => sum + (section.lessons?.length || 0),
              0,
            )}{" "}
            bài học
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4">
        {sections.map((section, idx) => {
          const lessonCount = section.lessons?.length || 0;
          const isOpen = expandedSections.includes(section._id || "");
          const completedCount =
            section.lessons?.filter((l) => isLessonCompleted(l._id || ""))
              .length || 0;

          return (
            <div
              key={section._id}
              className="group rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
            >
              <button
                type="button"
                className={`w-full px-5 py-4 text-left transition-all duration-300 ${
                  isOpen
                    ? "bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-indigo-100"
                    : "bg-white hover:bg-slate-50"
                }`}
                onClick={() => toggleSection(section._id || "")}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-slate-800">
                        Chương {idx + 1}: {section.title}
                      </span>
                      <Badge
                        variant="secondary"
                        className="bg-slate-100 text-slate-600 text-xs"
                      >
                        {lessonCount} bài
                      </Badge>
                      {completedCount === lessonCount && lessonCount > 0 && (
                        <Badge className="bg-green-100 text-green-700 border-0 text-xs">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Hoàn thành
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span>
                        {completedCount}/{lessonCount} bài đã học
                      </span>
                      {lessonCount > 0 && (
                        <div className="w-16 h-1 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full transition-all duration-300"
                            style={{
                              width: `${(completedCount / lessonCount) * 100}%`,
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    {isOpen ? (
                      <ChevronDown className="w-4 h-4 text-indigo-600" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                    )}
                  </div>
                </div>
              </button>

              {isOpen && (
                <div className="space-y-1 px-3 py-3 bg-slate-50/30">
                  {section.lessons?.map((lesson, lessonIdx) => {
                    const isSelected = lesson._id === activeLessonId;
                    const isCompleted = isLessonCompleted(lesson._id || "");
                    const Icon = getLessonTypeIcon(lesson.type);

                    return (
                      <button
                        type="button"
                        key={lesson._id}
                        className={`w-full rounded-lg px-4 py-3 text-left transition-all duration-200 group/lesson ${
                          isSelected
                            ? "bg-gradient-to-r from-indigo-100 to-purple-100 ring-1 ring-indigo-300 shadow-sm"
                            : "hover:bg-slate-100"
                        }`}
                        onClick={() =>
                          onSelectLesson(section._id || "", lesson._id || "")
                        }
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div
                              className={`flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-200 ${
                                isSelected
                                  ? "bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-md"
                                  : "bg-slate-100 text-slate-600 group-hover/lesson:bg-indigo-100"
                              }`}
                            >
                              {isCompleted ? (
                                <CheckCircle2 className="w-4 h-4" />
                              ) : (
                                <Icon className="w-4 h-4" />
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-slate-400 font-mono">
                                  Bài {lessonIdx + 1}
                                </span>
                                {isCompleted && (
                                  <CheckCircle2 className="w-3 h-3 text-green-600" />
                                )}
                              </div>
                              <p className="truncate text-sm font-medium text-slate-800 mt-0.5">
                                {lesson.title}
                              </p>
                            </div>
                          </div>
                          <Badge
                            className={`${
                              isSelected
                                ? "bg-indigo-600 text-white"
                                : "bg-slate-100 text-slate-600"
                            } border-0 text-xs px-2 py-0.5`}
                          >
                            {getLessonTypeLabel(lesson.type)}
                          </Badge>
                        </div>
                      </button>
                    );
                  })}

                  {lessonCount === 0 && (
                    <div className="rounded-lg border border-dashed border-slate-200 bg-white px-4 py-8 text-center">
                      <p className="text-sm text-slate-400">
                        Chưa có bài học trong chương này
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="p-5 bg-white/80 backdrop-blur-sm border-t border-slate-200 shadow-lg">
        <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] group">
          <Play className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
          Tiếp tục học
        </Button>
      </div>
    </div>
  );
}
