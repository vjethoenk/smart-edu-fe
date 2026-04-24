"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeleteRole } from "@/features/role/hook";
import { toast } from "sonner";

interface DeleteRoleDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  roleId: string;
  roleName: string;
}

export function DeleteRoleDialog({
  open,
  onClose,
  onSuccess,
  roleId,
  roleName,
}: DeleteRoleDialogProps) {
  const deleteRole = useDeleteRole();

  const handleDelete = async () => {
    try {
      await deleteRole.mutateAsync(roleId);
      toast.success("Xóa vai trò thành công");
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
          <AlertDialogTitle>Xác nhận xóa vai trò</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc muốn xóa vai trò "{roleName}"? Hành động này không thể
            hoàn tác.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogCancel disabled={deleteRole.isPending}>
          Hủy
        </AlertDialogCancel>
        <AlertDialogAction
          onClick={handleDelete}
          disabled={deleteRole.isPending}
          className="bg-red-600 hover:bg-red-700"
        >
          {deleteRole.isPending ? "Đang xóa..." : "Xóa"}
        </AlertDialogAction>
      </AlertDialogContent>
    </AlertDialog>
  );
}
