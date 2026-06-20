"use client";

import { CheckCircle, ArrowRight, Home, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";

const PaymentSuccess = () => {
  const router = useRouter();

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      <div className="relative z-10 w-full max-w-md mx-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm rounded-2xl overflow-hidden p-0">
          <CardHeader className="text-center pb-4 pt-8">
            <div className="relative flex justify-center mb-6">
              <div className="absolute inset-0 flex justify-center">
                <div className="w-20 h-20 bg-green-100 rounded-full animate-ping opacity-75"></div>
              </div>
              <div className="relative bg-gradient-to-br from-green-400 to-green-600 rounded-full p-4 shadow-lg animate-bounce">
                <CheckCircle
                  className="w-12 h-12 text-white"
                  strokeWidth={1.5}
                />
              </div>
            </div>

            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Thành công!
            </CardTitle>
          </CardHeader>

          <CardContent className="text-center pb-8">
            <p className="text-gray-600 text-base leading-relaxed">
              Cảm ơn bạn đã đăng ký khóa học.
              <br />
              Chúc bạn học tập vui vẻ và hiệu quả!
            </p>

            <div className="flex justify-center gap-1 mt-4">
              {[...Array(3)].map((_, i) => (
                <Sparkles
                  key={i}
                  className="w-4 h-4 text-yellow-400 animate-pulse"
                  style={{ animationDelay: `${i * 0.2}s` }}
                  fill="currentColor"
                />
              ))}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-3 pb-8 pt-0 px-6 border-0">
            <Button
              onClick={() => router.push("/course")}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-medium py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 gap-2 group"
            >
              <span>Vào học ngay</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/")}
              className="w-full border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-600 font-medium py-2.5 rounded-xl gap-2 group"
            >
              <Home className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span>Về trang chủ</span>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default PaymentSuccess;
