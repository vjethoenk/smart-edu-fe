"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGetMyCertificates } from "@/features/certificate/hook";
import { ICertificate } from "@/features/certificate/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Award,
  Eye,
  Calendar,
  Hash,
  CheckCircle,
  Copy,
  ExternalLink,
  Search,
  X,
  Sparkles,
  Shield,
  Share2,
  Grid3x3,
  List,
  GraduationCap,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// ─── Certificate Card (Grid View) ─────────────────────────────────────────────

function CertificateCardGrid({
  cert,
  index,
  onView,
}: {
  cert: ICertificate;
  index: number;
  onView: (cert: ICertificate) => void;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(cert.certificateCode);
    setCopied(true);
    toast.success("Đã sao chép mã giấy khen!");
    setTimeout(() => setCopied(false), 2000);
  };

  const issuedDate = new Date(cert.issuedAt).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      className="group"
    >
      <div className="relative h-full bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-indigo-50">
        <div className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-xl flex items-center justify-center">
                <Award className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 text-sm line-clamp-1 max-w-[180px]">
                  {cert.courseId?.title || "Khóa học"}
                </h3>
                <Badge
                  variant="secondary"
                  className="mt-1 text-xs bg-indigo-50 text-indigo-700 border-0 px-2 py-0"
                >
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Hoàn thành
                </Badge>
              </div>
            </div>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-xs">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-600">{issuedDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Hash className="w-3.5 h-3.5 text-slate-400" />
              <code className="text-xs font-mono text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded flex-1 truncate">
                {cert.certificateCode}
              </code>
              <button
                onClick={handleCopy}
                className="text-slate-400 hover:text-indigo-500 transition-colors"
              >
                {copied ? (
                  <CheckCircle className="w-3.5 h-3.5 text-indigo-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              className="flex-1 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white text-xs h-9 shadow-sm"
              onClick={() => onView(cert)}
            >
              <Eye className="w-3.5 h-3.5 mr-1" />
              Xem giấy khen
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="rounded-xl border-indigo-200 hover:border-indigo-300 hover:bg-indigo-50 h-9 px-3"
              onClick={() => {
                const apiBase =
                  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081";
                const base = apiBase.endsWith("/v1")
                  ? apiBase
                  : `${apiBase}/v1`;
                window.open(
                  `${base}/certificates/${cert.certificateCode}/view`,
                  "_blank",
                );
              }}
            >
              <ExternalLink className="w-3.5 h-3.5 text-indigo-500" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Certificate Card (List View) ─────────────────────────────────────────────

function CertificateCardList({
  cert,
  index,
  onView,
}: {
  cert: ICertificate;
  index: number;
  onView: (cert: ICertificate) => void;
}) {
  const issuedDate = new Date(cert.issuedAt).toLocaleDateString("vi-VN");

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
      className="group"
    >
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-indigo-50 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-xl flex items-center justify-center flex-shrink-0">
              <Award className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-slate-800 text-sm line-clamp-1">
                {cert.courseId?.title || "Khóa học"}
              </h3>
              <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {issuedDate}
                </span>
                <span className="flex items-center gap-1">
                  <Hash className="w-3 h-3" />
                  <code className="font-mono">
                    {cert.certificateCode.slice(0, 16)}...
                  </code>
                </span>
                <Badge className="bg-indigo-50 text-indigo-700 border-0 text-xs">
                  Đã hoàn thành
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              className="h-8 rounded-lg bg-indigo-600 hover:bg-indigo-700"
              onClick={() => onView(cert)}
            >
              <Eye className="w-3.5 h-3.5 mr-1" />
              Xem
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-8 rounded-lg border-indigo-200 hover:bg-indigo-50"
              onClick={() => {
                const apiBase =
                  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081";
                const base = apiBase.endsWith("/v1")
                  ? apiBase
                  : `${apiBase}/v1`;
                window.open(
                  `${base}/certificates/${cert.certificateCode}/view`,
                  "_blank",
                );
              }}
            >
              <ExternalLink className="w-3.5 h-3.5 text-indigo-500" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Certificate Viewer Modal (Responsive) ────────────────────────────────────

function CertificateModal({
  cert,
  onClose,
}: {
  cert: ICertificate;
  onClose: () => void;
}) {
  const [iframeLoading, setIframeLoading] = useState(true);

  const apiBase = (
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081"
  ).replace(/\/+$/, "");
  const certViewUrl = `${apiBase}/v1/certificates/${cert.certificateCode}/view`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-3xl bg-white rounded-2xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-indigo-100 px-5 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-slate-800 truncate">
                {cert.courseId?.title}
              </h3>
              <code className="text-xs text-indigo-600 font-mono">
                {cert.certificateCode}
              </code>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <Button
                size="sm"
                variant="outline"
                className="h-8 rounded-lg text-xs border-indigo-200 hover:bg-indigo-50"
                onClick={() => {
                  const url = `${window.location.origin}/verify-certificate?code=${cert.certificateCode}`;
                  navigator.clipboard.writeText(url);
                  toast.success("Đã sao chép link xác minh!");
                }}
              >
                <Share2 className="w-3.5 h-3.5 mr-1" />
                Chia sẻ
              </Button>
              <Button
                size="sm"
                className="h-8 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-xs"
                onClick={() => window.open(certViewUrl, "_blank")}
              >
                <ExternalLink className="w-3.5 h-3.5 mr-1" />
                Mở mới
              </Button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-indigo-50 transition-colors"
              >
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>
          </div>
        </div>

        {/* Certificate Content - Responsive iframe */}
        <div
          className="relative bg-slate-100 px-8 py-4 "
          style={{ maxHeight: "calc(75vh - 80px)" }}
        >
          {iframeLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 z-10 gap-3">
              <div className="w-12 h-12 rounded-full border-3 border-indigo-200 border-t-indigo-500 animate-spin" />
              <p className="text-sm text-slate-500">Đang tải giấy khen...</p>
            </div>
          )}
          <div
            className="w-full overflow-auto"
            style={{ maxHeight: "calc(75vh - 80px)" }}
          >
            <iframe
              src={certViewUrl}
              className="w-full min-w-[600px] md:min-w-full"
              style={{ height: "calc(75vh - 80px)" }}
              title={`giấy khen - ${cert.courseId?.title}`}
              onLoad={() => setIframeLoading(false)}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Hero Banner Component ────────────────────────────────────────────────────

function HeroBanner() {
  const { data: certificates } = useGetMyCertificates();
  const totalCertificates = certificates?.length || 0;

  return (
    <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-[500px] h-[500px] bg-gradient-to-r from-indigo-400/30 to-purple-400/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-1/2 -left-1/2 w-[500px] h-[500px] bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-3xl" />
      </div>

      {/* Decorative grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
            backgroundSize: "30px 30px",
          }}
        />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * 300,
            }}
            animate={{
              y: [null, -30, 30, -30],
              x: [null, 20, -20, 20],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: Math.random() * 5 + 3,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20 lg:py-24">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center lg:text-left flex-1"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6 shadow-lg">
              <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
              <span className="text-sm font-medium text-white">
                Thành tựu học tập
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              giấy khen của tôi
            </h1>

            <p className="text-indigo-100 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Tự hào giới thiệu những thành quả bạn đã đạt được trên hành trình
              chinh phục tri thức
            </p>

            {/* Quick stats */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mt-8">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full backdrop-blur-sm">
                <Shield className="w-4 h-4 text-emerald-300" />
                <span className="text-sm text-white">Xác minh blockchain</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full backdrop-blur-sm">
                <CheckCircle className="w-4 h-4 text-emerald-300" />
                <span className="text-sm text-white">Giá trị vĩnh viễn</span>
              </div>
            </div>
          </motion.div>

          {/* Right content - Stats card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="relative"
          >
            <div className="relative group">
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-2xl blur-xl opacity-75 group-hover:opacity-100 transition duration-300" />

              {/* Main card */}
              <div className="relative bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl">
                <div className="text-center">
                  <div className="relative inline-block mb-4">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full blur-md" />
                    <div className="relative bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full p-4">
                      <GraduationCap className="w-10 h-10 text-white" />
                    </div>
                  </div>

                  <div className="mb-2">
                    <span className="text-5xl sm:text-6xl font-bold text-white">
                      {totalCertificates}
                    </span>
                  </div>

                  <p className="text-indigo-100 font-medium mb-3">
                    giấy khen đã đạt được
                  </p>

                  <div className="h-px bg-white/20 my-4" />

                  <div className="flex items-center justify-center gap-2 text-sm">
                    <TrendingUp className="w-4 h-4 text-emerald-300" />
                    <span className="text-indigo-100">Tiếp tục phát triển</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative rings */}
            <div className="absolute -top-4 -right-4 w-20 h-20 border border-white/10 rounded-full" />
            <div className="absolute -bottom-4 -left-4 w-16 h-16 border border-white/10 rounded-full" />
          </motion.div>
        </div>
      </div>

      {/* Bottom curved shape */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
        >
          <path
            d="M0 120L60 110C120 100 240 80 360 75C480 70 600 80 720 85C840 90 960 90 1080 85C1200 80 1320 70 1380 65L1440 60V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="white"
            fillOpacity="0.08"
          />
          <path
            d="M0 120L60 115C120 110 240 100 360 95C480 90 600 100 720 105C840 110 960 110 1080 105C1200 100 1320 90 1380 85L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="white"
            fillOpacity="0.05"
          />
        </svg>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function MyCertificatesPage() {
  const router = useRouter();
  const { data: certificates, isLoading, isError } = useGetMyCertificates();
  const [selectedCert, setSelectedCert] = useState<ICertificate | null>(null);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filtered = certificates?.filter(
    (c) =>
      c.courseId?.title?.toLowerCase().includes(search.toLowerCase()) ||
      c.certificateCode?.toLowerCase().includes(search.toLowerCase()),
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
        <HeroBanner />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="space-y-4 mb-8">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-80" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-56 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center px-6">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Award className="w-10 h-10 text-red-300" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">
            Không thể tải giấy khen
          </h2>
          <p className="text-slate-500 mb-6">Vui lòng thử lại sau</p>
          <Button
            onClick={() => window.location.reload()}
            className="rounded-xl bg-indigo-600 hover:bg-indigo-700"
          >
            Thử lại
          </Button>
        </div>
      </div>
    );
  }

  const isEmpty = !filtered || filtered.length === 0;

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/20">
        <HeroBanner />

        {/* Toolbar */}
        <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-indigo-100 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm theo khóa học hoặc mã..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full sm:w-80 pl-9 pr-3 py-2 bg-slate-50 border border-indigo-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white transition-all"
                  />
                </div>

                {/* View Toggle */}
                <div className="flex bg-indigo-50 rounded-xl p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-1.5 rounded-lg transition-all ${
                      viewMode === "grid"
                        ? "bg-white shadow-sm text-indigo-600"
                        : "text-indigo-400 hover:text-indigo-600"
                    }`}
                  >
                    <Grid3x3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-1.5 rounded-lg transition-all ${
                      viewMode === "list"
                        ? "bg-white shadow-sm text-indigo-600"
                        : "text-indigo-400 hover:text-indigo-600"
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Stats */}
              {certificates && certificates.length > 0 && (
                <div className="flex items-center gap-3 text-sm">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 rounded-full">
                    <Shield className="w-4 h-4 text-indigo-500" />
                    <span className="text-indigo-700 font-medium">
                      {certificates.length} giấy khen
                    </span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 rounded-full">
                    <CheckCircle className="w-4 h-4 text-indigo-500" />
                    <span className="text-indigo-700">Đã xác minh</span>
                  </div>
                  {search && filtered && (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full">
                      <span className="text-slate-600">
                        {filtered.length} kết quả
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
          {isEmpty ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16 sm:py-24"
            >
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-full flex items-center justify-center mb-4">
                <Award className="w-12 h-12 text-indigo-300" />
              </div>
              <h2 className="text-xl font-semibold text-slate-700 mb-2">
                {search ? "Không tìm thấy kết quả" : "Chưa có giấy khen nào"}
              </h2>
              <p className="text-slate-400 mb-6 max-w-md mx-auto">
                {search
                  ? `Không tìm thấy giấy khen phù hợp với "${search}"`
                  : "Hoàn thành các khóa học để nhận giấy khen"}
              </p>
              {!search && (
                <Button
                  onClick={() => router.push("/course")}
                  className="rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800"
                >
                  Khám phá khóa học
                </Button>
              )}
            </motion.div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered!.map((cert, index) => (
                <CertificateCardGrid
                  key={cert._id}
                  cert={cert}
                  index={index}
                  onView={setSelectedCert}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filtered!.map((cert, index) => (
                <CertificateCardList
                  key={cert._id}
                  cert={cert}
                  index={index}
                  onView={setSelectedCert}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedCert && (
          <CertificateModal
            cert={selectedCert}
            onClose={() => setSelectedCert(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
