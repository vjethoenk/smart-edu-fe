import { Play } from "lucide-react";

export default function CoursePreview({ url }: { url: string }) {
  return (
    <div className="relative rounded-xl overflow-hidden mt-4">
      {url ? (
        <img
          src={url}
          alt="preview"
          className="w-full h-[520px] object-cover"
        />
      ) : (
        ""
      )}
    </div>
  );
}
