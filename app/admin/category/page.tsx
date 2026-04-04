"use client";

import { useState } from "react";
import { Loader2, Trash2, Edit2 } from "lucide-react";
import CategoryModal from "../components/CategoryModal";
import { useGetCategories, useDeleteCategory } from "@/features/category/hook";
import { ICategory } from "@/types/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function CategoryPage() {
  const { data: categories, isLoading, isError } = useGetCategories();
  console.log("Categories:", categories);
  const deleteMutation = useDeleteCategory();
  const [editingCategory, setEditingCategory] = useState<ICategory | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDeleteCategory = (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleEditCategory = (category: ICategory) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setEditingCategory(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Có lỗi xảy ra khi tải danh sách danh mục</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản lý danh mục</h1>
          <p className="text-gray-500 mt-1">
            Tổng: {categories?.length || 0} danh mục
          </p>
        </div>
        <CategoryModal onOpenChange={handleModalClose} />
      </div>

      {categories && categories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <Card
              key={category._id}
              className="p-6 hover:shadow-lg transition-shadow"
            >
              <div className="space-y-3">
                <h3 className="font-semibold text-lg truncate">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {category.description || "Không có mô tả"}
                </p>

                <div className="flex gap-2 pt-4">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 flex items-center gap-2"
                    onClick={() => handleEditCategory(category)}
                  >
                    <Edit2 className="h-4 w-4" />
                    Sửa
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="flex-1 flex items-center gap-2"
                    onClick={() => handleDeleteCategory(category._id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                    Xóa
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <p className="text-gray-500 mb-4">Chưa có danh mục nào</p>
          <CategoryModal onOpenChange={handleModalClose} />
        </div>
      )}

      {editingCategory && (
        <CategoryModal
          key={editingCategory._id}
          category={editingCategory}
          onOpenChange={(open) => {
            if (!open) {
              setEditingCategory(null);
            }
          }}
        />
      )}
    </div>
  );
}
