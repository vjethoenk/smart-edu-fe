"use client";
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ILesson } from "@/types/api";
import {
  FileText,
  Film,
  PlayCircle,
  Trophy,
  Heart,
  Share2,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Award,
  Loader2,
} from "lucide-react";
import { LessonVideo } from "./content/LessonVideo";
import LessonPdf from "./content/LessonPdf";
import LessonQuiz from "./content/LessonQuiz";
import { useGetCourseProgress } from "@/features/tracking/hook";
import {
  useGetCertificateByCourse,
  useClaimCertificate,
} from "@/features/certificate/hook";
import CertificateModal from "./CertificateModal";
import { toast } from "sonner";

const getTypeConfig = (type?: string) => {
  const lowerType = type?.toLowerCase();

  switch (lowerType) {
    case "video":
      return {
        label: "VIDEO",
        gradient: "from-rose-500 to-pink-500",
        icon: Film,
      };
    case "pdf":
      return {
        label: "TÀI LIỆU",
        gradient: "from-blue-500 to-cyan-500",
        icon: FileText,
      };
    case "quiz":
      return {
        label: "KIỂM TRA",
        gradient: "from-amber-500 to-orange-500",
        icon: Trophy,
      };
    default:
      return {
        label: "BÀI HỌC",
        gradient: "from-emerald-500 to-teal-500",
        icon: PlayCircle,
      };
  }
};

const EmptyState = () => (
  <div className="bg-gradient-to-br from-slate-100 via-white to-indigo-50 rounded-3xl border border-slate-200 p-16 text-center shadow-sm">
    <div className="max-w-md mx-auto">
      <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center shadow-inner">
        <PlayCircle className="w-16 h-16 text-indigo-400" />
      </div>
      <h3 className="text-2xl font-bold text-slate-800 mb-3">
        Chào mừng bạn đến với khóa học
      </h3>
      <p className="text-slate-500 text-lg">
        Chọn một bài học để bắt đầu hành trình chinh phục tri thức
      </p>
    </div>
  </div>
);

export default function LessonPreview({
  lesson,
  courseId,
  hasPrevious,
  hasNext,
  currentIndex,
  totalLessons,
  onPrevious,
  onNext,
}: {
  lesson: ILesson | null;
  courseId: string;
  hasPrevious: boolean;
  hasNext: boolean;
  currentIndex: number;
  totalLessons: number;
  onPrevious: () => void;
  onNext: () => void;
}) {
  const [isLiked, setIsLiked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch course progress
  const { data: progressData } = useGetCourseProgress(courseId);
  const progressPercent = progressData?.data?.progressPercent ?? 0;
  const isCompleted = Math.round(progressPercent) === 100;

  // Check if certificate already exists
  const { data: existingCertificate } = useGetCertificateByCourse(
    courseId,
    isCompleted,
  );
  const claimCertificateMutation = useClaimCertificate();

  // Active certificate data
  const certificateData =
    existingCertificate?.data || claimCertificateMutation.data?.data;

  const handleClaimCertificate = () => {
    if (certificateData) {
      setIsModalOpen(true);
      return;
    }

    claimCertificateMutation.mutate(courseId, {
      onSuccess: () => {
        setIsModalOpen(true);
      },
      onError: (err: any) => {
        toast.error(
          err?.response?.data?.message ||
            err?.message ||
            "Không thể nhận giấy khen",
        );
      },
    });
  };

  if (!lesson) return <EmptyState />;

  const config = getTypeConfig(lesson.type);
  const Icon = config.icon;

  return (
    <div className="space-y-6 container mx-auto max-w-5xl p-0">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {lesson.type === "video" && <LessonVideo videoUrl={lesson.videoUrl} />}
        {lesson.type === "pdf" && <LessonPdf lesson={lesson} />}
        {lesson.type === "quiz" && <LessonQuiz lesson={lesson} />}

        <div className="p-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-lg",
                  config.gradient,
                )}
              >
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <Badge
                  className={cn(
                    "bg-gradient-to-r text-white border-0 px-3 py-1",
                    config.gradient,
                  )}
                >
                  {config.label}
                </Badge>
                <h1 className="text-2xl font-bold text-slate-800 mt-2">
                  {lesson.title}
                </h1>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="rounded-full">
                <Bookmark className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={() => setIsLiked(!isLiked)}
              >
                <Heart
                  className={cn(
                    "w-5 h-5",
                    isLiked && "fill-red-500 text-red-500",
                  )}
                />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Share2 className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-3">
            <Button
              variant="outline"
              className="rounded-full border-slate-300"
              onClick={onPrevious}
              disabled={!hasPrevious}
            >
              <ChevronLeft className="w-4 h-4 mr-2" /> Bài trước
            </Button>
            {/* <div className="text-sm text-slate-500">
              {currentIndex}/{totalLessons}
            </div> */}
            <div className="flex gap-3 items-center">
              {isCompleted ? (
                <Button
                  onClick={handleClaimCertificate}
                  disabled={claimCertificateMutation.isPending}
                  className="rounded-full shadow-md text-white font-semibold transition-all duration-300 hover:scale-105 active:scale-95 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                >
                  {claimCertificateMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Đang nhận...
                    </>
                  ) : (
                    <>
                      <Award className="w-4 h-4 mr-2 animate-pulse" />
                      Nhận giấy khen hoàn thành
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="rounded-full border-slate-300 cursor-default"
                >
                  <CheckCircle className="w-4 h-4 mr-2 text-slate-400" /> Hoàn
                  thành
                </Button>
              )}
              <Button
                className={cn(
                  "rounded-full shadow-md",
                  !hasNext ? "opacity-50 cursor-not-allowed" : "",
                )}
                style={{
                  background: "linear-gradient(90deg, #4f46e5, #9333ea)",
                }}
                onClick={onNext}
                disabled={!hasNext}
              >
                Tiếp theo <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Certificate Modal */}
      {certificateData && (
        <CertificateModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          certificate={certificateData}
        />
      )}
    </div>
  );
}
