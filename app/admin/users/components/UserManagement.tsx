"use client";

import { useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Search,
  Filter,
  BookOpen,
  Users,
  GraduationCap,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  X,
  Mail,
  Shield,
  MoreVertical,
  Calendar,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { useGetUsers } from "@/features/user/hook";
import { UserModal } from "./UserModal";
import { DeleteUserDialog } from "./DeleteUserDialog";
import { UserResponse } from "@/features/user/api";
import { useGetRoles } from "@/features/role/hook";
import { useGetCourses } from "@/features/course/hook";
import { cn } from "@/lib/utils";

export function UserManagement() {
  const [openModal, setOpenModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserResponse | undefined>();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState("");
  const [deleteUserName, setDeleteUserName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRoleId, setSelectedRoleId] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const itemsPerPage = 12;

  const { data, isLoading, refetch } = useGetUsers(0, 1000);
  const { data: rolesData } = useGetRoles();
  const { data: coursesData } = useGetCourses();

  const renderRoleName = (id: string) => {
    const role = rolesData?.find((role) => role._id === id);
    return role ? role.name : "Unknown";
  };

  const getCourseCount = (userId: string) => {
    if (!coursesData) return 0;
    return coursesData.filter((course) => {
      if (course.createBy && typeof course.createBy === "object") {
        return course.createBy._id === userId;
      }
      return (course.createBy as any) === userId;
    }).length;
  };

  const handleAddUser = () => {
    setSelectedUser(undefined);
    setOpenModal(true);
  };

  const handleEditUser = (user: UserResponse) => {
    setSelectedUser(user);
    setOpenModal(true);
    setOpenMenuId(null);
  };

  const handleDeleteUser = (user: UserResponse) => {
    setDeleteUserId(user._id);
    setDeleteUserName(user.name);
    setOpenDeleteDialog(true);
    setOpenMenuId(null);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedUser(undefined);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
        <p className="text-slate-500">Đang tải dữ liệu...</p>
      </div>
    );
  }

  const users = data?.data || [];
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRoleId === "all" || user.role === selectedRoleId;
    return matchesSearch && matchesRole;
  });

  const totalItems = filteredUsers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalUsersCount = users.length;
  const instructorsCount = users.filter(user => {
    const roleName = renderRoleName(user.role).toLowerCase();
    return roleName.includes("instructor") || roleName.includes("giảng viên");
  }).length;
  const studentsCount = users.filter(user => {
    const roleName = renderRoleName(user.role).toLowerCase();
    return roleName.includes("user") || roleName.includes("học viên");
  }).length;
  const totalCoursesCount = coursesData?.length || 0;

  return (
    <div className="space-y-6 p-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Thành viên</h1>
          <p className="text-sm text-slate-500 mt-1">Quản lý tất cả người dùng trong hệ thống</p>
        </div>
        <Button
          onClick={handleAddUser}
          className="bg-indigo-600 hover:bg-indigo-700 shadow-sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Thêm thành viên
        </Button>
      </div>

      {/* Stats - Đơn giản hóa */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-slate-800">{totalUsersCount}</p>
              <p className="text-xs text-slate-500">Tổng số</p>
            </div>
            <Users className="w-8 h-8 text-indigo-400" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-slate-800">{instructorsCount}</p>
              <p className="text-xs text-slate-500">Giảng viên</p>
            </div>
            <GraduationCap className="w-8 h-8 text-purple-400" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-slate-800">{studentsCount}</p>
              <p className="text-xs text-slate-500">Học viên</p>
            </div>
            <UserCheck className="w-8 h-8 text-emerald-400" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-slate-800">{totalCoursesCount}</p>
              <p className="text-xs text-slate-500">Khóa học</p>
            </div>
            <BookOpen className="w-8 h-8 text-orange-400" />
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-3 items-center bg-white p-3 rounded-xl shadow-sm border border-slate-200">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Tìm kiếm..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-9 bg-slate-50 border-0 focus-visible:ring-1"
          />
        </div>
        <Select
          value={selectedRoleId}
          onChange={(e) => {
            setSelectedRoleId(e.target.value);
            setCurrentPage(1);
          }}
          className="w-40 bg-slate-50 border-0"
        >
          <option value="all">Tất cả</option>
          {rolesData?.map((role) => (
            <option key={role._id} value={role._id}>{role.name}</option>
          ))}
        </Select>
      </div>

      {/* Card Grid - Thay thế bảng */}
      {paginatedUsers.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">Không tìm thấy thành viên</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {paginatedUsers.map((user) => {
              const isInstructor = renderRoleName(user.role).toLowerCase().includes("instructor") ||
                renderRoleName(user.role).toLowerCase().includes("giảng viên");
              const courseCount = getCourseCount(user._id);
              const roleName = renderRoleName(user.role);

              return (
                <div key={user._id} className="group relative">
                  <Card className="hover:shadow-md transition-all duration-200 border border-slate-200 hover:border-indigo-200">
                    <CardContent className="p-4">
                      {/* Menu dropdown */}
                      <div className="absolute top-3 right-3">
                        <button
                          onClick={() => setOpenMenuId(openMenuId === user._id ? null : user._id)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                        >
                          <MoreVertical className="w-4 h-4 text-slate-400" />
                        </button>
                        {openMenuId === user._id && (
                          <>
                            <div
                              className="fixed inset-0 z-10"
                              onClick={() => setOpenMenuId(null)}
                            />
                            <div className="absolute right-0 mt-1 w-32 bg-white rounded-lg shadow-lg border py-1 z-20">
                              <button
                                onClick={() => handleEditUser(user)}
                                className="w-full px-3 py-1.5 text-left text-sm hover:bg-slate-50 flex items-center gap-2"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                                Sửa
                              </button>
                              <button
                                onClick={() => handleDeleteUser(user)}
                                className="w-full px-3 py-1.5 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                Xóa
                              </button>
                            </div>
                          </>
                        )}
                      </div>

                      {/* Avatar */}
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center text-white font-semibold text-lg",
                          roleName.toLowerCase().includes("admin") ? "bg-gradient-to-br from-red-500 to-red-600" :
                            isInstructor ? "bg-gradient-to-br from-purple-500 to-purple-600" :
                              "bg-gradient-to-br from-indigo-500 to-indigo-600"
                        )}>
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-slate-800 truncate">{user.name}</h3>
                          <p className="text-xs text-slate-400 truncate flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {user.email}
                          </p>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="mt-3 pt-3 border-t">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline" className={cn(
                            "text-xs",
                            roleName.toLowerCase().includes("admin") ? "border-red-200 text-red-700 bg-red-50" :
                              isInstructor ? "border-purple-200 text-purple-700 bg-purple-50" :
                                "border-indigo-200 text-indigo-700 bg-indigo-50"
                          )}>
                            {roleName}
                          </Badge>
                          {isInstructor && (
                            <span className="text-xs text-slate-500 flex items-center gap-1">
                              <BookOpen className="w-3 h-3" />
                              {courseCount} khóa
                            </span>
                          )}
                        </div>

                        {/* Progress for instructors */}
                        {isInstructor && courseCount > 0 && (
                          <div className="mt-2">
                            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-indigo-500 rounded-full transition-all"
                                style={{ width: `${Math.min((courseCount / 10) * 100, 100)}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4">
              <p className="text-sm text-slate-500">
                {Math.min(totalItems, (currentPage - 1) * itemsPerPage + 1)} - {Math.min(totalItems, currentPage * itemsPerPage)} / {totalItems}
              </p>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="h-8 w-8 p-0"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="px-3 py-1 text-sm text-slate-600">
                  Trang {currentPage} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="h-8 w-8 p-0"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}

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