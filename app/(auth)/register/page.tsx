import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Eye,
  Mail,
  Lock,
  GraduationCap,
  Rocket,
  Target,
  HeartHandshake,
} from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 font-sans">
      <div className="flex w-full max-w-5xl overflow-hidden rounded-[2rem] bg-white shadow-2xl">
        <div className="relative hidden w-1/2 flex-col justify-between bg-[#3F3DC9] p-12 text-white lg:flex">
          <div className="absolute inset-0 opacity-20 overflow-hidden">
            <div className="absolute -top-20 -left-20 h-80 w-80 rounded-full bg-blue-400 blur-3xl"></div>
            <div className="absolute top-1/2 right-0 h-64 w-64 rounded-full bg-indigo-400 blur-3xl"></div>
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-2 text-xl font-bold">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#3F3DC9]">
                <GraduationCap className="h-5 w-5" />
              </div>
              <span>Smart-Edu</span>
            </div>

            <div className="mt-20 space-y-4">
              <h1 className="text-5xl font-bold leading-tight">
                Khai phóng <br />
                <span className="text-[#98FF98]">Tiềm năng Trí tuệ.</span>
              </h1>
            </div>
          </div>
          <div className="my-8 grid grid-cols-1 gap-4 ">
            <div className="flex items-start gap-3 rounded-xl bg-white/10 p-4 backdrop-blur-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-[#3F3DC9]">
                <Rocket />
              </div>
              <div>
                <p className="font-semibold">Lộ trình học rõ ràng</p>
                <p className="text-sm text-indigo-100/80">
                  Thiết kế bài bản từ cơ bản đến nâng cao, dễ dàng theo dõi tiến
                  độ.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl bg-white/10 p-4 backdrop-blur-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-[#3F3DC9]">
                <Target />
              </div>
              <div>
                <p className="font-semibold">Học thực chiến</p>
                <p className="text-sm text-indigo-100/80">
                  Áp dụng ngay vào dự án thực tế, nâng cao kỹ năng nhanh chóng.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl bg-white/10 p-4 backdrop-blur-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-[#3F3DC9]">
                <HeartHandshake />
              </div>
              <div>
                <p className="font-semibold">Cộng đồng hỗ trợ</p>
                <p className="text-sm text-indigo-100/80">
                  Kết nối với giảng viên, mentor và học viên khác để cùng phát
                  triển.
                </p>
              </div>
            </div>
          </div>

          <div className="relative z-10 flex items-center gap-3 ">
            <div className="flex -space-x-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-10 w-10 rounded-full border-2 border-[#3F3DC9] bg-gray-300 overflow-hidden"
                >
                  <img
                    src={`https://i.pravatar.cc/150?u=${i}`}
                    alt="người dùng"
                  />
                </div>
              ))}
            </div>
            <p className="text-sm font-medium text-indigo-100">
              Hơn 12,000+ học viên đã tham gia
            </p>
          </div>
        </div>

        <div className="w-full px-8 py-16 lg:w-1/2 lg:px-16">
          <div className="mx-auto max-w-sm space-y-8">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-gray-900">
                Tạo tài khoản mới
              </h2>
              <p className="text-sm text-gray-500">
                Bắt đầu hành trình chinh phục tri thức cùng chúng tôi!
              </p>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                  Họ và tên
                </Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Nguyễn Văn A"
                    className="h-14 rounded-2xl border-none bg-[#F3F4F6] pl-12 placeholder:text-gray-400 focus-visible:ring-indigo-600"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                  ĐỊA CHỈ EMAIL
                </Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="ten.ban@academy.com"
                    className="h-14 rounded-2xl border-none bg-[#F3F4F6] pl-12 placeholder:text-gray-400 focus-visible:ring-indigo-600"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                    MẬT KHẨU
                  </Label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <Input
                    type="password"
                    placeholder="••••••••••••"
                    className="h-14 rounded-2xl border-none bg-[#F3F4F6] pl-12 pr-12 placeholder:text-gray-400 focus-visible:ring-indigo-600"
                  />
                  <Eye className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 cursor-pointer" />
                </div>
              </div>

              <Button className="h-14 w-full rounded-2xl bg-[#3F3DC9] text-lg font-semibold shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 cursor-pointer">
                Đăng kí ngay
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200"></span>
              </div>
              <div className="relative flex justify-center text-[10px] font-bold tracking-widest uppercase">
                <span className="bg-white px-4 text-gray-400">
                  HOẶC ĐĂNG KÍ QUA
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="h-12 gap-2 rounded-xl border-gray-200 bg-[#F3F4F6] hover:bg-gray-100"
              >
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  className="h-5 w-5"
                  alt="Google"
                />
                <span className="font-semibold text-gray-700">Google</span>
              </Button>
              <Button
                variant="outline"
                className="h-12 gap-2 rounded-xl border-gray-200 bg-[#F3F4F6] hover:bg-gray-100 text-gray-700"
              >
                <img
                  src="https://www.svgrepo.com/show/512317/github-142.svg"
                  className="h-5 w-5"
                  alt="GitHub"
                />
                <span className="font-semibold">Github</span>
              </Button>
            </div>

            <p className="text-center text-sm text-gray-500">
              Đã có tài khoản?{" "}
              <Link
                href="/login"
                className="font-bold text-indigo-600 hover:underline"
              >
                Đăng nhập
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
