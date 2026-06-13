"use client";

import { useState, useMemo } from "react";
import {
  CreditCard,
  Search,
  DollarSign,
  TrendingUp,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  Calendar,
  User,
  BookOpen,
  ArrowUpDown,
  Loader2,
  Filter,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import { useGetAllPayments } from "@/features/payment/hook";
import { formatVND } from "@/hooks/formatVND";
import { IPayment } from "@/types/api";

type StatusType = "ALL" | "SUCCESS" | "PENDING" | "CANCELLED" | "FAILED";

export default function PaymentsAdminPage() {
  const { data: payments, isLoading, isError, refetch } = useGetAllPayments();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusType>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const itemsPerPage = 10;

  // Lọc và Tìm kiếm dữ liệu
  const filteredPayments = useMemo(() => {
    if (!payments) return [];

    return payments.filter((payment) => {
      // Lọc theo trạng thái
      const matchesStatus =
        statusFilter === "ALL" || payment.status === statusFilter;

      // Lọc theo từ khóa tìm kiếm (mã đơn hàng, tên học viên, email học viên)
      const buyerName = payment.user?.name || "";
      const buyerEmail = payment.user?.email || "";
      const orderCodeStr = payment.orderCode?.toString() || "";
      const courseTitle = payment.courseId?.title || "";

      const matchesSearch =
        buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        buyerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        orderCodeStr.includes(searchTerm) ||
        courseTitle.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesStatus && matchesSearch;
    });
  }, [payments, searchTerm, statusFilter]);

  // Phân trang
  const paginatedPayments = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredPayments.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredPayments, currentPage]);

  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);

  // Thống kê số liệu (Dựa trên toàn bộ danh sách payments gốc)
  const stats = useMemo(() => {
    if (!payments) {
      return {
        totalRevenue: 0,
        totalOrders: 0,
        successOrders: 0,
        pendingOrders: 0,
      };
    }

    const totalOrders = payments.length;
    const successOrders = payments.filter((p) => p.status === "SUCCESS").length;
    const pendingOrders = payments.filter((p) => p.status === "PENDING").length;
    const totalRevenue = payments
      .filter((p) => p.status === "SUCCESS")
      .reduce((sum, p) => sum + p.amount, 0);

    return {
      totalRevenue,
      totalOrders,
      successOrders,
      pendingOrders,
    };
  }, [payments]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "SUCCESS":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Thành công
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 animate-pulse">
            <Clock className="w-3.5 h-3.5" />
            Đang chờ
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
            <XCircle className="w-3.5 h-3.5" />
            Đã hủy
          </span>
        );
      case "FAILED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertCircle className="w-3.5 h-3.5" />
            Thất bại
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
            {status}
          </span>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-3">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
        <p className="text-gray-500 font-medium text-sm">
          Đang tải dữ liệu thanh toán...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
        <div className="p-4 rounded-full bg-red-50 text-red-500">
          <XCircle className="w-12 h-12" />
        </div>
        <h3 className="text-lg font-bold text-gray-900">
          Không thể kết nối API
        </h3>
        <p className="text-gray-500 max-w-sm text-center">
          Đã có lỗi xảy ra khi tải dữ liệu thanh toán từ máy chủ. Vui lòng thử
          lại.
        </p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition shadow"
        >
          Tải lại dữ liệu
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 max-w-8xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2.5">
            <CreditCard className="w-8 h-8 text-indigo-600" />
            Quản lý Thanh toán
          </h1>
          <p className="text-slate-500 mt-1">
            Theo dõi hóa đơn, đơn hàng và doanh thu của hệ thống SmartEdu.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-indigo-600 transition shadow-sm text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw
            className={`w-4 h-4 ${isRefreshing ? "animate-spin text-indigo-600" : ""}`}
          />
          {isRefreshing ? "Đang đồng bộ..." : "Làm mới dữ liệu"}
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* KPI 1: Doanh thu */}
        <div className="relative overflow-hidden bg-white p-6 rounded-2xl border border-slate-100 shadow-sm transition hover:shadow-md">
          <div className="absolute top-0 right-0 p-6 opacity-10">
            <DollarSign className="w-20 h-20 text-emerald-600" />
          </div>
          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-emerald-50 rounded-xl text-emerald-600 border border-emerald-100">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Tổng doanh thu
              </p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">
                {formatVND(stats.totalRevenue)}
              </h3>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Doanh thu từ các đơn hàng thành công</span>
          </div>
        </div>

        {/* KPI 2: Tổng số đơn */}
        <div className="relative overflow-hidden bg-white p-6 rounded-2xl border border-slate-100 shadow-sm transition hover:shadow-md">
          <div className="absolute top-0 right-0 p-6 opacity-10">
            <CreditCard className="w-20 h-20 text-indigo-600" />
          </div>
          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-indigo-50 rounded-xl text-indigo-600 border border-indigo-100">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Tổng số đơn hàng
              </p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">
                {stats.totalOrders}{" "}
                <span className="text-sm font-normal text-slate-400">
                  giao dịch
                </span>
              </h3>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs text-indigo-600 font-medium">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Tất cả trạng thái thanh toán</span>
          </div>
        </div>

        {/* KPI 3: Đơn thành công */}
        <div className="relative overflow-hidden bg-white p-6 rounded-2xl border border-slate-100 shadow-sm transition hover:shadow-md">
          <div className="absolute top-0 right-0 p-6 opacity-10">
            <CheckCircle2 className="w-20 h-20 text-teal-600" />
          </div>
          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-teal-50 rounded-xl text-teal-600 border border-teal-100">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Thành công
              </p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">
                {stats.successOrders}{" "}
                <span className="text-sm font-normal text-slate-400">
                  giao dịch
                </span>
              </h3>
            </div>
          </div>
          <div className="mt-4 text-xs text-slate-500">
            Tỉ lệ hoàn thành:{" "}
            <span className="font-semibold text-teal-600">
              {stats.totalOrders > 0
                ? ((stats.successOrders / stats.totalOrders) * 100).toFixed(1)
                : 0}
              %
            </span>
          </div>
        </div>

        {/* KPI 4: Đơn đang chờ */}
        <div className="relative overflow-hidden bg-white p-6 rounded-2xl border border-slate-100 shadow-sm transition hover:shadow-md">
          <div className="absolute top-0 right-0 p-6 opacity-10">
            <Clock className="w-20 h-20 text-amber-600" />
          </div>
          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-amber-50 rounded-xl text-amber-600 border border-amber-100">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Đang xử lý
              </p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">
                {stats.pendingOrders}{" "}
                <span className="text-sm font-normal text-slate-400">
                  giao dịch
                </span>
              </h3>
            </div>
          </div>
          <div className="mt-4 text-xs text-slate-500">
            Cần kiểm tra xác thực từ cổng PayOS
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo mã đơn, học viên, email, khóa học..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset page khi tìm kiếm
              }}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-slate-50/50"
            />
          </div>

          {/* Status Tabs Filter */}
          <div className="flex overflow-x-auto gap-1 p-1 bg-slate-100/80 rounded-xl self-start lg:self-center custom-scrollbar">
            {(
              [
                { value: "ALL", label: "Tất cả" },
                { value: "SUCCESS", label: "Thành công" },
                { value: "PENDING", label: "Đang chờ" },
                { value: "CANCELLED", label: "Đã hủy" },
                { value: "FAILED", label: "Thất bại" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.value}
                onClick={() => {
                  setStatusFilter(tab.value);
                  setCurrentPage(1); // Reset page khi lọc
                }}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  statusFilter === tab.value
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold text-xs tracking-wider uppercase">
                <th className="px-6 py-4">Mã đơn hàng</th>
                <th className="px-6 py-4">Học viên</th>
                <th className="px-6 py-4">Khóa học</th>
                <th className="px-6 py-4 text-right">Số tiền</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4">Nội dung / GD</th>
                <th className="px-6 py-4">Ngày tạo</th>
                <th className="px-6 py-4 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-600">
              {paginatedPayments.length > 0 ? (
                paginatedPayments.map((payment) => {
                  const course = payment.courseId;
                  const buyer = payment.user;

                  return (
                    <tr
                      key={payment._id || payment.orderCode}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      {/* Mã đơn */}
                      <td className="px-6 py-4 font-mono font-medium text-slate-900">
                        #{payment.orderCode}
                      </td>

                      {/* Học viên */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs uppercase">
                            {buyer?.name ? (
                              buyer.name.charAt(0)
                            ) : (
                              <User className="w-4 h-4" />
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800 leading-tight">
                              {buyer?.name || "Học viên ẩn danh"}
                            </p>
                            <p className="text-xs text-slate-400 mt-0.5">
                              {buyer?.email || "Chưa cập nhật email"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Khóa học */}
                      <td className="px-6 py-4 max-w-[240px]">
                        {course ? (
                          <div className="flex items-center gap-2.5">
                            {course.thumbnail && (
                              <img
                                src={course.thumbnail}
                                alt={course.title}
                                className="w-10 h-7 object-cover rounded border border-slate-100"
                              />
                            )}
                            <div className="truncate">
                              <p
                                className="font-medium text-slate-800 truncate"
                                title={course.title}
                              >
                                {course.title}
                              </p>
                              <p className="text-xs text-slate-400 mt-0.5">
                                Giá: {formatVND(Number(course.price || 0))}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">
                            Khóa học đã bị xóa
                          </span>
                        )}
                      </td>

                      {/* Số tiền thanh toán */}
                      <td className="px-6 py-4 text-right font-semibold text-slate-900">
                        {formatVND(payment.amount)}
                      </td>

                      {/* Trạng thái */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(payment.status)}
                      </td>

                      {/* Chi tiết GD */}
                      <td className="px-6 py-4 max-w-[180px] truncate">
                        <p
                          className="text-slate-700 truncate"
                          title={payment.orderInfo}
                        >
                          {payment.orderInfo || "Không có nội dung"}
                        </p>
                        {payment.transactionId && (
                          <p className="text-xs text-slate-400 font-mono mt-0.5">
                            Mã GD: {payment.transactionId}
                          </p>
                        )}
                      </td>

                      {/* Ngày tạo */}
                      <td className="px-6 py-4 text-xs text-slate-400 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-300" />
                          <span>
                            {payment.createdAt
                              ? new Date(payment.createdAt).toLocaleString(
                                  "vi-VN",
                                )
                              : "N/A"}
                          </span>
                        </div>
                      </td>

                      {/* Hành động */}
                      <td className="px-6 py-4 text-center whitespace-nowrap">
                        {payment.status === "PENDING" && payment.checkoutUrl ? (
                          <a
                            href={payment.checkoutUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-colors"
                          >
                            <span>Link thanh toán</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-xs text-slate-300">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-16 text-center">
                    <div className="max-w-md mx-auto flex flex-col items-center gap-3">
                      <div className="p-4 bg-slate-50 text-slate-400 rounded-full">
                        <CreditCard className="w-8 h-8" />
                      </div>
                      <h4 className="text-base font-bold text-slate-800">
                        Không tìm thấy đơn hàng nào
                      </h4>
                      <p className="text-slate-400 text-xs">
                        Không có dữ liệu thanh toán phù hợp với từ khóa hoặc bộ
                        lọc của bạn. Thử thay đổi điều kiện tìm kiếm.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="bg-white px-6 py-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Hiển thị{" "}
              <span className="font-semibold text-slate-800">
                {(currentPage - 1) * itemsPerPage + 1}
              </span>{" "}
              đến{" "}
              <span className="font-semibold text-slate-800">
                {Math.min(currentPage * itemsPerPage, filteredPayments.length)}
              </span>{" "}
              trong tổng số{" "}
              <span className="font-semibold text-slate-800">
                {filteredPayments.length}
              </span>{" "}
              đơn hàng.
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft className="w-4.5 h-4.5" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-lg text-xs font-semibold transition ${
                      currentPage === page
                        ? "bg-indigo-600 text-white"
                        : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {page}
                  </button>
                ),
              )}

              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ChevronRight className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
