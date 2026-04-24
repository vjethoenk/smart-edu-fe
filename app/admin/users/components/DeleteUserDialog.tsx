"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeleteUser } from "@/features/user/hook";
import { toast } from "sonner";

interface DeleteUserDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  userId: string;
  userName: string;
}

export function DeleteUserDialog({
  open,
  onClose,
  onSuccess,
  userId,
  userName,
}: DeleteUserDialogProps) {
  const deleteUser = useDeleteUser();

  const handleDelete = async () => {
    try {
      await deleteUser.mutateAsync(userId);
      toast.success("Xóa người dùng thành công");
      onClose();
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Có lỗi xảy ra");
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xác nhận xóa người dùng</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc muốn xóa người dùng "{userName}"? Hành động này không
            thể hoàn tác.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogCancel disabled={deleteUser.isPending}>
          Hủy
        </AlertDialogCancel>
        <AlertDialogAction
          onClick={handleDelete}
          disabled={deleteUser.isPending}
          className="bg-red-600 hover:bg-red-700"
        >
          {deleteUser.isPending ? "Đang xóa..." : "Xóa"}
        </AlertDialogAction>
      </AlertDialogContent>
    </AlertDialog>
  );
}
