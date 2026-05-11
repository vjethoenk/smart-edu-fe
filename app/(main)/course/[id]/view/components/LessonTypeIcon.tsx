import { BookOpen, FileText, Film, PlayCircle } from "lucide-react";

export const getLessonTypeIcon = (type?: string) => {
  switch (type?.toLowerCase()) {
    case "video":
      return Film;
    case "pdf":
      return FileText;
    case "quiz":
      return BookOpen;
    default:
      return PlayCircle;
  }
};
