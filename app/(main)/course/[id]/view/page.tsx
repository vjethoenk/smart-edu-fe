"use client";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useGetByIdCourse } from "@/features/course/hook";
import { ISection } from "@/types/api";
import CourseDetailHeader from "./components/CourseDetailHeader";
import CourseDetailSidebar from "./components/CourseDetailSidebar";
import LessonPreview from "./components/LessonPreview";

const findLesson = (
  sections: ISection[],
  sectionId: string,
  lessonId: string,
) => {
  const section =
    sections.find((section) => section._id === sectionId) ||
    sections[0] ||
    null;
  if (!section) return null;
  return (
    section.lessons?.find((lesson) => lesson._id === lessonId) ||
    section.lessons?.[0] ||
    null
  );
};

const CourseDetailPage = () => {
  const params = useParams();
  const courseId = params?.id as string;
  const {
    data: courseDetails,
    isLoading,
    isError,
  } = useGetByIdCourse(courseId);
  const sections = courseDetails?.sections ?? [];

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState("");
  const [activeLessonId, setActiveLessonId] = useState("");

  useEffect(() => {
    if (!courseDetails) return;

    const firstSection = sections?.[0];
    const firstLesson = firstSection?.lessons?.[0];

    if (firstSection?._id) {
      setActiveSectionId((current) => current || firstSection._id!);
    }
    if (firstLesson?._id) {
      setActiveLessonId((current) => current || firstLesson._id!);
    }
  }, [courseDetails, sections]);

  const lessonEntries = useMemo(
    () =>
      sections.flatMap(
        (section) =>
          section.lessons?.map((lesson) => ({
            sectionId: section._id ?? "",
            lessonId: lesson._id ?? "",
            lesson,
          })) ?? [],
      ),
    [sections],
  );

  const selectedLesson = useMemo(
    () => findLesson(sections, activeSectionId, activeLessonId),
    [sections, activeSectionId, activeLessonId],
  );

  const currentLessonIndex = useMemo(
    () =>
      lessonEntries.findIndex(
        (entry) =>
          entry.sectionId === activeSectionId &&
          entry.lessonId === activeLessonId,
      ),
    [lessonEntries, activeSectionId, activeLessonId],
  );

  const hasPrev = currentLessonIndex > 0;
  const hasNext =
    currentLessonIndex >= 0 && currentLessonIndex < lessonEntries.length - 1;

  const goToLessonAtIndex = (index: number) => {
    const entry = lessonEntries[index];
    if (!entry) return;
    setActiveSectionId(entry.sectionId);
    setActiveLessonId(entry.lessonId);
  };

  const totalLessons = lessonEntries.length;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
        <div className="relative">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 blur-xl opacity-20 animate-pulse"></div>
          <div className="relative rounded-2xl bg-white/80 backdrop-blur-sm px-8 py-6 shadow-xl border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-slate-700 font-medium">
                Đang tải khóa học...
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !courseDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
        <div className="rounded-2xl bg-white/80 backdrop-blur-sm px-8 py-7 shadow-xl border border-red-200">
          <div className="flex items-center gap-3 text-red-600">
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="font-medium">
              Không thể tải nội dung khóa học. Vui lòng thử lại sau.
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      <div className="lg:hidden fixed bottom-6 right-6 z-50">
        <button
          type="button"
          className="group rounded-full shadow-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-indigo-500/25 transition-all duration-300 w-14 h-14 text-white flex items-center justify-center"
          onClick={() => setIsSidebarOpen((current) => !current)}
        >
          {isSidebarOpen ? (
            <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
          ) : (
            <Menu className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
          )}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row">
        <div className="flex-1 min-w-0">
          {/* Lesson Preview - Now on top */}
          <div className="max-w-5xl mx-auto pt-6 lg:pt-8">
            <LessonPreview
              lesson={selectedLesson}
              hasPrevious={hasPrev}
              hasNext={hasNext}
              currentIndex={currentLessonIndex + 1}
              totalLessons={totalLessons}
              onPrevious={() => goToLessonAtIndex(currentLessonIndex - 1)}
              onNext={() => goToLessonAtIndex(currentLessonIndex + 1)}
            />
          </div>

          {/* Course Detail Header - Below preview */}
          <CourseDetailHeader
            course={courseDetails}
            totalSections={sections.length}
            totalLessons={totalLessons}
          />
        </div>

        <div
          className={`lg:w-[420px] bg-white/95 backdrop-blur-sm flex-shrink-0 fixed lg:relative inset-y-0 right-0 z-40 transform transition-all duration-500 ease-out ${
            isSidebarOpen
              ? "translate-x-0"
              : "translate-x-full lg:translate-x-0"
          } w-[340px] lg:w-[420px] shadow-2xl lg:shadow-xl lg:shadow-indigo-500/5 border-l border-slate-200/50`}
        >
          <CourseDetailSidebar
            sections={sections}
            activeSectionId={activeSectionId}
            activeLessonId={activeLessonId}
            onSelectLesson={(sectionId, lessonId) => {
              setActiveSectionId(sectionId);
              setActiveLessonId(lessonId);
              setIsSidebarOpen(false);
            }}
            onClose={() => setIsSidebarOpen(false)}
          />
        </div>
      </div>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 lg:hidden animate-in fade-in duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};
export default CourseDetailPage;
