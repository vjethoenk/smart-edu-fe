import { useCallback, useRef } from "react";
import { Film } from "lucide-react";
import { useLessonTracking } from "@/components/providers/LessonTrackingProvider";

export const LessonVideo = ({ videoUrl }: { videoUrl?: string }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { track, setCurrentTime } = useLessonTracking();

  const handleTimeUpdate = useCallback(() => {
    const current = videoRef.current?.currentTime ?? 0;
    setCurrentTime(current);
  }, [setCurrentTime]);
  const handlePlay = useCallback(() => {
    const current = videoRef.current?.currentTime ?? 0;
    track("play", { currentTime: current });
  }, [track]);

  const handlePause = useCallback(() => {
    const current = videoRef.current?.currentTime ?? 0;
    track("pause", { currentTime: current });
  }, [track]);

  const handleSeeked = useCallback(() => {
    const current = videoRef.current?.currentTime ?? 0;
    track("seek", { currentTime: current });
  }, [track]);

  const handleEnded = useCallback(() => {
    const current = videoRef.current?.currentTime ?? 0;
    track("end", { currentTime: current });
  }, [track]);

  if (!videoUrl) {
    return (
      <div className="bg-gradient-to-br from-slate-100 to-slate-200 p-16 text-center">
        <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-white shadow-md flex items-center justify-center">
          <Film className="w-12 h-12 text-slate-400" />
        </div>
        <p className="text-slate-500 font-medium">Video đang được cập nhật</p>
      </div>
    );
  }

  return (
    <div className="relative bg-black">
      <video
        ref={videoRef}
        className="w-full aspect-video"
        controls
        src={videoUrl}
        poster="/api/placeholder/1280/720"
        onTimeUpdate={handleTimeUpdate}
        onPause={handlePause}
        onSeeked={handleSeeked}
        onEnded={handleEnded}
        onPlay={handlePlay}
      />
    </div>
  );
};
