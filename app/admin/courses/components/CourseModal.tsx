"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGetCategories } from "@/features/category/hook";
import {
  useCreateCourse,
  useUpdateCourse,
  useUploadImage,
} from "@/features/course/hook";
import { ICategory, ICourse } from "@/types/api";
import { Loader2, Upload } from "lucide-react";

interface CourseModalProps {
  course?: ICourse | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const LEVEL_OPTIONS = ["Cơ bản", "Trung cấp", "Nâng cao"];

export function CourseModal({
  course,
  isOpen,
  onOpenChange,
}: CourseModalProps) {
  const { data: categories, isLoading: isCategoriesLoading } =
    useGetCategories();
  const createCourse = useCreateCourse();
  const updateCourse = useUpdateCourse();
  const uploadImage = useUploadImage();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [price, setPrice] = useState("");
  const [level, setLevel] = useState(LEVEL_OPTIONS[0]);
  const [categoryId, setCategoryId] = useState("");
  const [isPublished, setIsPublished] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTitle(course?.title || "");
      setDescription(course?.description || "");
      setThumbnail(course?.thumbnail || "");
      setPrice(course?.price.toString() || "0");
      setLevel(course?.level || LEVEL_OPTIONS[0]);
      setIsPublished(course?.isPublished ?? false);
      setCategoryId(course?.categoryId || categories?.[0]?._id || "");
    }
  }, [course, isOpen, categories]);

  useEffect(() => {
    if (!course && isOpen && categories && categories.length > 0) {
      setCategoryId(categories[0]._id);
    }
  }, [course, isOpen, categories]);

  const isSaving = createCourse.isPending || updateCourse.isPending;
  const isUploading = uploadImage.isPending;

  const handleUploadImage = async (file: File | null) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const result = await uploadImage.mutateAsync(formData);
    const uploadedUrl = result?.data?.url ?? result?.data ?? "";
    if (uploadedUrl) {
      setThumbnail(String(uploadedUrl));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return alert("Vui lòng nhập tiêu đề khóa học");
    if (!description.trim()) return alert("Vui lòng nhập mô tả khóa học");
    if (!thumbnail.trim()) return alert("Vui lòng tải ảnh đại diện lên");
    if (!categoryId) return alert("Vui lòng chọn danh mục khóa học");
    

    const payload = {
      title: title.trim(),
      description: description.trim(),
      thumbnail: thumbnail.trim(),
      price,
      level,
      categoryId,
      isPublished: course ? isPublished : false,
    };

    try {
      if (course?._id) {
        await updateCourse.mutateAsync({ id: course._id, data: payload });
      } else {
        await createCourse.mutateAsync(payload);
      }
      onOpenChange(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[640px] rounded-2xl">
        <DialogHeader>
          <DialogTitle>
            {course ? "Chỉnh sửa khóa học" : "Thêm khóa học mới"}
          </DialogTitle>
          <DialogDescription>
            Nhập đầy đủ thông tin và tải ảnh thumbnail lên để tạo hoặc cập nhật
            khóa học.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Tiêu đề</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Nhập tiêu đề khóa học"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Giá</Label>
              <Input
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full min-h-[100px] rounded-lg border border-input bg-transparent px-3 py-2 text-sm transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              placeholder="Mô tả chi tiết khóa học"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="level">Cấp độ</Label>
              <select
                id="level"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                {LEVEL_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Danh mục</Label>
              <select
                id="category"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                disabled={isCategoriesLoading || !categories?.length}
                className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                {categories?.map((category: ICategory) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="thumbnail">Thumbnail</Label>
            <div className="flex items-center gap-3">
              <Input
                id="thumbnail"
                value={thumbnail}
                onChange={(e) => setThumbnail(e.target.value)}
                placeholder="URL ảnh thumbnail"
              />
              <label className="cursor-pointer rounded-lg border border-input bg-white px-3 py-2 text-sm text-gray-600 transition hover:bg-gray-50">
                <Upload className="inline-block mr-2 h-4 w-4" />
                <span>{isUploading ? "Đang upload..." : "Upload"}</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) =>
                    handleUploadImage(event.target.files?.[0] ?? null)
                  }
                />
              </label>
            </div>
            {thumbnail ? (
              <img
                src={thumbnail}
                alt="Thumbnail preview"
                className="h-32 w-full rounded-lg object-cover border border-slate-200"
              />
            ) : null}
          </div>

          <div className="flex items-center gap-3">
            <input
              id="published"
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="h-4 w-4 rounded border-input text-indigo-600 focus:ring-indigo-500"
            />
            <Label htmlFor="published" className="!mb-0">
              Published
            </Label>
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isSaving} className="min-w-[120px]">
              {isSaving ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Đang lưu...
                </span>
              ) : course ? (
                "Cập nhật"
              ) : (
                "Tạo khóa học"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
