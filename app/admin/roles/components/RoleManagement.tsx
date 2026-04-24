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
import { useGetRoles } from "@/features/role/hook";
import { RoleModal } from "./RoleModal";
import { DeleteRoleDialog } from "./DeleteRoleDialog";
import { IRole } from "@/features/role/api";

export function RoleManagement() {
  const [openModal, setOpenModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<IRole | undefined>();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteRoleId, setDeleteRoleId] = useState("");
  const [deleteRoleName, setDeleteRoleName] = useState("");

  const { data, isLoading, refetch } = useGetRoles();

  const handleAddRole = () => {
    setSelectedRole(undefined);
    setOpenModal(true);
  };

  const handleEditRole = (role: IRole) => {
    setSelectedRole(role);
    setOpenModal(true);
  };

  const handleDeleteRole = (role: IRole) => {
    setDeleteRoleId(role._id || "");
    setDeleteRoleName(role.name);
    setOpenDeleteDialog(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedRole(undefined);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  const roles = data || [];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Quản Lý Vai Trò</h2>
        <Button onClick={handleAddRole} className="gap-2">
          <Plus className="w-4 h-4" />
          Thêm Vai Trò
        </Button>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Tên</TableHead>
              <TableHead>Mô Tả</TableHead>
              <TableHead className="w-24">Hành Động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roles.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center py-8 text-muted-foreground"
                >
                  Không có vai trò nào
                </TableCell>
              </TableRow>
            ) : (
              roles.map((role) => (
                <TableRow key={role._id}>
                  <TableCell className="font-medium">{role.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {role.description || "-"}
                  </TableCell>
                  <TableCell className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditRole(role)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDeleteRole(role)}
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

      <RoleModal
        open={openModal}
        onClose={handleCloseModal}
        onSuccess={() => refetch()}
        role={selectedRole}
      />

      <DeleteRoleDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onSuccess={() => refetch()}
        roleId={deleteRoleId}
        roleName={deleteRoleName}
      />
    </div>
  );
}
