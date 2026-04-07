"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateCategory, useUpdateCategory } from "@/features/category/hook";
import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { ICategory } from "@/types/api";

interface CategoryModalProps {
  category?: ICategory | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CategoryModal({
  category,
  isOpen,
  onOpenChange,
}: CategoryModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();

  const isLoading = createMutation.isPending || updateMutation.isPending;

  useEffect(() => {
    if (isOpen) {
      setName(category?.name || "");
      setDescription(category?.description || "");
    }
  }, [category, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return alert("Vui lòng nhập tên danh mục");

    try {
      if (category?._id) {
        await updateMutation.mutateAsync({
          id: category._id,
          data: { name, description },
        });
      } else {
        await createMutation.mutateAsync({ name, description });
      }
      onOpenChange(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[420px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {category ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
            </DialogTitle>
            <DialogDescription>
              Điền thông tin chi tiết cho danh mục của bạn.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Tên danh mục</Label>
              <Input
                id="name"
                placeholder="Khóa học lập trình"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="desc">Mô tả</Label>
              <Input
                id="desc"
                placeholder="Mô tả ngắn gọn..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="min-w-[100px]"
              >
                {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
