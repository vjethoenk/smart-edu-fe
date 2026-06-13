"use client";

import { useState } from "react";
import {
  Loader2,
  Trash2,
  Edit2,
  Plus,
  Tag,
  Calendar,
  Percent,
  Gift,
  Clock,
  Users,
  AlertCircle,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import {
  useGetPromotions,
  useDeletePromotion,
} from "@/features/promotion/hook";
import { IPromotion } from "@/types/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PromotionModal } from "./components/PromotionModal";
import { formatVND } from "@/hooks/formatVND";

export default function PromotionsPage() {
  const { data: promotions, isLoading, isError } = useGetPromotions();
  const deleteMutation = useDeletePromotion();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<IPromotion | null>(
    null,
  );

  const handleDeletePromotion = (id: string) => {
    if (
      window.confirm(
        "Bạn có chắc chắn muốn xóa khuyến mãi này? Thao tác này không thể hoàn tác.",
      )
    ) {
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

  const getPromotionStatus = (promotion: IPromotion) => {
    const now = new Date();
    const startDate = new Date(promotion.startDate);
    const endDate = new Date(promotion.endDate);

    if (!promotion.isActive) {
      return { label: "Không hoạt động", variant: "secondary", icon: XCircle };
    }
    if (now < startDate) {
      return { label: "Sắp diễn ra", variant: "warning", icon: Clock };
    }
    if (now > endDate) {
      return { label: "Đã kết thúc", variant: "secondary", icon: AlertCircle };
    }
    if (promotion.usedCount >= promotion.maxUsageCount) {
      return { label: "Hết lượt", variant: "destructive", icon: AlertCircle };
    }
    return { label: "Đang hoạt động", variant: "success", icon: CheckCircle2 };
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-slate-200 border-t-indigo-600 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Gift className="h-6 w-6 text-indigo-400" />
          </div>
        </div>
        <p className="text-sm text-slate-500">
          Đang tải danh sách khuyến mãi...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <div className="rounded-full bg-red-50 p-4">
          <AlertCircle className="h-10 w-10 text-red-500" />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-slate-900 mb-1">
            Có lỗi xảy ra
          </h3>
          <p className="text-sm text-slate-500">
            Không thể tải danh sách khuyến mãi. Vui lòng thử lại sau.
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Thử lại
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/20">
      <div className="max-w-8xl mx-auto p-6 lg:p-8 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
                <Gift className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-slate-800">
                Quản lý Khuyến mãi
              </h1>
            </div>
            <p className="text-sm text-slate-500 ml-12">
              Tạo và quản lý các mã giảm giá cho khóa học
            </p>
          </div>

          <Button
            onClick={handleAddPromotion}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl px-6"
          >
            <Plus className="w-4 h-4 mr-2" />
            Thêm khuyến mãi mới
          </Button>
        </div>

        {/* Stats Cards */}
        {promotions && promotions.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-0 bg-gradient-to-br from-indigo-50 to-indigo-100/50 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-indigo-600 uppercase">
                      Tổng số
                    </p>
                    <p className="text-2xl font-bold text-indigo-900">
                      {promotions.length}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-indigo-200/50">
                    <Gift className="h-5 w-5 text-indigo-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-emerald-50 to-emerald-100/50 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-emerald-600 uppercase">
                      Đang hoạt động
                    </p>
                    <p className="text-2xl font-bold text-emerald-900">
                      {
                        promotions.filter(
                          (p) =>
                            getPromotionStatus(p).label === "Đang hoạt động",
                        ).length
                      }
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-200/50">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Promotions Grid */}
        {promotions && promotions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {promotions.map((promotion) => {
              const courseTitle =
                typeof promotion.courseId === "object"
                  ? (promotion.courseId as any).title
                  : "Khóa học";

              const status = getPromotionStatus(promotion);
              const StatusIcon = status.icon;
              const now = new Date();
              const startDate = new Date(promotion.startDate);
              const isUpcoming = now < startDate;

              return (
                <Card
                  key={promotion._id}
                  className="group relative p-0 overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-white"
                >
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4 z-10">
                    <Badge
                      variant={status.variant as any}
                      className="gap-1 text-white"
                    >
                      <StatusIcon className="h-3 w-3" />
                      {status.label}
                    </Badge>
                  </div>

                  <CardContent className="p-0">
                    {/* Header với màu nổi bật */}
                    <div
                      className={`p-5 bg-gradient-to-r ${
                        isUpcoming
                          ? "from-orange-500 to-orange-600"
                          : status.label === "Đang hoạt động"
                            ? "from-indigo-600 to-purple-600"
                            : "from-slate-600 to-slate-700"
                      } text-white`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Tag className="h-5 w-5" />
                        <span className="text-lg font-bold tracking-wider">
                          {promotion.code}
                        </span>
                      </div>
                      <p className="text-sm opacity-90 line-clamp-1">
                        {courseTitle}
                      </p>
                    </div>

                    {/* Content */}
                    <div className="p-5 space-y-4">
                      {/* Discount & Usage */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="text-center p-2 rounded-lg bg-indigo-50">
                          <Percent className="h-4 w-4 text-indigo-500 mx-auto mb-1" />
                          <p className="text-xs text-slate-500">Giảm giá</p>
                          <p className="text-lg font-bold text-indigo-600">
                            {promotion.discountPercentage}%
                          </p>
                        </div>
                        <div className="text-center p-2 rounded-lg bg-slate-50">
                          <Users className="h-4 w-4 text-slate-500 mx-auto mb-1" />
                          <p className="text-xs text-slate-500">Đã dùng</p>
                          <p className="text-lg font-bold text-slate-700">
                            {promotion.usedCount}/{promotion.maxUsageCount}
                          </p>
                        </div>
                      </div>

                      {/* Date Range */}
                      <div className="space-y-1 pt-2 border-t border-slate-100">
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>Thời gian áp dụng</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium text-slate-700">
                            {new Date(promotion.startDate).toLocaleDateString(
                              "vi-VN",
                            )}
                          </span>
                          <span className="text-slate-400">→</span>
                          <span className="font-medium text-slate-700">
                            {new Date(promotion.endDate).toLocaleDateString(
                              "vi-VN",
                            )}
                          </span>
                        </div>
                      </div>

                      {/* Description */}
                      {promotion.description && (
                        <div className="pt-2 border-t border-slate-100">
                          <p className="text-xs text-slate-500 line-clamp-2">
                            {promotion.description}
                          </p>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2 pt-3">
                        <Button
                          onClick={() => handleEditPromotion(promotion)}
                          variant="outline"
                          size="sm"
                          className="flex-1 gap-1 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                          Sửa
                        </Button>
                        <Button
                          onClick={() => handleDeletePromotion(promotion._id)}
                          variant="outline"
                          size="sm"
                          className="flex-1 gap-1 border-slate-200 hover:border-red-300 hover:bg-red-50 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Xóa
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 px-6 border-2 border-dashed border-slate-200 rounded-3xl bg-gradient-to-br from-slate-50 to-white">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full blur-xl opacity-20" />
              <div className="relative bg-white p-5 rounded-full shadow-xl">
                <Gift className="h-12 w-12 text-indigo-400" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">
              Chưa có mã khuyến mãi nào
            </h3>
            <p className="text-sm text-slate-500 mb-6 text-center max-w-md">
              Tạo mã giảm giá để thu hút học viên và tăng doanh số cho các khóa
              học của bạn
            </p>
            <Button
              onClick={handleAddPromotion}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md"
            >
              <Plus className="w-4 h-4 mr-2" />
              Tạo khuyến mãi đầu tiên
            </Button>
          </div>
        )}

        <PromotionModal
          isOpen={isModalOpen}
          onOpenChange={setIsModalOpen}
          promotion={editingPromotion}
        />
      </div>
    </div>
  );
}
