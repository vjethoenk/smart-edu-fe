"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateRole, useUpdateRole } from "@/features/role/hook";
import { IRole } from "@/features/role/api";
import { toast } from "sonner";

interface RoleModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  role?: IRole;
}

export function RoleModal({ open, onClose, onSuccess, role }: RoleModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const createRole = useCreateRole();
  const updateRole = useUpdateRole();

  useEffect(() => {
    if (role) {
      setName(role.name);
      setDescription(role.description || "");
    } else {
      setName("");
      setDescription("");
    }
  }, [role, open]);

  const handleSubmit = async () => {
    if (!name) {
      toast.error("Vui lòng nhập tên vai trò");
      return;
    }

    try {
      if (role) {
        await updateRole.mutateAsync({
          id: role._id || "",
          data: { name, description, isActive: true },
        });
        toast.success("Cập nhật vai trò thành công");
      } else {
        await createRole.mutateAsync({ name, description, isActive: true });
        toast.success("Tạo vai trò thành công");
      }
      onClose();
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Có lỗi xảy ra");
    }
  };

  const isLoading = createRole.isPending || updateRole.isPending;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {role ? "Chỉnh sửa vai trò" : "Thêm vai trò mới"}
          </DialogTitle>
          <DialogDescription>
            {role
              ? "Cập nhật thông tin vai trò"
              : "Điền thông tin để tạo vai trò mới"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Tên Vai Trò</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ví dụ: Instructor, USER..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Mô Tả</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mô tả vai trò..."
              rows={4}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Hủy
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Đang xử lý..." : role ? "Cập nhật" : "Tạo"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
