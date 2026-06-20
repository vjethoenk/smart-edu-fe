import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Video, Link2, FileText, Heading, Upload, Loader2 } from "lucide-react";
import {
  useCreateLesson,
  useGetByIdLesson,
  useUpdateLesson,
  useUploadPdf,
  useUploadVideo,
} from "@/features/lesson/hook";
import { useCourseStore } from "@/features/course/store";
import { EActiveView } from "@/features/course/enum";
import { useParams } from "next/navigation";

interface IPops {
  sectionId?: string;
  type: string;
  lessonId?: string;
}
const PdfModal = (props: IPops) => {
  const { id } = useParams();
  const { sectionId = "", type, lessonId = "" } = props;
  const { data: lessonDetail } = useGetByIdLesson(lessonId);
  const { mutate: uploadLesson } = useUpdateLesson();
  const [form, setForm] = useState({
    title: "",
    content: "",
    pdfUrl: "",
    courseId: "",
  });

  useEffect(() => {
    if (lessonId && lessonDetail) {
      setForm({
        title: lessonDetail.title || "",
        content: lessonDetail.content || "",
        pdfUrl: lessonDetail.pdfUrl || "",
        courseId: id as string,
      });
    }
  }, [lessonId, lessonDetail]);

  const { setActiveView, courseId } = useCourseStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const uploadPdf = useUploadPdf();
  const { mutate: createLesson } = useCreateLesson();

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const isUploading = uploadPdf.isPending;

  const handleUploadPdf = async (file: File | null) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const result = await uploadPdf.mutateAsync(formData);
    const uploadedUrl = result?.data?.url ?? result?.data.url ?? "";
    if (uploadedUrl) {
      handleChange("pdfUrl", String(uploadedUrl));
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const payload = {
      ...form,
      sectionId,
      type: "pdf",
      courseId: courseId || "",
    };
    createLesson(payload);
    setIsSubmitting(false);
    setActiveView(EActiveView.NONE);
    setForm({ title: "", content: "", pdfUrl: "", courseId: "" });
  };

  const handleUpdateLesson = async () => {
    if (!lessonId) return;
    const payload = {
      ...form,
      sectionId,
      type: "pdf",
      courseId: courseId || "",
    };
    uploadLesson({ id: lessonId, data: payload });
    setIsSubmitting(false);
    setActiveView(EActiveView.NONE);
    setForm({ title: "", content: "", pdfUrl: "", courseId: "" });
  };

  return (
    <div className="w-full rounded-2xl ">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 p-2.5 shadow-lg shadow-blue-200">
          <FileText className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">Thêm bài học PDF</h2>
          <p className="text-sm text-gray-500">
            Thêm pdf từ URL hoặc tải lên từ máy tính
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
            placeholder="Mô tả ngắn về nội dung pdf..."
            rows={4}
            value={form.content}
            onChange={(e) => handleChange("content", e.target.value)}
            className="resize-none border-gray-200 transition-all focus:border-blue-300 focus:ring-2 focus:ring-blue-200"
          />
        </div>

        <div className="group">
          <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Link2 className="h-4 w-4 text-blue-500" />
            Đường dẫn pdf
          </label>
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                id="thumbnail"
                value={form.pdfUrl}
                onChange={(e) => handleChange("pdfUrl", e.target.value)}
                placeholder="URL pdf tải lên"
              />
            </div>
            <div className="relative">
              <label className="cursor-pointer rounded-lg border border-input px-2 h-full justify-center items-center flex bg-white  text-sm text-gray-600 transition hover:bg-gray-50">
                <Upload className="inline-block mr-2 h-4 w-4" />
                <span>{isUploading ? "Đang upload..." : "Upload"}</span>
                <input
                  type="file"
                  accept="pdf/*"
                  className="hidden"
                  onChange={(event) =>
                    handleUploadPdf(event.target.files?.[0] ?? null)
                  }
                />
              </label>
            </div>
          </div>
          <div className="mt-4">
            {form.pdfUrl ? (
              <iframe
                src={form.pdfUrl}
                className="h-96 w-full rounded-lg object-cover border border-slate-200"
              />
            ) : null}
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-100">
        <Button
          variant="outline"
          onClick={() => {
            setForm({ title: "", content: "", pdfUrl: "", courseId: "" });
            setActiveView(EActiveView.NONE);
          }}
          className="border-gray-200 text-gray-600 transition-all hover:border-gray-300 hover:bg-gray-50 course-pointer "
        >
          Hủy bỏ
        </Button>
        <Button
          onClick={lessonId ? handleUpdateLesson : handleSubmit}
          disabled={!form.title || !form.pdfUrl || isSubmitting}
          className="bg-gradient-to-r course-pointer  from-blue-500 to-blue-600 text-white shadow-md transition-all hover:from-blue-600 hover:to-blue-700 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Đang xử lý...
            </div>
          ) : lessonId ? (
            "Cập nhật bài học"
          ) : (
            "Tạo bài học"
          )}
        </Button>
      </div>
    </div>
  );
};

export default PdfModal;
