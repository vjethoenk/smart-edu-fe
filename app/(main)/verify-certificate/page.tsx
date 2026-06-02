"use client";

import React, { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useVerifyCertificate } from "@/features/certificate/hook";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  ShieldCheck,
  AlertTriangle,
  Loader2,
  Search,
  ArrowLeft,
  Calendar,
  User,
  BookOpen,
  Award,
  ExternalLink,
} from "lucide-react";

function VerifyCertificateContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const code = searchParams.get("code") || "";

  const [inputCode, setInputCode] = useState(code);

  const { data, isLoading, isError, error } = useVerifyCertificate(code);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCode.trim()) {
      router.push(`/verify-certificate?code=${encodeURIComponent(inputCode.trim())}`);
    }
  };

  const certificate = data?.data;

  // View state when no code is provided yet
  if (!code) {
    return (
      <div className="max-w-md mx-auto py-12 px-4">
        <Card className="rounded-3xl border border-indigo-100 shadow-xl overflow-hidden bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-3">
              <Award className="w-7 h-7" />
            </div>
            <CardTitle className="text-xl font-bold text-slate-800">Xác thực Chứng chỉ</CardTitle>
            <CardDescription className="text-slate-500">
              Nhập mã chứng chỉ SmartEdu để kiểm tra tính hợp lệ.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="relative">
                <Input
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  placeholder="Ví dụ: SE-2026-4829-9182"
                  className="pl-10 pr-4 py-6 rounded-2xl border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 font-mono text-sm tracking-wider"
                />
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              </div>
              <Button
                type="submit"
                className="w-full py-6 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 font-semibold text-white shadow-lg shadow-indigo-200 transition-all duration-300"
              >
                Tra cứu
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-12 px-4 space-y-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => router.push("/")}
        className="text-slate-500 hover:text-slate-800 rounded-full pl-2 hover:bg-slate-100/50"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Quay về Trang chủ
      </Button>

      {/* Loading state */}
      {isLoading && (
        <Card className="rounded-3xl border border-slate-100 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardContent className="h-64 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
            <p className="text-slate-600 font-medium animate-pulse">
              Đang xác thực thông tin chứng chỉ...
            </p>
          </CardContent>
        </Card>
      )}

      {/* Success/Valid state */}
      {!isLoading && !isError && certificate?.isValid && (
        <Card className="rounded-3xl border-2 border-emerald-500/20 shadow-xl overflow-hidden bg-white/95 backdrop-blur-sm animate-in fade-in zoom-in duration-300">
          {/* Header Banner */}
          <div className="bg-emerald-50 border-b border-emerald-100 px-6 py-8 text-center space-y-2">
            <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-200 animate-bounce">
              <ShieldCheck className="w-9 h-9 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-emerald-800">
              Chứng chỉ hợp lệ
            </h2>
            <p className="text-emerald-600 text-sm">
              Chứng chỉ này đã được xác thực chính thức bởi hệ thống SmartEdu
            </p>
          </div>

          <CardContent className="p-6 md:p-8 space-y-6">
            <div className="space-y-4">
              {/* Student Name */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 flex-shrink-0 mt-0.5">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Học viên được cấp</p>
                  <p className="text-lg font-bold text-slate-800">
                    {certificate.studentName}
                  </p>
                </div>
              </div>

              {/* Course Title */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 flex-shrink-0 mt-0.5">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Khóa học</p>
                  <p className="text-base font-semibold text-slate-800">
                    {certificate.courseTitle}
                  </p>
                </div>
              </div>

              {/* Certificate Code */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 flex-shrink-0 mt-0.5">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Mã số chứng chỉ</p>
                  <p className="font-mono text-base font-semibold text-slate-800 tracking-wider">
                    {certificate.certificateCode}
                  </p>
                </div>
              </div>

              {/* Issued At */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 flex-shrink-0 mt-0.5">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Ngày cấp</p>
                  <p className="text-base font-semibold text-slate-800">
                    {new Date(certificate.issuedAt).toLocaleDateString("vi-VN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => {
                  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
                  const base = apiBase.endsWith("/v1") ? apiBase : `${apiBase}/v1`;
                  window.open(`${base}/certificates/${certificate.certificateCode}/view`, "_blank");
                }}
                className="flex-1 py-5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-md shadow-indigo-100"
              >
                <ExternalLink className="w-4 h-4 mr-2" /> Xem ảnh chứng chỉ
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setInputCode("");
                  router.push("/verify-certificate");
                }}
                className="rounded-2xl border-slate-200 py-5"
              >
                Tra cứu mã khác
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Invalid/Error state */}
      {!isLoading && (isError || !certificate?.isValid) && (
        <Card className="rounded-3xl border-2 border-rose-500/20 shadow-xl overflow-hidden bg-white/95 backdrop-blur-sm animate-in fade-in zoom-in duration-300">
          <div className="bg-rose-50 border-b border-rose-100 px-6 py-8 text-center space-y-2">
            <div className="mx-auto w-16 h-16 rounded-full bg-rose-500 flex items-center justify-center shadow-lg shadow-rose-200">
              <AlertTriangle className="w-9 h-9 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-rose-800">
              Chứng chỉ không tồn tại hoặc bị thu hồi
            </h2>
            <p className="text-rose-600 text-sm">
              Mã chứng chỉ này không khớp với bất kỳ chứng nhận hợp lệ nào trong hệ thống của chúng tôi
            </p>
          </div>

          <CardContent className="p-6 md:p-8 space-y-4">
            <p className="text-sm text-slate-500 text-center">
              Vui lòng kiểm tra lại mã số chứng chỉ được in trên văn bản hoặc liên hệ với bộ phận hỗ trợ học viên của SmartEdu để được trợ giúp.
            </p>

            <form onSubmit={handleSearch} className="space-y-4 pt-2">
              <div className="relative">
                <Input
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  placeholder="Nhập mã chứng chỉ khác..."
                  className="pl-10 pr-4 py-6 rounded-2xl border-slate-200 focus:border-rose-500 focus:ring-rose-500 font-mono text-sm tracking-wider"
                />
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              </div>
              <div className="flex gap-2">
                <Button
                  type="submit"
                  className="flex-1 py-6 rounded-2xl bg-slate-800 hover:bg-slate-900 font-semibold text-white transition-colors"
                >
                  Kiểm tra lại
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setInputCode("");
                    router.push("/verify-certificate");
                  }}
                  className="rounded-2xl border-slate-200 px-5 py-6"
                >
                  Xóa
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function VerifyCertificatePage() {
  return (
    <div className="min-h-[85vh] bg-gradient-to-br from-slate-50 via-white to-indigo-50/20 py-12 flex items-center justify-center">
      <Suspense
        fallback={
          <div className="max-w-md mx-auto py-12 text-center space-y-3">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mx-auto" />
            <p className="text-slate-500 font-medium">Đang tải trang xác thực...</p>
          </div>
        }
      >
        <VerifyCertificateContent />
      </Suspense>
    </div>
  );
}
