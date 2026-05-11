import { useState } from "react";
import { Film, Volume2, Headphones, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const LessonVideo = ({ videoUrl }: { videoUrl?: string }) => {
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
        className="w-full aspect-video"
        controls
        src={videoUrl}
        poster="/api/placeholder/1280/720"
      />
    </div>
  );
};
