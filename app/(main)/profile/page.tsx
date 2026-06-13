"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/hook";
import { setAuth } from "@/features/auth/slice";
import { useGetUserById, useUpdateUser } from "@/features/user/hook";
import { RootState } from "@/store/type";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
  User,
  Lock,
  Mail,
  Shield,
  Key,
  Loader2,
  Eye,
  EyeOff,
  Phone,
  MapPin,
  CheckCircle,
  AlertCircle,
  Save,
  RefreshCw,
} from "lucide-react";
import { motion } from "framer-motion";

export default function ProfilePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { data: detailUser, refetch } = useGetUserById(user?._id || "");
  const updateUser = useUpdateUser();

  console.log("User data from Redux:", user);
  // State thông tin cá nhân
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [originalData, setOriginalData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  // State bảo mật
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Khởi tạo dữ liệu
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/login");
      return;
    }

    const activeUser = detailUser || user;
    if (activeUser) {
      const userData = {
        name: activeUser.name || "",
        email: activeUser.email || "",
        phone: activeUser.phone || "",
        address: activeUser.address || "",
      };
      /* eslint-disable react-hooks/set-state-in-effect */
      setFormData(userData);
      setOriginalData(userData);
      /* eslint-enable react-hooks/set-state-in-effect */
    }
  }, [user, detailUser, router]);

  const passwordStrength = (() => {
    if (!password) return 0;

    let strength = 0;
    if (password.length >= 6) strength += 25;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9!@#$%^&*]/.test(password)) strength += 25;
    return strength;
  })();

  if (!user) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mx-auto" />
          <p className="text-slate-500">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id.replace("profile-", "")]: e.target.value,
    });
  };

  const handleCancelEdit = () => {
    setFormData(originalData);
    setIsEditing(false);
  };

  const handleUpdateInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error("Vui lòng điền đầy đủ Tên và Email");
      return;
    }

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      address: formData.address.trim(),
    };

    try {
      const response = await updateUser.mutateAsync({
        id: user._id,
        data: payload,
      });

      const updatedUser = response.data;
      refetch();

      dispatch(
        setAuth({
          user: updatedUser,
          role: updatedUser.role?.name || "USER",
        }),
      );

      const newFormData = {
        name: updatedUser.name || "",
        email: updatedUser.email || "",
        phone: updatedUser.phone || "",
        address: updatedUser.address || "",
      };

      setFormData(newFormData);
      setOriginalData(newFormData);
      setIsEditing(false);
      toast.success("Cập nhật thông tin thành công!", {
        icon: <CheckCircle className="h-5 w-5 text-green-500" />,
      });
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Cập nhật thông tin thất bại",
        {
          icon: <AlertCircle className="h-5 w-5 text-red-500" />,
        },
      );
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password) {
      toast.error("Vui lòng nhập mật khẩu mới");
      return;
    }

    if (password.length < 6) {
      toast.error("Mật khẩu mới phải chứa ít nhất 6 ký tự");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Xác nhận mật khẩu không trùng khớp");
      return;
    }

    try {
      await updateUser.mutateAsync({
        id: user._id,
        data: { password },
      });

      toast.success("Đổi mật khẩu thành công!", {
        icon: <CheckCircle className="h-5 w-5 text-green-500" />,
      });
      setPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Đổi mật khẩu thất bại", {
        icon: <AlertCircle className="h-5 w-5 text-red-500" />,
      });
    }
  };

  const activeUser = detailUser || user;
  const userRole = (activeUser?.role?.name ||
    "USER") as keyof typeof roleColors;
  const roleColors = {
    ADMIN: "bg-gradient-to-r from-red-500 to-rose-500",
    INSTRUCTOR: "bg-gradient-to-r from-amber-500 to-orange-500",
    USER: "bg-gradient-to-r from-indigo-500 to-purple-500",
  };

  // Get avatar initial from active user (API data)
  const displayName = activeUser?.name || "U";
  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Display data helpers
  const getDisplayValue = (field: "name" | "email" | "phone" | "address") => {
    if (isEditing) {
      return formData[field];
    }
    return activeUser?.[field] || "";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Header Profile - Modern Design */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl bg-white shadow-xl shadow-indigo-100/50"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10" />
          <div className="absolute top-0 right-0 -mt-20 -mr-20 h-64 w-64 rounded-full bg-indigo-400/20 blur-3xl" />
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-64 w-64 rounded-full bg-purple-400/20 blur-3xl" />

          <div className="relative p-6 md:p-8">
            <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
              {/* Avatar */}
              <div className="relative group">
                <div
                  className={`absolute inset-0 rounded-2xl ${roleColors[userRole]} opacity-75 blur-md group-hover:opacity-100 transition-opacity duration-300`}
                />
                <Avatar className="h-28 w-28 rounded-2xl ring-4 ring-white shadow-xl">
                  <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-3xl font-bold text-white">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <button className="absolute bottom-0 right-0 rounded-full bg-white p-1.5 shadow-lg hover:bg-slate-50 transition-all">
                  <RefreshCw className="h-3 w-3 text-indigo-600" />
                </button>
              </div>

              {/* User Info */}
              <div className="flex-1 space-y-3 text-center md:text-left">
                <div className="flex flex-col items-center gap-3 md:flex-row md:items-start">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
                      {getDisplayValue("name")}
                    </h1>
                    <p className="text-slate-500 text-sm mt-1 flex items-center gap-2 justify-center md:justify-start">
                      <Mail className="h-4 w-4" />
                      {getDisplayValue("email")}
                    </p>
                  </div>
                  <Badge
                    className={`${roleColors[userRole]} text-white border-0 px-3 py-1 text-xs font-semibold`}
                  >
                    <Shield className="h-3 w-3 mr-1" />
                    {userRole === "ADMIN"
                      ? "Quản trị viên"
                      : userRole === "INSTRUCTOR"
                        ? "Giảng viên"
                        : "Học viên"}
                  </Badge>
                </div>

                {/* Stats */}
                <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Đã xác thực</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs - Chỉ còn 2 tab */}
        <Tabs defaultValue="account" className="w-full flex-col">
          <TabsList className="grid w-full grid-cols-2 max-w-md bg-white/80 backdrop-blur-sm border shadow-sm p-1 rounded-2xl mb-6 mx-auto">
            <TabsTrigger
              value="account"
              className="rounded-xl py-2.5 font-semibold transition-all data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg"
            >
              <User className="mr-2 h-4 w-4" />
              Thông tin cá nhân
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="rounded-xl py-2.5 font-semibold transition-all data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg"
            >
              <Lock className="mr-2 h-4 w-4" />
              Bảo mật
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Thông tin cá nhân */}
          <TabsContent value="account">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl overflow-hidden p-0">
                <CardHeader className="border-b bg-gradient-to-r from-indigo-50/50 to-purple-50/50 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl font-bold text-slate-800">
                        Thông tin cá nhân
                      </CardTitle>
                      <CardDescription className="text-slate-500 mt-1">
                        Quản lý thông tin cơ bản của tài khoản
                      </CardDescription>
                    </div>
                    {!isEditing && (
                      <Button
                        variant="outline"
                        onClick={() => setIsEditing(true)}
                        className="rounded-full"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Chỉnh sửa
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <form onSubmit={handleUpdateInfo} className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      {/* Họ và tên */}
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                          <User className="h-4 w-4 text-indigo-500" />
                          Họ và tên
                        </Label>
                        {!isEditing ? (
                          <div className="h-12 rounded-xl border border-slate-200 bg-slate-50 flex items-center px-4 text-slate-700">
                            {getDisplayValue("name") || "--"}
                          </div>
                        ) : (
                          <Input
                            id="profile-name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="h-12 rounded-xl border-slate-200 focus:ring-2 focus:ring-indigo-500 transition-all"
                            placeholder="Nhập họ và tên"
                          />
                        )}
                      </div>

                      {/* Email */}
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                          <Mail className="h-4 w-4 text-indigo-500" />
                          Email
                        </Label>
                        {!isEditing ? (
                          <div className="h-12 rounded-xl border border-slate-200 bg-slate-50 flex items-center px-4 text-slate-700">
                            {getDisplayValue("email") || "--"}
                          </div>
                        ) : (
                          <Input
                            id="profile-email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="h-12 rounded-xl border-slate-200 focus:ring-2 focus:ring-indigo-500 transition-all"
                            placeholder="example@email.com"
                          />
                        )}
                      </div>

                      {/* Số điện thoại */}
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                          <Phone className="h-4 w-4 text-indigo-500" />
                          Số điện thoại
                        </Label>
                        {!isEditing ? (
                          <div className="h-12 rounded-xl border border-slate-200 bg-slate-50 flex items-center px-4 text-slate-700">
                            {getDisplayValue("phone") || "--"}
                          </div>
                        ) : (
                          <Input
                            id="profile-phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="h-12 rounded-xl border-slate-200 focus:ring-2 focus:ring-indigo-500 transition-all"
                            placeholder="Nhập số điện thoại"
                          />
                        )}
                      </div>

                      {/* Địa chỉ */}
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-indigo-500" />
                          Địa chỉ
                        </Label>
                        {!isEditing ? (
                          <div className="h-12 rounded-xl border border-slate-200 bg-slate-50 flex items-center px-4 text-slate-700">
                            {getDisplayValue("address") || "--"}
                          </div>
                        ) : (
                          <Input
                            id="profile-address"
                            value={formData.address}
                            onChange={handleInputChange}
                            className="h-12 rounded-xl border-slate-200 focus:ring-2 focus:ring-indigo-500 transition-all"
                            placeholder="Nhập địa chỉ"
                          />
                        )}
                      </div>
                    </div>

                    {isEditing && (
                      <div className="flex justify-end gap-3 pt-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleCancelEdit}
                          className="rounded-full px-6"
                        >
                          Hủy
                        </Button>
                        <Button
                          type="submit"
                          disabled={updateUser.isPending}
                          className="rounded-full px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all"
                        >
                          {updateUser.isPending ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              Đang lưu...
                            </>
                          ) : (
                            <>
                              <Save className="h-4 w-4 mr-2" />
                              Lưu thay đổi
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Tab 2: Bảo mật */}
          <TabsContent value="security">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl overflow-hidden p-0">
                <CardHeader className="border-b bg-gradient-to-r from-indigo-50/50 to-purple-50/50 p-6">
                  <CardTitle className="text-xl font-bold text-slate-800">
                    Bảo mật tài khoản
                  </CardTitle>
                  <CardDescription className="text-slate-500">
                    Tăng cường bảo mật cho tài khoản của bạn
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-8">
                  {/* Đổi mật khẩu */}
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                      <Key className="h-5 w-5 text-indigo-500" />
                      Đổi mật khẩu
                    </h3>
                    <form onSubmit={handleChangePassword} className="space-y-6">
                      <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Mật khẩu mới</Label>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              className="h-12 rounded-xl pr-12"
                              placeholder="Nhập mật khẩu mới"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                          {password && (
                            <div className="space-y-1 mt-2">
                              <div className="flex justify-between text-xs">
                                <span>Độ mạnh mật khẩu</span>
                                <span className="font-semibold">
                                  {passwordStrength === 100
                                    ? "Rất mạnh"
                                    : passwordStrength >= 75
                                      ? "Mạnh"
                                      : passwordStrength >= 50
                                        ? "Trung bình"
                                        : "Yếu"}
                                </span>
                              </div>
                              <Progress
                                value={passwordStrength}
                                className="h-1.5"
                              />
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label>Xác nhận mật khẩu</Label>
                          <div className="relative">
                            <Input
                              type={showConfirmPassword ? "text" : "password"}
                              value={confirmPassword}
                              onChange={(e) =>
                                setConfirmPassword(e.target.value)
                              }
                              className="h-12 rounded-xl pr-12"
                              placeholder="Nhập lại mật khẩu mới"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                          {confirmPassword && password !== confirmPassword && (
                            <p className="text-xs text-red-500 mt-1">
                              Mật khẩu không khớp
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <Button
                          type="submit"
                          disabled={
                            updateUser.isPending || passwordStrength < 50
                          }
                          className="rounded-full px-8 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                        >
                          {updateUser.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            "Cập nhật mật khẩu"
                          )}
                        </Button>
                      </div>
                    </form>
                  </div>

                  <Separator />
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
