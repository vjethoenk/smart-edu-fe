import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Video, Link2, FileText, Heading, Upload, Loader2 } from "lucide-react";
import { useCreateLesson, useUploadVideo } from "@/features/lesson/hook";
import { useCourseStore } from "@/features/course/store";
import { EActiveView } from "@/features/course/enum";

const VideoModal = ({
  sectionId,
  type,
}: {
  sectionId: string;
  type: string;
}) => {
  const [form, setForm] = useState({
    title: "",
    content: "",
    videoUrl: "",
  });

  const { setActiveView, courseId } = useCourseStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const uploadVideo = useUploadVideo();
  const { mutate: createLesson } = useCreateLesson();

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const isUploading = uploadVideo.isPending;

  const handleUploadVideo = async (file: File | null) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const result = await uploadVideo.mutateAsync(formData);
    const uploadedUrl = result?.data?.hlsUrl ?? result?.data.hlsUrl ?? "";
    if (uploadedUrl) {
      handleChange("videoUrl", String(uploadedUrl));
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const payload = {
      ...form,
      sectionId,
      type,
      courseId,
    };
    createLesson(payload);
    setIsSubmitting(false);
    setActiveView(EActiveView.NONE);
    setForm({ title: "", content: "", videoUrl: "" });
  };

  return (
    <div className="w-full rounded-2xl ">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 p-2.5 shadow-lg shadow-blue-200">
          <Video className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            Thêm bài học Video
          </h2>
          <p className="text-sm text-gray-500">
            Thêm video từ URL hoặc tải lên từ máy tính
          </p>
        </div>
      </div>

      <div className="space-y-5">
        {/* Title */}
        <div className="group">
          <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Heading className="h-4 w-4 text-blue-500" />
            Tiêu đề bài học
          </label>
          <Input
            placeholder="VD: Giới thiệu về React Hooks"
            value={form.title}
            onChange={(e) => handleChange("title", e.target.value)}
            className="border-gray-200 transition-all focus:border-blue-300 focus:ring-2 focus:ring-blue-200"
          />
        </div>

        <div className="group">
          <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
            <FileText className="h-4 w-4 text-blue-500" />
            Mô tả nội dung
          </label>
          <Textarea
            placeholder="Mô tả ngắn về nội dung video..."
            rows={4}
            value={form.content}
            onChange={(e) => handleChange("content", e.target.value)}
            className="resize-none border-gray-200 transition-all focus:border-blue-300 focus:ring-2 focus:ring-blue-200"
          />
        </div>

        <div className="group">
          <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Link2 className="h-4 w-4 text-blue-500" />
            Đường dẫn video
          </label>
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                id="thumbnail"
                value={form.videoUrl}
                onChange={(e) => handleChange("videoUrl", e.target.value)}
                placeholder="URL video tải lên"
              />
            </div>
            <div className="relative">
              <label className="cursor-pointer rounded-lg border border-input px-2 h-full justify-center items-center flex bg-white  text-sm text-gray-600 transition hover:bg-gray-50">
                <Upload className="inline-block mr-2 h-4 w-4" />
                <span>{isUploading ? "Đang upload..." : "Upload"}</span>
                <input
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={(event) =>
                    handleUploadVideo(event.target.files?.[0] ?? null)
                  }
                />
              </label>
            </div>
          </div>
          <div className="mt-4">
            {form.videoUrl ? (
              <video
                src={form.videoUrl}
                controls
                className="h-48 w-full rounded-lg object-cover border border-slate-200"
              />
            ) : null}
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-100">
        <Button
          variant="outline"
          onClick={() => setForm({ title: "", content: "", videoUrl: "" })}
          className="border-gray-200 text-gray-600 transition-all hover:border-gray-300 hover:bg-gray-50"
        >
          Nhập lại
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!form.title || !form.videoUrl || isSubmitting}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md transition-all hover:from-blue-600 hover:to-blue-700 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Đang xử lý...
            </div>
          ) : (
            "Thêm video ngay"
          )}
        </Button>
      </div>
    </div>
  );
};

export default VideoModal;
