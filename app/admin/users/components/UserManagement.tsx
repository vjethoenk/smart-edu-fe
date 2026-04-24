"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useGetUsers } from "@/features/user/hook";
import { UserModal } from "./UserModal";
import { DeleteUserDialog } from "./DeleteUserDialog";
import { UserResponse } from "@/features/user/api";
import { useGetRoles } from "@/features/role/hook";

export function UserManagement() {
  const [openModal, setOpenModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserResponse | undefined>();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState("");
  const [deleteUserName, setDeleteUserName] = useState("");

  const { data, isLoading, refetch } = useGetUsers(0, 10);
  const { data: rolesData } = useGetRoles();

  const renderRoleName = (id: string) => {
    const role = rolesData?.find((role) => role._id === id);
    return role ? role.name : "Unknown";
  };

  const handleAddUser = () => {
    setSelectedUser(undefined);
    setOpenModal(true);
  };

  const handleEditUser = (user: UserResponse) => {
    setSelectedUser(user);
    setOpenModal(true);
  };

  const handleDeleteUser = (user: UserResponse) => {
    setDeleteUserId(user._id);
    setDeleteUserName(user.name);
    setOpenDeleteDialog(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedUser(undefined);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  const users = data?.data || [];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Quản Lý Người Dùng</h2>
        <Button onClick={handleAddUser} className="gap-2">
          <Plus className="w-4 h-4" />
          Thêm Người Dùng
        </Button>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Tên</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Vai Trò</TableHead>
              <TableHead className="w-24">Hành Động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-8 text-muted-foreground"
                >
                  Không có người dùng nào
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{renderRoleName(user.role)}</TableCell>
                  <TableCell className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditUser(user)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDeleteUser(user)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <UserModal
        open={openModal}
        onClose={handleCloseModal}
        onSuccess={() => refetch()}
        user={selectedUser}
        rolesData={rolesData || []}
      />

      <DeleteUserDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onSuccess={() => refetch()}
        userId={deleteUserId}
        userName={deleteUserName}
      />
    </div>
  );
}
