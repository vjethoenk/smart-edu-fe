"use client";

import { useState } from "react";
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
import { ICategory } from "@/types/api";

interface CategoryModalProps {
  category?: ICategory;
  onOpenChange?: (open: boolean) => void;
}

export default function CategoryModal({
  category,
  onOpenChange,
}: CategoryModalProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(category?.name || "");
  const [description, setDescription] = useState(category?.description || "");

  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();

  const isLoading = createMutation.isPending || updateMutation.isPending;

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    onOpenChange?.(newOpen);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Vui lòng nhập tên danh mục");
      return;
    }

    try {
      if (category?._id) {
        await updateMutation.mutateAsync({
          id: category._id,
          data: { name, description },
        });
      } else {
        await createMutation.mutateAsync({ name, description });
      }

      setName("");
      setDescription("");
      handleOpenChange(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleReset = () => {
    setName(category?.name || "");
    setDescription(category?.description || "");
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-indigo-600 hover:bg-indigo-700">
          {category ? "Chỉnh sửa" : "Thêm mới"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {category ? "Chỉnh sửa danh mục" : "Thêm mới danh mục"}
          </DialogTitle>
          <DialogDescription>
            {category
              ? "Cập nhật thông tin danh mục"
              : "Tạo một danh mục mới cho khóa học"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Tên danh mục *</Label>
            <Input
              id="name"
              placeholder="Nhập tên danh mục"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <Input
              id="description"
              placeholder="Nhập mô tả danh mục"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <DialogFooter className="space-y-2 sm:space-y-0">
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              disabled={isLoading}
            >
              Reset
            </Button>
            <Button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700"
              disabled={isLoading}
            >
              {isLoading ? "Đang xử lý..." : "Lưu"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
