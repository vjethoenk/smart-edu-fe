import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreatePromotion, useUpdatePromotion } from "@/features/promotion/hook";
import { useGetCourses } from "@/features/course/hook";
import { IPromotion } from "@/types/api";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface PromotionModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  promotion: IPromotion | null;
}

export function PromotionModal({ isOpen, onOpenChange, promotion }: PromotionModalProps) {
  const isEditing = !!promotion;
  const createMutation = useCreatePromotion();
  const updateMutation = useUpdatePromotion();
  const { data: courses, isLoading: isCoursesLoading } = useGetCourses();

  const [formData, setFormData] = useState({
    code: "",
    discountPercentage: 0,
    courseId: "",
    description: "",
    startDate: "",
    endDate: "",
    maxUsageCount: 100,
    isActive: true,
  });

  // Reset form khi mở/đóng hoặc đổi promotion
  useEffect(() => {
    if (promotion) {
      setFormData({
        code: promotion.code || "",
        discountPercentage: promotion.discountPercentage || 0,
        courseId: typeof promotion.courseId === "string" ? promotion.courseId : (promotion.courseId as any)._id,
        description: promotion.description || "",
        startDate: promotion.startDate ? new Date(promotion.startDate).toISOString().slice(0, 16) : "",
        endDate: promotion.endDate ? new Date(promotion.endDate).toISOString().slice(0, 16) : "",
        maxUsageCount: promotion.maxUsageCount || 100,
        isActive: promotion.isActive !== undefined ? promotion.isActive : true,
      });
    } else {
      setFormData({
        code: "",
        discountPercentage: 0,
        courseId: "",
        description: "",
        startDate: "",
        endDate: "",
        maxUsageCount: 100,
        isActive: true,
      });
    }
  }, [promotion, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "number") {
      setFormData((prev) => ({ ...prev, [name]: Number(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic Validation
    if (!formData.code || !formData.courseId || !formData.startDate || !formData.endDate) {
      toast.error("Vui lòng điền đầy đủ các trường bắt buộc.");
      return;
    }
    if (new Date(formData.endDate) <= new Date(formData.startDate)) {
      toast.error("Ngày kết thúc phải lớn hơn ngày bắt đầu.");
      return;
    }
    if (formData.discountPercentage <= 0 || formData.discountPercentage > 100) {
      toast.error("Phần trăm giảm giá phải từ 1 đến 100.");
      return;
    }

    const submitData = {
      ...formData,
      startDate: new Date(formData.startDate).toISOString(),
      endDate: new Date(formData.endDate).toISOString(),
    };

    if (isEditing) {
      updateMutation.mutate(
        { id: promotion._id, data: submitData },
        {
          onSuccess: () => {
            toast.success("Cập nhật khuyến mãi thành công");
            onOpenChange(false);
          },
          onError: () => toast.error("Có lỗi xảy ra khi cập nhật"),
        }
      );
    } else {
      createMutation.mutate(submitData, {
        onSuccess: () => {
          toast.success("Tạo khuyến mãi mới thành công");
          onOpenChange(false);
        },
        onError: () => toast.error("Có lỗi xảy ra khi tạo mới"),
      });
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Cập nhật khuyến mãi" : "Thêm khuyến mãi mới"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Code */}
            <div className="space-y-2">
              <Label htmlFor="code">Mã khuyến mãi *</Label>
              <Input
                id="code"
                name="code"
                value={formData.code}
                onChange={handleChange}
                placeholder="VD: SUMMER2024"
                disabled={isEditing} // Không cho sửa code nếu đang update
                required
              />
            </div>

            {/* Discount Percentage */}
            <div className="space-y-2">
              <Label htmlFor="discountPercentage">Phần trăm giảm (%) *</Label>
              <Input
                id="discountPercentage"
                name="discountPercentage"
                type="number"
                min="1"
                max="100"
                value={formData.discountPercentage}
                onChange={handleChange}
                required
              />
            </div>

            {/* Course Selection */}
            <div className="col-span-2 space-y-2">
              <Label htmlFor="courseId">Khóa học áp dụng *</Label>
              <select
                id="courseId"
                name="courseId"
                value={formData.courseId}
                onChange={handleChange}
                className="w-full flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              >
                <option value="">-- Chọn khóa học --</option>
                {courses?.map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.title}
                  </option>
                ))}
              </select>
              {isCoursesLoading && <p className="text-xs text-gray-500">Đang tải danh sách khóa học...</p>}
            </div>

            {/* Start Date */}
            <div className="space-y-2">
              <Label htmlFor="startDate">Thời gian bắt đầu *</Label>
              <Input
                id="startDate"
                name="startDate"
                type="datetime-local"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
            </div>

            {/* End Date */}
            <div className="space-y-2">
              <Label htmlFor="endDate">Thời gian kết thúc *</Label>
              <Input
                id="endDate"
                name="endDate"
                type="datetime-local"
                value={formData.endDate}
                onChange={handleChange}
                required
              />
            </div>

            {/* Max Usage */}
            <div className="space-y-2">
              <Label htmlFor="maxUsageCount">Giới hạn lượt dùng</Label>
              <Input
                id="maxUsageCount"
                name="maxUsageCount"
                type="number"
                min="1"
                value={formData.maxUsageCount}
                onChange={handleChange}
              />
            </div>

            {/* Is Active (Only for Edit) */}
            {isEditing && (
              <div className="space-y-2 flex flex-col justify-center">
                <Label className="mb-2">Trạng thái</Label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="w-5 h-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-700">Kích hoạt</span>
                </label>
              </div>
            )}

            {/* Description */}
            <div className="col-span-2 space-y-2">
              <Label htmlFor="description">Mô tả chi tiết</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                placeholder="Nhập thông tin chi tiết về chương trình khuyến mãi..."
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-indigo-600 hover:bg-indigo-700">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Cập nhật" : "Tạo mới"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
