"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Timer } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuizTimerProps {
  limitTime: number; // tính bằng phút
  onTimeUp: () => void;
}

export default function QuizTimer({ limitTime, onTimeUp }: QuizTimerProps) {
  const limitSeconds = limitTime * 60;
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const displayTimeLeft = timeLeft !== null ? timeLeft : limitSeconds;
  const onTimeUpRef = useRef(onTimeUp);
  const hasAutoSubmitted = useRef(false);

  useEffect(() => {
    onTimeUpRef.current = onTimeUp;
  }, [onTimeUp]);

  // Khởi tạo/cập nhật timeLeft khi limitSeconds thay đổi
  useEffect(() => {
    if (limitSeconds > 0) {
      setTimeLeft(limitSeconds);
    }
  }, [limitSeconds]);

  // Bộ đếm ngược chạy độc lập mỗi giây
  useEffect(() => {
    if (limitSeconds <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const current = prev !== null ? prev : limitSeconds;
        if (current <= 1) {
          clearInterval(timer);
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [limitSeconds]);

  // Tự động kích hoạt callback khi hết giờ
  useEffect(() => {
    if (limitSeconds > 0 && timeLeft !== null && timeLeft === 0 && !hasAutoSubmitted.current) {
      hasAutoSubmitted.current = true;
      onTimeUpRef.current();
    }
  }, [timeLeft, limitSeconds]);

  // Format giây thành MM:SS
  const formatTimeLeft = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }, []);

  const isLowTime = limitSeconds > 0 && displayTimeLeft <= 60;

  return (
    <div className="flex items-center gap-3">
      <div className={cn(
        "p-2 rounded-lg transition-colors",
        isLowTime ? "bg-red-500/30" : "bg-blue-500/20"
      )}>
        <Timer className={cn(
          "w-5 h-5",
          isLowTime ? "text-red-400" : "text-blue-400"
        )} />
      </div>
      <div>
        <p className={cn(
          "text-sm",
          isLowTime ? "text-red-300" : "text-purple-300"
        )}>Thời gian còn lại</p>
        <p className={cn(
          "text-2xl font-bold tabular-nums",
          isLowTime ? "text-red-400" : "text-white"
        )}>
          {limitSeconds > 0 ? formatTimeLeft(displayTimeLeft) : "Không giới hạn"}
        </p>
      </div>
    </div>
  );
}
