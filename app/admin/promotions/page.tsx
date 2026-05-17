"use client";

import { useState } from "react";
import { Loader2, Trash2, Edit2, Plus, Tag, Calendar, Percent } from "lucide-react";
import { useGetPromotions, useDeletePromotion } from "@/features/promotion/hook";
import { IPromotion } from "@/types/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PromotionModal } from "./components/PromotionModal";
import { formatVND } from "@/hooks/formatVND"; // Nếu cần, hiện tại đang dùng % nên không gọi tới

export default function PromotionsPage() {
  const { data: promotions, isLoading, isError } = useGetPromotions();
  const deleteMutation = useDeletePromotion();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<IPromotion | null>(null);

  const handleDeletePromotion = (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa khuyến mãi này? Thao tác này có thể không hoàn tác được.")) {
      deleteMutation.mutate(id);
    }
  };

  const handleEditPromotion = (promotion: IPromotion) => {
    setEditingPromotion(promotion);
    setIsModalOpen(true);
  };

  const handleAddPromotion = () => {
    setEditingPromotion(null);
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
        <p className="text-red-600">Có lỗi xảy ra khi tải danh sách khuyến mãi</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Quản lý Khuyến mãi
          </h1>
          <p className="text-gray-500 mt-1">
            Tổng: {promotions?.length || 0} mã khuyến mãi
          </p>
        </div>

        <Button
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white"
          onClick={handleAddPromotion}
        >
          <Plus className="w-4 h-4" /> Thêm khuyến mãi mới
        </Button>

        <PromotionModal
          isOpen={isModalOpen}
          onOpenChange={setIsModalOpen}
          promotion={editingPromotion}
        />
      </div>

      {promotions && promotions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {promotions.map((promotion) => {
            const courseTitle = typeof promotion.courseId === "object" 
              ? (promotion.courseId as any).title 
              : "Khóa học đã liên kết";
              
            const isExpired = new Date(promotion.endDate) < new Date();
            const isUsageLimitReached = promotion.usedCount >= promotion.maxUsageCount;
            const statusColor = (!promotion.isActive || isExpired || isUsageLimitReached) ? "bg-gray-100 text-gray-600" : "bg-green-100 text-green-700";
            const statusText = !promotion.isActive ? "Đã tắt" : isExpired ? "Hết hạn" : isUsageLimitReached ? "Hết lượt dùng" : "Đang hoạt động";

            return (
              <Card
                key={promotion._id}
                className={`group rounded-2xl bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 ${(!promotion.isActive || isExpired) ? 'opacity-70' : ''}`}
              >
                <CardContent className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Tag className="w-5 h-5 text-indigo-500" />
                        <h3 className="text-xl font-extrabold text-gray-900 tracking-wider">
                          {promotion.code}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-500 line-clamp-1">
                        Áp dụng cho: <span className="font-medium text-gray-700">{courseTitle}</span>
                      </p>
                    </div>
                    
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEditPromotion(promotion)}
                        className="p-2 rounded-lg bg-gray-50 hover:bg-indigo-50 text-gray-500 hover:text-indigo-600 transition-colors"
                        title="Sửa khuyến mãi"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeletePromotion(promotion._id)}
                        className="p-2 rounded-lg bg-gray-50 hover:bg-red-50 text-gray-500 hover:text-red-500 transition-colors"
                        title="Xóa khuyến mãi"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-y-3 gap-x-4 mb-4 text-sm bg-gray-50 rounded-xl p-3">
                    <div className="flex flex-col gap-1">
                      <span className="text-gray-500 flex items-center gap-1"><Percent className="w-3.5 h-3.5" /> Mức giảm</span>
                      <span className="font-semibold text-indigo-600">{promotion.discountPercentage}%</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-gray-500 flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Lượt dùng</span>
                      <span className="font-semibold text-gray-900">{promotion.usedCount} / {promotion.maxUsageCount}</span>
                    </div>
                    <div className="flex flex-col gap-1 col-span-2 mt-1">
                      <span className="text-gray-500 flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Thời hạn</span>
                      <span className="font-medium text-gray-800">
                        {new Date(promotion.startDate).toLocaleDateString("vi-VN")} - {new Date(promotion.endDate).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${statusColor}`}>
                      {statusText}
                    </span>
                    <span className="text-xs text-gray-400 truncate max-w-[150px]" title={promotion.description}>
                      {promotion.description || "Không có mô tả"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50/50">
          <div className="bg-white p-4 rounded-full shadow-sm mb-4">
            <Tag className="w-8 h-8 text-indigo-300" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Chưa có mã khuyến mãi nào</h3>
          <p className="text-gray-500 mb-6 text-center max-w-md">
            Tạo mã khuyến mãi để thu hút thêm học viên và tăng doanh số cho các khóa học của bạn.
          </p>
          <Button onClick={handleAddPromotion} className="bg-indigo-600 hover:bg-indigo-700">
            <Plus className="w-4 h-4 mr-2" /> Tạo khuyến mãi đầu tiên
          </Button>
        </div>
      )}
    </div>
  );
}
