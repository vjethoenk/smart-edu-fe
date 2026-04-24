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
import { Select } from "@/components/ui/select";
import { useCreateUser, useUpdateUser } from "@/features/user/hook";
import { useGetRoles } from "@/features/role/hook";
import { IUser } from "@/types/api";
import { toast } from "sonner";
import { UserResponse } from "@/features/user/api";
import { IRole } from "@/features/role/api";

interface UserModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  user?: UserResponse;
  rolesData: IRole[];
}

export function UserModal({
  open,
  onClose,
  onSuccess,
  user,
  rolesData,
}: UserModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roleId, setRoleId] = useState("");

  const createUser = useCreateUser();
  const updateUser = useUpdateUser();

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setRoleId(user.role);
      setPassword("");
    } else {
      setName("");
      setEmail("");
      setPassword("");
      setRoleId("");
    }
  }, [user, open]);

  const handleSubmit = async () => {
    if (!name || !email || !roleId || (!user && !password)) {
      toast.error("Vui lòng điền tất cả các trường bắt buộc");
      return;
    }

    try {
      if (user) {
        await updateUser.mutateAsync({
          id: user._id,
          data: {
            name,
            email,
            role: roleId,
            ...(password && { password }),
          },
        });
        toast.success("Cập nhật người dùng thành công");
      } else {
        await createUser.mutateAsync({
          name,
          email,
          password,
          role: roleId,
        });
        toast.success("Tạo người dùng thành công");
      }
      onClose();
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Có lỗi xảy ra");
    }
  };

  const isLoading = createUser.isPending || updateUser.isPending;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {user ? "Chỉnh sửa người dùng" : "Thêm người dùng mới"}
          </DialogTitle>
          <DialogDescription>
            {user
              ? "Cập nhật thông tin người dùng"
              : "Điền thông tin để tạo người dùng mới"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Tên người dùng</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nhập tên..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập email..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">
              Mật khẩu {user && "(Để trống nếu không thay đổi)"}
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Vai trò</Label>
            <Select
              id="role"
              value={roleId}
              onChange={(e) => setRoleId(e.target.value)}
            >
              <option value="">Chọn vai trò...</option>
              {rolesData?.map((role) => (
                <option key={role._id} value={role._id || ""}>
                  {role.name}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Hủy
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Đang xử lý..." : user ? "Cập nhật" : "Tạo"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
