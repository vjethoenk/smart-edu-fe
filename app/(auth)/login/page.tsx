"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const { mutate, isPending } = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      // Lưu vào localStorage
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("user_role", data.role);

      // Điều hướng người dùng
      if (data.role === "admin") {
        router.push("/admin/admin-dashboard");
      } else {
        router.push("/dashboard");
      }

      // Force reload nhẹ để các component khác nhận diện role mới nếu cần
      router.refresh();
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || "Đăng nhập thất bại");
    },
  });

  return (
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          mutate(formData);
        }}
        className="p-8 bg-white border rounded-xl shadow-sm w-full max-w-sm space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">Smart-Edu</h2>
        <Input
          type="email"
          placeholder="Email"
          required
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <Input
          type="password"
          placeholder="Mật khẩu"
          required
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />
        <Button className="w-full" disabled={isPending}>
          {isPending ? "Đang xử lý..." : "Đăng nhập"}
        </Button>
      </form>
    </div>
  );
}
