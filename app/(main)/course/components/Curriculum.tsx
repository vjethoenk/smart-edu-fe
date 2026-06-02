import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { ICourse } from "@/types/api";
import {
  PlayCircle,
  Clock,
  BookOpen,
  ChevronRight,
  Layers,
  Film,
  FileText,
  Headphones,
} from "lucide-react";

const getLessonIcon = (lessonTitle: string) => {
  if (lessonTitle.toLowerCase().includes("video")) return Film;
  if (lessonTitle.toLowerCase().includes("audio")) return Headphones;
  if (lessonTitle.toLowerCase().includes("doc")) return FileText;
  return PlayCircle;
};

export default function Curriculum({
  courseDetails,
}: {
  courseDetails: ICourse;
}) {
  const totalSections = courseDetails.sections?.length || 0;
  const totalLessons = courseDetails.sections?.reduce(
    (acc, section) => acc + (section.lessons?.length || 0),
    0,
  );

  return (
    <div className="space-y-5">
      {/* Header thông tin tổng quan */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Layers className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-xl text-gray-800">
                Nội dung khóa học
              </h3>
              <p className="text-sm text-gray-500">
                {totalSections} chương • {totalLessons} bài học
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Accordion danh sách chương */}
      <Accordion type="multiple" className="space-y-4">
        {courseDetails.sections?.map((section, sectionIdx) => {
          const lessonCount = section.lessons?.length || 0;
          const IconComponent = getLessonIcon(section.title);

          return (
            <AccordionItem
              value={section._id as string}
              key={section._id as string}
              className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow transition-all duration-200"
            >
              <AccordionTrigger className="hover:no-underline px-5 py-4 data-[state=open]:border-b data-[state=open]:bg-gray-50/80 group">
                <div className="flex items-center justify-between w-full gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center group-data-[state=open]:bg-blue-100 transition">
                      <IconComponent className="w-4 h-4 text-blue-500" />
                    </div>
                    <div className="text-left">
                      <span className="font-semibold text-gray-800">
                        {section.title}
                      </span>
                      <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5">
                        <span>{lessonCount} bài học</span>
                        {/* {section.description && (
                          <>
                            <span>•</span>
                            <span>{section.description}</span>
                          </>
                        )} */}
                      </div>
                    </div>
                  </div>
                  {/* <ChevronRight className="w-4 h-4 text-gray-400 transition-transform duration-200 group-data-[state=open]:rotate-90" /> */}
                </div>
              </AccordionTrigger>

              <AccordionContent className="px-5 pb-4 pt-2 bg-white">
                <div className="space-y-1">
                  {section.lessons?.map((lesson, lessonIdx) => {
                    const LessonIcon = getLessonIcon(lesson.title || "");
                    return (
                      <div
                        key={lesson._id}
                        className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition cursor-pointer group/lesson"
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <span className="text-xs text-gray-400 w-7 font-mono">
                            {String(lessonIdx + 1).padStart(2, "0")}
                          </span>
                          <LessonIcon className="w-4 h-4 text-gray-400 group-hover/lesson:text-blue-500 transition" />
                          <span className="text-sm text-gray-700 group-hover/lesson:text-blue-600 transition truncate">
                            {lesson.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <Clock className="w-3.5 h-3.5" />
                          <span>05:00</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Nếu chưa có bài học nào */}
                {lessonCount === 0 && (
                  <div className="text-center py-6 text-gray-400 text-sm">
                    <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    Chưa có bài học trong chương này
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>

      {/* Nếu không có section nào */}
      {(!courseDetails.sections || courseDetails.sections.length === 0) && (
        <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-200">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400">Chưa có nội dung chi tiết</p>
        </div>
      )}
    </div>
  );
}
