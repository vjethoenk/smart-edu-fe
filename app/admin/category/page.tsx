"use client";

import { useState } from "react";
import { Loader2, Trash2, Edit2, Plus, Cat } from "lucide-react";
import { useGetCategories, useDeleteCategory } from "@/features/category/hook";
import { ICategory } from "@/types/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CategoryModal } from "../components/CategoryModal";

export default function CategoryPage() {
  const { data: categories, isLoading, isError } = useGetCategories();
  const deleteMutation = useDeleteCategory();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ICategory | null>(
    null,
  );

  const handleDeleteCategory = (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleEditCategory = (category: ICategory) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleAddCategory = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
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
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Quản lý danh mục
          </h1>
          <p className="text-gray-500 mt-1">
            Tổng: {categories?.length || 0} danh mục
          </p>
        </div>

        <Button
          className="flex items-center justify-center gap-2"
          onClick={handleAddCategory}
        >
          <Plus className="w-4 h-4" /> Thêm danh mục
        </Button>

        <CategoryModal
          isOpen={isModalOpen}
          onOpenChange={setIsModalOpen}
          category={editingCategory}
        />
      </div>

      {categories && categories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Card
              key={category._id}
              className="
    group rounded-2xl bg-white
    shadow-md hover:shadow-2xl hover:-translate-y-1
    transition-all duration-300
  "
            >
              <CardContent className="p-5 flex flex-col h-full">
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    {/* Icon */}

                    <div>
                      <h3 className="text-base font-semibold text-gray-900">
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray-500 line-clamp-1">
                        {category.description || "Không có mô tả"}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-1 ">
                    <button
                      onClick={() => handleEditCategory(category)}
                      className="p-2 rounded-lg hover:bg-gray-100 transition"
                    >
                      <Edit2 className="h-4 w-4 text-gray-500" />
                    </button>

                    <button
                      onClick={() => handleDeleteCategory(category._id)}
                      className="p-2 rounded-lg hover:bg-red-50 transition"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </button>
                  </div>
                </div>

                {/* Content spacing */}
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="text-gray-400">
                    #{category._id.slice(-5)}
                  </span>

                  <span
                    className="px-2 py-1 text-xs font-medium 
                      bg-blue-50 text-blue-600 rounded-md"
                  >
                    Category
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 border border-dashed rounded-2xl bg-gray-50">
          <p className="text-gray-500 mb-4">Chưa có danh mục nào</p>
          <Button onClick={handleAddCategory}>Thêm danh mục ngay</Button>
        </div>
      )}
    </div>
  );
}
