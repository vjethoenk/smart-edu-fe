"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  useCreateTracking,
  useGetLessonProgress,
} from "@/features/tracking/hook";
import { useAppSelector } from "@/store/hook";
import { ITracking } from "@/types/api";

interface LessonTrackingContextValue {
  track: (event: string, metadata?: { currentTime?: number }) => void;
  setCurrentTime: (time: number) => void;
  currentTime: number;
  lessonId?: string;
  itemType?: string;
  courseId?: string;
}

const LessonTrackingContext = createContext<LessonTrackingContextValue | null>(
  null,
);

export const useLessonTracking = () => {
  const context = useContext(LessonTrackingContext);
  const lessonState = useAppSelector((state) => state.lesson);
  const { mutate: sendEvent } = useCreateTracking();

  return useMemo(() => {
    if (context) {
      return context;
    }

    const track = (event: string, metadata?: { currentTime?: number }) => {
      if (!lessonState.currentLessonId || !lessonState.currentLessonType)
        return;
      const payload: ITracking = {
        lessonId: lessonState.currentLessonId,
        itemType: lessonState.currentLessonType,
        event,
        currentTime: metadata?.currentTime ?? 0,
      };
      sendEvent({ data: payload });
    };

    return {
      track,
      setCurrentTime: () => undefined,
      currentTime: 0,
      lessonId: lessonState.currentLessonId ?? undefined,
      itemType: lessonState.currentLessonType ?? undefined,
      courseId: undefined,
    };
  }, [context, lessonState, sendEvent]);
};

interface LessonTrackingProviderProps {
  children: React.ReactNode;
  lessonId?: string;
  itemType?: string;
  courseId?: string;
}

export const LessonTrackingProvider = ({
  children,
  lessonId,
  itemType,
  courseId,
}: LessonTrackingProviderProps) => {
  const { mutate: sendEvent } = useCreateTracking();
  const [currentTime, setCurrentTime] = useState(0);
  const currentTimeRef = useRef(0);
  const heartbeatRef = useRef<NodeJS.Timeout | null>(null);
  const hasClosedRef = useRef(false);
  const { data: lessonProgressData } = useGetLessonProgress(lessonId as string);
  const isCompleted = !!lessonProgressData?.data?.isCompleted;
  const HEARTBEAT_INTERVAL = 10;

  const track = useCallback(
    (event: string, metadata?: { currentTime?: number }) => {
      if (!lessonId || !itemType) return;
      if (isCompleted) return;
      const payload: ITracking = {
        lessonId,
        itemType,
        event,
        currentTime: metadata?.currentTime ?? currentTimeRef.current,
      };
      sendEvent({ data: payload, courseId });
    },
    [itemType, lessonId, sendEvent, isCompleted, courseId],
  );

  const stopHeartbeat = useCallback(() => {
    if (heartbeatRef.current) {
      clearInterval(heartbeatRef.current);
      heartbeatRef.current = null;
    }
  }, []);

  const startHeartbeat = useCallback(() => {
    if (isCompleted) return;

    stopHeartbeat();

    heartbeatRef.current = setInterval(() => {
      if (isCompleted) return;

      if (itemType === "pdf") {
        currentTimeRef.current += HEARTBEAT_INTERVAL;

        track("heartbeat", {
          currentTime: currentTimeRef.current,
        });

        return;
      }
      track("heartbeat", {
        currentTime: currentTimeRef.current,
      });
    }, HEARTBEAT_INTERVAL * 1000);
  }, [isCompleted, itemType, stopHeartbeat, track]);

  const handleClose = useCallback(() => {
    if (hasClosedRef.current || !lessonId || !itemType) return;
    track("close", { currentTime: currentTimeRef.current });
    hasClosedRef.current = true;
    stopHeartbeat();
  }, [itemType, lessonId, stopHeartbeat, track]);

  useEffect(() => {
    currentTimeRef.current = currentTime;
  }, [currentTime]);

  useEffect(() => {
    if (!lessonId || !itemType) return;

    hasClosedRef.current = false;

    setCurrentTime(0);
    currentTimeRef.current = 0;

    if (!isCompleted) {
      track("open", { currentTime: 0 });
      startHeartbeat();
    } else {
      stopHeartbeat();
      hasClosedRef.current = true;
    }

    window.addEventListener("beforeunload", handleClose);

    return () => {
      handleClose();
      window.removeEventListener("beforeunload", handleClose);
    };
  }, [
    handleClose,
    itemType,
    lessonId,
    startHeartbeat,
    track,
    isCompleted,
    stopHeartbeat,
  ]);

  const contextValue = useMemo(
    () => ({
      track,
      setCurrentTime,
      currentTime,
      lessonId,
      itemType,
      courseId,
    }),
    [currentTime, itemType, lessonId, track, courseId],
  );

  return (
    <LessonTrackingContext.Provider value={contextValue}>
      {children}
    </LessonTrackingContext.Provider>
  );
};
