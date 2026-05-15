"use client";

import React from "react";
import { useGetCourseProgress } from "@/features/tracking/hook";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Loader2, BookOpen, Play, Award, ArrowRight } from "lucide-react";

export default function CourseProgress({ courseId }: { courseId: string }) {
  const { data, isLoading } = useGetCourseProgress(courseId);

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto mt-6 px-4">
        <Card className="rounded-2xl border shadow-sm">
          <CardContent className="h-40 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">
                Đang tải tiến độ khóa học...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const progress = data?.data?.progressPercent ?? 0;
  const completedLessons = data?.data?.completedLessons ?? 0;
  const totalLessons = data?.data?.totalLessons ?? 0;

  const roundedProgress = Math.round(progress);

  const remainingLessons = totalLessons - completedLessons;

  const getStatusText = () => {
    if (roundedProgress === 100) return "Bạn đã hoàn thành khóa học";

    if (roundedProgress >= 70) return "Bạn đang tiến rất gần đến đích";

    if (roundedProgress >= 30) return "Tiếp tục duy trì tiến độ học tập";

    return "Hãy bắt đầu bài học đầu tiên";
  };

  return (
    <div className="max-w-5xl mx-auto mt-6 px-0">
      <Card className="rounded-3xl border shadow-sm overflow-hidden border-amber-50">
        <CardContent className="p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row gap-8 items-center">
            {/* Left */}
            <div className="relative flex items-center justify-center">
              <div className="relative h-36 w-36">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                  {/* background */}
                  <circle
                    cx="60"
                    cy="60"
                    r="52"
                    strokeWidth="10"
                    fill="none"
                    className="stroke-slate-200 dark:stroke-slate-800"
                  />

                  {/* progress */}
                  <circle
                    cx="60"
                    cy="60"
                    r="52"
                    strokeWidth="10"
                    fill="none"
                    strokeLinecap="round"
                    stroke="currentColor"
                    className="text-primary transition-all duration-700"
                    strokeDasharray={2 * Math.PI * 52}
                    strokeDashoffset={
                      2 * Math.PI * 52 * (1 - roundedProgress / 100)
                    }
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold">{roundedProgress}%</span>

                  <span className="text-xs text-muted-foreground">
                    hoàn thành
                  </span>
                </div>
              </div>
            </div>

            {/* Right */}
            <div className="flex-1 w-full">
              <div className="space-y-5">
                {/* Title */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="h-5 w-5 text-primary" />

                    <h3 className="text-xl font-semibold">Tiến độ khóa học</h3>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    {getStatusText()}
                  </p>
                </div>

                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {completedLessons}/{totalLessons} bài học
                    </span>

                    <span className="font-medium">
                      {remainingLessons} bài còn lại
                    </span>
                  </div>

                  <Progress
                    value={roundedProgress}
                    className="h-2 rounded-full"
                  />
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border p-4">
                    <p className="text-sm text-muted-foreground mb-1">
                      Đã hoàn thành
                    </p>

                    <p className="text-2xl font-bold">{completedLessons}</p>
                  </div>

                  <div className="rounded-2xl border p-4">
                    <p className="text-sm text-muted-foreground mb-1">
                      Còn lại
                    </p>

                    <p className="text-2xl font-bold">{remainingLessons}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
