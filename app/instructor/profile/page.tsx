"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/type";
import { useGetUserById, useUpdateUser } from "@/features/user/hook";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Mail,
  Shield,
  User,
  Phone,
  MapPin,
  Edit,
  Key,
  CheckCircle,
} from "lucide-react";

export default function InstructorProfilePage() {
  const router = useRouter();
  const updateUser = useUpdateUser();
  const { user, role, isInitializing } = useSelector(
    (state: RootState) => state.auth,
  );
  const { data: detailUser, refetch } = useGetUserById(user?._id || "");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    // Chờ khởi tạo auth hoàn tất
    if (isInitializing) return;

    if (!user) {
      router.push("/login");
      return;
    }

    const activeUser = detailUser || user;
    setProfileForm({
      name: activeUser.name || "",
      email: activeUser.email || "",
      phone: activeUser.phone || "",
      address: activeUser.address || "",
    });
  }, [user, detailUser, router, isInitializing]);

  const handleProfileChange = (field: string, value: string) => {
    setProfileForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!profileForm.name.trim() || !profileForm.email.trim()) {
      toast.error("Vui lòng nhập tên và email");
      return;
    }

    try {
      if (!user) return;

      const response = await updateUser.mutateAsync({
        id: user._id,
        data: {
          name: profileForm.name.trim(),
          email: profileForm.email.trim(),
          phone: profileForm.phone.trim(),
          address: profileForm.address.trim(),
        },
      });

      const updatedUser = response.data;
      refetch();

      setProfileForm({
        name: updatedUser.name || "",
        email: updatedUser.email || "",
        phone: updatedUser.phone || "",
        address: updatedUser.address || "",
      });
      toast.success("Cập nhật hồ sơ thành công");
      setIsEditOpen(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Cập nhật hồ sơ thất bại");
    }
  };

  const handleChangePasswordSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!password.trim() || !confirmPassword.trim()) {
      toast.error("Vui lòng nhập mật khẩu mới và xác nhận");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Mật khẩu và xác nhận phải trùng khớp");
      return;
    }

    if (password.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    try {
      if (!user) return;

      await updateUser.mutateAsync({
        id: user._id,
        data: {
          password: password.trim(),
        },
      });

      toast.success("Đổi mật khẩu thành công");
      setPassword("");
      setConfirmPassword("");
      setIsPasswordOpen(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Đổi mật khẩu thất bại");
    }
  };

  if (isInitializing || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 mx-auto border-2 border-slate-200 border-t-slate-600 rounded-full animate-spin" />
          <p className="text-sm text-slate-500">Đang tải...</p>
        </div>
      </div>
    );
  }

  const roleConfig = {
    ADMIN: { label: "Quản trị viên", icon: Shield, color: "slate" },
    INSTRUCTOR: { label: "Giảng viên", icon: User, color: "blue" },
    USER: { label: "Người dùng", icon: User, color: "emerald" },
  };

  const currentRole =
    roleConfig[role as keyof typeof roleConfig] || roleConfig.USER;
  const RoleIcon = currentRole.icon;
  const displayUser = detailUser || user;
  const displayName = displayUser.name || "Instructor";
  const displayEmail = displayUser.email || "instructor@smartedu.com";
  const initials = displayName
    .split(" ")
    .map((n: any) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const infoSections = [
    {
      title: "Thông tin cơ bản",
      items: [
        { label: "Họ và tên", value: displayName, icon: User },
        { label: "Email", value: displayEmail, icon: Mail },
        { label: "Vai trò", value: currentRole.label, icon: Shield },
      ],
    },
    {
      title: "Thông tin liên hệ",
      items: [
        ...(displayUser.phone
          ? [{ label: "Số điện thoại", value: displayUser.phone, icon: Phone }]
          : []),
        ...(displayUser.address
          ? [{ label: "Địa chỉ", value: displayUser.address, icon: MapPin }]
          : []),
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-8xl mx-auto px-6 py-12">
        {/* Profile Header */}
        <div className="text-center mb-12">
          <div className="inline-flex mb-6">
            <div className="relative">
              <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center shadow-sm">
                <span className="text-3xl font-medium text-slate-600">
                  {initials}
                </span>
              </div>
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
              </div>
            </div>
          </div>
          <h1 className="text-2xl font-semibold text-slate-800 mb-1">
            {displayName}
          </h1>
          <div className="flex items-center justify-center gap-2">
            <RoleIcon className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-sm text-slate-500">{currentRole.label}</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Thông tin chi tiết */}
          <div className="grid gap-6 md:grid-cols-2">
            {infoSections.map((section, idx) => (
              <Card key={idx} className="border-0 shadow-sm">
                <CardHeader className="pb-3 px-6 pt-6">
                  <CardTitle className="text-base font-medium text-slate-700">
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 px-6 pb-6">
                  {section.items.length > 0 ? (
                    section.items.map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="mt-0.5">
                          <item.icon className="h-4 w-4 text-slate-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-slate-400 mb-0.5">
                            {item.label}
                          </p>
                          <p className="text-sm text-slate-700 break-words">
                            {item.value}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-400 text-center py-4">
                      Chưa có thông tin
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Hành động */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3 px-6 pt-6">
              <CardTitle className="text-base font-medium text-slate-700">
                Hành động
              </CardTitle>
              <CardDescription className="text-sm text-slate-400">
                Quản lý tài khoản của bạn
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <div className="flex flex-wrap gap-3">
                <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                  <DialogTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className="border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Chỉnh sửa hồ sơ
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-xl">
                    <DialogHeader>
                      <DialogTitle>Chỉnh sửa hồ sơ</DialogTitle>
                      <DialogDescription>
                        Cập nhật thông tin cá nhân của bạn.
                      </DialogDescription>
                    </DialogHeader>
                    <form
                      onSubmit={handleEditSubmit}
                      className="grid gap-4 pt-4"
                    >
                      <div className="grid gap-2">
                        <Label htmlFor="name">Họ và tên</Label>
                        <Input
                          id="name"
                          value={profileForm.name}
                          onChange={(event) =>
                            handleProfileChange("name", event.target.value)
                          }
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profileForm.email}
                          onChange={(event) =>
                            handleProfileChange("email", event.target.value)
                          }
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="phone">Số điện thoại</Label>
                        <Input
                          id="phone"
                          value={profileForm.phone}
                          onChange={(event) =>
                            handleProfileChange("phone", event.target.value)
                          }
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="address">Địa chỉ</Label>
                        <Input
                          id="address"
                          value={profileForm.address}
                          onChange={(event) =>
                            handleProfileChange("address", event.target.value)
                          }
                        />
                      </div>
                      <DialogFooter className="pt-4">
                        <DialogClose asChild>
                          <Button type="button" variant="outline">
                            Hủy
                          </Button>
                        </DialogClose>
                        <Button
                          type="submit"
                        >
                          Lưu thay đổi
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>

                <Dialog open={isPasswordOpen} onOpenChange={setIsPasswordOpen}>
                  <DialogTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className="border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                    >
                      <Key className="h-4 w-4 mr-2" />
                      Đổi mật khẩu
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-xl">
                    <DialogHeader>
                      <DialogTitle>Đổi mật khẩu</DialogTitle>
                      <DialogDescription>
                        Nhập mật khẩu mới và xác nhận để cập nhật.
                      </DialogDescription>
                    </DialogHeader>
                    <form
                      onSubmit={handleChangePasswordSubmit}
                      className="grid gap-4 pt-4"
                    >
                      <div className="grid gap-2">
                        <Label htmlFor="password">Mật khẩu mới</Label>
                        <Input
                          id="password"
                          type="password"
                          value={password}
                          onChange={(event) => setPassword(event.target.value)}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="confirmPassword">
                          Xác nhận mật khẩu
                        </Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={confirmPassword}
                          onChange={(event) =>
                            setConfirmPassword(event.target.value)
                          }
                        />
                      </div>
                      <DialogFooter className="pt-4">
                        <DialogClose asChild>
                          <Button type="button" variant="outline">
                            Hủy
                          </Button>
                        </DialogClose>
                        <Button
                          type="submit"
                        >
                          Lưu mật khẩu
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center pt-6">
            <p className="text-xs text-slate-400">
              Thông tin được cập nhật theo dữ liệu hệ thống
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
