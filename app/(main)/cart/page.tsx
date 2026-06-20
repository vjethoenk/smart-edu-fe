"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  useGetCart,
  useGetCartTotal,
  useRemoveFromCart,
  useClearCart,
} from "@/features/cart/hook";
import {
  useCreatePayment,
  useCancelPayment,
  usePaymentStatus,
} from "@/features/payment/hook";
import { formatVND } from "@/hooks/formatVND";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Trash2,
  ShoppingCart,
  ArrowRight,
  Clock,
  Shield,
  CreditCard,
  Gift,
  XCircle,
  X,
  Smartphone,
  CheckCircle,
  Loader2,
  Lock,
  Package,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { ICartItem, IPayment } from "@/types/api";
import { useQueryClient } from "@tanstack/react-query";

// ─── Single Payment Step (bên trong Multi Modal) ─────────────────────────────

function PaymentStep({
  item,
  onPaid,
  onCancel,
}: {
  item: ICartItem;
  onPaid: (cartItemId: string) => void;
  onCancel: () => void;
}) {
  const { mutate: createPayment, isPending: isCreating } = useCreatePayment();
  const { mutate: cancelPayment } = useCancelPayment();
  const [paymentData, setPaymentData] = useState<IPayment | null>(null);
  const [error, setError] = useState(false);

  // Tự động tạo payment khi mount
  useEffect(() => {
    const courseId = item.courseId?._id;
    if (!courseId) return;
    createPayment(
      { courseId, amount: item.price },
      {
        onSuccess: (res: any) => {
          const payment = res?.data || res;
          setPaymentData(payment);
        },
        onError: () => {
          setError(true);
          toast.error(`Không thể tạo thanh toán cho "${item.courseId?.title}"`);
        },
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item._id]);

  // Poll trạng thái
  const { data: statusRes } = usePaymentStatus(paymentData?.orderCode ?? 0);
  const paymentStatus = statusRes?.data?.status;

  useEffect(() => {
    if (paymentStatus === "SUCCESS") {
      onPaid(item._id);
    }
  }, [paymentStatus, item._id, onPaid]);

  const handleCancel = () => {
    if (!paymentData?.orderCode) {
      onCancel();
      return;
    }
    cancelPayment(paymentData.orderCode, { onSuccess: () => onCancel() });
  };

  if (error) {
    return (
      <div className="flex flex-col items-center gap-3 py-6 text-center">
        <AlertCircle className="w-10 h-10 text-red-400" />
        <p className="text-gray-600 text-sm">
          Không thể tạo thanh toán cho khóa học này.
        </p>
        <Button size="sm" variant="outline" onClick={onCancel}>
          Bỏ qua
        </Button>
      </div>
    );
  }

  if (!paymentData || isCreating) {
    return (
      <div className="flex flex-col items-center gap-3 py-8">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
        <p className="text-sm text-gray-500">Đang tạo mã thanh toán...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Amount */}
      <div className="text-center">
        <p className="text-sm text-gray-500 mb-1">Số tiền cần thanh toán</p>
        <p className="text-3xl font-bold text-gray-800">
          {formatVND(item.price)}
        </p>
      </div>

      {/* QR Code */}
      <div className="flex justify-center">
        {paymentData?.qrCode ? (
          <div className="p-3 border-2 border-indigo-100 rounded-2xl bg-white shadow-inner">
            <QRCodeSVG
              value={paymentData.qrCode}
              size={196}
              level="M"
              includeMargin={false}
              fgColor="#1e1b4b"
            />
          </div>
        ) : (
          <div className="w-[196px] h-[196px] flex items-center justify-center bg-gray-50 rounded-2xl">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        )}
      </div>

      {/* Hint */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
        <p className="text-xs text-amber-800">
          <span className="font-semibold">📌 Hướng dẫn:</span> Mở app ngân hàng
          hoặc ví điện tử, chọn &quot;Quét mã QR&quot; và quét mã bên trên. Hệ
          thống tự động xác nhận sau khi nhận được thanh toán.
        </p>
      </div>

      {/* Polling indicator */}
      <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
        <Loader2 className="w-3 h-3 animate-spin" />
        <span>Đang tự động kiểm tra trạng thái...</span>
      </div>

      {/* Cancel */}
      <button
        onClick={handleCancel}
        className="w-full text-xs text-gray-400 hover:text-red-500 transition-colors py-1"
      >
        Hủy giao dịch này
      </button>
    </div>
  );
}

// ─── Multi Payment Modal ──────────────────────────────────────────────────────

function MultiPaymentModal({
  items,
  onClose,
  onAllDone,
}: {
  items: ICartItem[];
  onClose: () => void;
  onAllDone: (paidIds: string[]) => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [paidIds, setPaidIds] = useState<string[]>([]);
  const [skippedIds, setSkippedIds] = useState<string[]>([]);
  const [isDone, setIsDone] = useState(false);

  const currentItem = items[currentIndex];
  const totalPaid = paidIds.length;
  const totalItems = items.length;

  const handlePaid = useCallback(
    (cartItemId: string) => {
      const newPaidIds = [...paidIds, cartItemId];
      setPaidIds(newPaidIds);

      const nextIndex = currentIndex + 1;
      if (nextIndex >= totalItems) {
        setIsDone(true);
        onAllDone(newPaidIds);
      } else {
        setCurrentIndex(nextIndex);
      }
    },
    [paidIds, currentIndex, totalItems, onAllDone],
  );

  const handleSkip = useCallback(() => {
    setSkippedIds((prev) => [...prev, currentItem._id]);
    const nextIndex = currentIndex + 1;
    if (nextIndex >= totalItems) {
      setIsDone(true);
      onAllDone(paidIds);
    } else {
      setCurrentIndex(nextIndex);
    }
  }, [currentIndex, totalItems, currentItem, paidIds, onAllDone]);

  const handleClose = () => {
    if (!isDone && paidIds.length < totalItems) {
      if (
        !window.confirm(
          "Bạn có chắc muốn thoát? Các khóa học chưa thanh toán sẽ vẫn ở trong giỏ.",
        )
      )
        return;
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.25 }}
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* ── Header ── */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-5 text-white relative">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Thanh toán nhiều khóa học</h3>
              <p className="text-xs text-indigo-100 mt-0.5">
                {isDone
                  ? `Hoàn tất — ${totalPaid}/${totalItems} khóa học đã thanh toán`
                  : `Khóa học ${currentIndex + 1} / ${totalItems}`}
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4 bg-white/20 rounded-full h-1.5 overflow-hidden">
            <motion.div
              className="h-full bg-white rounded-full"
              initial={{ width: 0 }}
              animate={{
                width: `${isDone ? 100 : (currentIndex / totalItems) * 100}%`,
              }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* ── Course list / queue ── */}
        <div className="border-b border-gray-100 px-5 py-3 max-h-[140px] overflow-y-auto bg-gray-50/60">
          {items.map((item, idx) => {
            const isPaid = paidIds.includes(item._id);
            const isSkipped = skippedIds.includes(item._id);
            const isCurrent = idx === currentIndex && !isDone;

            return (
              <div
                key={item._id}
                className={`flex items-center gap-3 py-2 px-2 rounded-xl transition-colors ${
                  isCurrent ? "bg-indigo-50 border border-indigo-200" : ""
                }`}
              >
                {/* Status icon */}
                <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center">
                  {isPaid ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : isSkipped ? (
                    <XCircle className="w-5 h-5 text-gray-400" />
                  ) : isCurrent ? (
                    <Loader2 className="w-5 h-5 text-indigo-500 animate-spin" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                  )}
                </div>
                <img
                  src={item.courseId?.thumbnail || "/placeholder.png"}
                  alt={item.courseId?.title}
                  className="w-8 h-8 rounded-lg object-cover flex-shrink-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/placeholder.png";
                  }}
                />
                <p
                  className={`text-xs font-medium line-clamp-1 flex-1 ${
                    isCurrent
                      ? "text-indigo-700"
                      : isPaid
                        ? "text-green-700 line-through"
                        : "text-gray-600"
                  }`}
                >
                  {item.courseId?.title || "Khóa học"}
                </p>
                <span
                  className={`text-xs font-semibold flex-shrink-0 ${
                    isPaid
                      ? "text-green-600"
                      : isCurrent
                        ? "text-indigo-600"
                        : "text-gray-400"
                  }`}
                >
                  {formatVND(item.price)}
                </span>
              </div>
            );
          })}
        </div>

        {/* ── Body ── */}
        <div className="p-5">
          {isDone ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-4"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-9 h-9 text-green-500" />
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-1">
                {totalPaid > 0
                  ? "Thanh toán hoàn tất!"
                  : "Không có thanh toán nào"}
              </h4>
              <p className="text-gray-500 text-sm mb-6">
                {totalPaid > 0
                  ? `${totalPaid} khóa học đã được kích hoạt thành công.`
                  : "Bạn đã bỏ qua tất cả các bước thanh toán."}
                {skippedIds.length > 0 &&
                  ` ${skippedIds.length} khóa học bị bỏ qua.`}
              </p>
              <Button
                onClick={onClose}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold rounded-xl h-12"
              >
                Đóng
              </Button>
            </motion.div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentItem._id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {/* Course name */}
                <div className="flex items-center gap-2 mb-4 bg-gray-50 rounded-xl p-3">
                  <img
                    src={currentItem.courseId?.thumbnail || "/placeholder.png"}
                    alt={currentItem.courseId?.title}
                    className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder.png";
                    }}
                  />
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500">Đang thanh toán</p>
                    <p className="text-sm font-semibold text-gray-800 line-clamp-1">
                      {currentItem.courseId?.title || "Khóa học"}
                    </p>
                  </div>
                </div>

                <PaymentStep
                  item={currentItem}
                  onPaid={handlePaid}
                  onCancel={handleSkip}
                />
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </motion.div>
    </div>
  );
}

// ─── Single Payment QR Modal (cho "Mua ngay" từng item) ──────────────────────

function SinglePaymentModal({
  item,
  onClose,
  onPaid,
}: {
  item: ICartItem;
  onClose: () => void;
  onPaid: (cartItemId: string) => void;
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.25 }}
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-5 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Thanh toán VietQR</h3>
              <p className="text-xs opacity-90 line-clamp-1">
                {item.courseId?.title || "Khóa học"}
              </p>
            </div>
          </div>
        </div>

        <div className="p-5">
          <PaymentStep item={item} onPaid={onPaid} onCancel={onClose} />
        </div>
      </motion.div>
    </div>
  );
}

// ─── Main Cart Page ──────────────────────────────────────────────────────────

export default function CartPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const {
    data: cartItems,
    isLoading: isCartLoading,
    isError: isCartError,
  } = useGetCart();
  const { data: cartTotalData, isLoading: isTotalLoading } = useGetCartTotal();
  const { mutate: removeFromCart, isPending: isRemoving } = useRemoveFromCart();
  const { mutate: clearCart, isPending: isClearing } = useClearCart();

  // Modal state
  const [multiPaymentOpen, setMultiPaymentOpen] = useState(false);
  const [singlePaymentItem, setSinglePaymentItem] = useState<ICartItem | null>(
    null,
  );

  const handleRemoveItem = (id: string) => {
    removeFromCart(id, {
      onSuccess: () => toast.success("Đã xóa khóa học khỏi giỏ hàng"),
      onError: () => toast.error("Có lỗi xảy ra khi xóa khóa học"),
    });
  };

  const handleClearCart = () => {
    if (confirm("Bạn có chắc chắn muốn xóa tất cả khóa học khỏi giỏ hàng?")) {
      clearCart(undefined, {
        onSuccess: () => toast.success("Đã làm sạch giỏ hàng"),
        onError: () => toast.error("Có lỗi xảy ra khi làm sạch giỏ hàng"),
      });
    }
  };

  // Callback sau khi 1 khóa được trả tiền thành công
  const handleSinglePaid = useCallback(
    (cartItemId: string) => {
      setSinglePaymentItem(null);
      removeFromCart(cartItemId, {
        onSuccess: () => {
          toast.success(
            "🎉 Thanh toán thành công! Khóa học đã được kích hoạt.",
          );
          queryClient.invalidateQueries({ queryKey: ["enrollments"] });
          queryClient.invalidateQueries({ queryKey: ["my-courses"] });
        },
      });
    },
    [removeFromCart, queryClient],
  );

  // Callback khi multi-payment hoàn tất
  const handleMultiAllDone = useCallback(
    (paidIds: string[]) => {
      if (paidIds.length === 0) return;

      // Xóa tuần tự các item đã thanh toán
      paidIds.forEach((id) => {
        removeFromCart(id, {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["enrollments"] });
            queryClient.invalidateQueries({ queryKey: ["my-courses"] });
          },
        });
      });

      toast.success(
        `🎉 ${paidIds.length} khóa học đã được thanh toán và kích hoạt!`,
      );
    },
    [removeFromCart, queryClient],
  );

  const isLoading = isCartLoading || isTotalLoading;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Skeleton className="h-10 w-48 mb-8" />
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3 space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-36 w-full rounded-2xl" />
            ))}
          </div>
          <div className="lg:w-1/3">
            <Skeleton className="h-96 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (isCartError) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-md mx-auto">
          <div className="bg-red-50 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-12 h-12 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Không thể tải giỏ hàng
          </h2>
          <p className="text-gray-500 mb-6">
            Có lỗi xảy ra khi tải dữ liệu giỏ hàng của bạn
          </p>
          <Button
            onClick={() => window.location.reload()}
            className="rounded-full px-8"
          >
            Thử lại
          </Button>
        </div>
      </div>
    );
  }

  const isEmpty = !cartItems || cartItems.length === 0;

  if (isEmpty) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-20">
        <div className="container mx-auto px-4 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-full w-40 h-40 flex items-center justify-center mx-auto mb-8 shadow-inner">
              <ShoppingCart
                className="w-20 h-20 text-gray-400"
                strokeWidth={1.5}
              />
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-4">
              Giỏ hàng trống
            </h2>
            <p className="text-gray-500 mb-10 text-lg">
              Hãy khám phá những khóa học chất lượng cao đang chờ đón bạn
            </p>
            <Button
              size="lg"
              onClick={() => router.push("/course")}
              className="rounded-full px-10 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 h-14 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Khám phá khóa học <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  const totalDiscount = cartTotalData?.totalDiscount || 0;
  const finalTotal = (cartTotalData?.totalPrice || 0) - totalDiscount;

  return (
    <>
      <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen py-12">
        <div className="container mx-auto max-w-8xl px-12">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Giỏ hàng
              </h1>
              <p className="text-gray-500 mt-2">
                Quản lý các khóa học bạn muốn mua
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-indigo-100 px-4 py-2 rounded-full">
                <span className="text-indigo-700 font-semibold">
                  {cartItems.length} khóa học
                </span>
              </div>
              <Button
                variant="outline"
                className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 rounded-full"
                onClick={handleClearCart}
                disabled={isClearing}
              >
                <Trash2 className="w-4 h-4 mr-2" /> Xóa tất cả
              </Button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="lg:w-2/3 space-y-4">
              <AnimatePresence mode="popLayout">
                {cartItems.map((item, index) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20, height: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Card className="overflow-hidden p-0 border-0 shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300">
                      <CardContent className="p-0">
                        <div className="flex flex-col sm:flex-row">
                          {/* Image */}
                          <div className="sm:w-48 h-36 sm:h-auto relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex-shrink-0">
                            <img
                              src={
                                item.courseId?.thumbnail || "/placeholder.png"
                              }
                              alt={item.courseId?.title || "Khóa học"}
                              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  "/placeholder.png";
                              }}
                            />
                            <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors duration-300" />
                          </div>

                          {/* Details */}
                          <div className="p-5 flex-grow">
                            <div className="flex flex-col h-full">
                              <div className="flex-1">
                                <Link href={`/course/${item.courseId?._id}`}>
                                  <h3 className="font-bold text-lg text-gray-900 hover:text-indigo-600 transition-colors line-clamp-2 mb-2">
                                    {item.courseId?.title || "Khóa học chưa rõ"}
                                  </h3>
                                </Link>

                                <div className="flex items-center gap-2 mb-3">
                                  <div className="bg-green-50 px-2 py-1 rounded-lg">
                                    <span className="text-green-700 text-xs font-medium">
                                      Học trọn đời
                                    </span>
                                  </div>
                                  <div className="bg-blue-50 px-2 py-1 rounded-lg">
                                    <span className="text-blue-700 text-xs font-medium">
                                      giấy khen hoàn thành
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full"
                                  onClick={() => handleRemoveItem(item._id)}
                                  disabled={isRemoving}
                                >
                                  <Trash2 className="w-4 h-4 mr-1.5" /> Xóa
                                </Button>

                                <div className="flex items-center gap-3">
                                  <div className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                    {formatVND(item.price)}
                                  </div>
                                  {/* Nút mua từng khóa riêng lẻ */}
                                  <Button
                                    size="sm"
                                    className="rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold px-4 gap-1.5 shadow-md hover:shadow-lg transition-all"
                                    onClick={() => setSinglePaymentItem(item)}
                                  >
                                    <CreditCard className="w-3.5 h-3.5" />
                                    Mua ngay
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Checkout Sidebar */}
            <div className="lg:w-1/3">
              <div className="sticky top-28">
                <Card className="rounded-2xl border-0 shadow-xl overflow-hidden p-0">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
                    <h3 className="text-xl font-bold text-white">
                      Tổng đơn hàng
                    </h3>
                    <p className="text-indigo-100 text-sm mt-1">
                      Thông tin thanh toán chi tiết
                    </p>
                  </div>

                  <CardContent className="p-6">
                    {/* Price Breakdown */}
                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between text-gray-600">
                        <span>Tạm tính</span>
                        <span className="font-medium text-gray-900">
                          {formatVND(cartTotalData?.totalPrice || 0)}
                        </span>
                      </div>

                      <div className="flex justify-between text-gray-600">
                        <span>Số lượng khóa học</span>
                        <span className="font-medium text-gray-900">
                          {cartTotalData?.totalItems || 0}
                        </span>
                      </div>

                      {totalDiscount > 0 && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="flex justify-between bg-green-50 p-3 rounded-xl"
                        >
                          <div className="flex items-center gap-2 text-green-700">
                            <Gift className="w-4 h-4" />
                            <span>Giảm giá</span>
                          </div>
                          <span className="font-bold text-green-700">
                            -{formatVND(totalDiscount)}
                          </span>
                        </motion.div>
                      )}

                      <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-4" />

                      {/* Final Total */}
                      <div className="flex justify-between items-center pt-2">
                        <div>
                          <span className="font-bold text-gray-900 text-lg">
                            Tổng cộng
                          </span>
                          {totalDiscount > 0 && (
                            <p className="text-xs text-green-600 mt-1">
                              Đã bao gồm giảm giá
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            {formatVND(finalTotal)}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            Đã bao gồm VAT
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Checkout All Button */}
                    <Button
                      className="w-full h-14 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 group"
                      onClick={() => setMultiPaymentOpen(true)}
                    >
                      <CreditCard className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                      {cartItems.length > 1
                        ? `Thanh toán ${cartItems.length} khóa học`
                        : "Thanh toán ngay"}
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>

                    {cartItems.length > 1 && (
                      <div className="mt-3 flex items-center justify-center gap-2 text-xs text-indigo-600 bg-indigo-50 rounded-lg py-2 px-3">
                        <Package className="w-3.5 h-3.5" />
                        <span>
                          Thanh toán từng khóa tuần tự, tự động chuyển tiếp
                        </span>
                      </div>
                    )}

                    {/* Trust Badges */}
                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Shield className="w-3.5 h-3.5" />
                          <span>Thanh toán an toàn</span>
                        </div>
                        <div className="w-px h-3 bg-gray-300" />
                        <div className="flex items-center gap-1">
                          <Lock className="w-3.5 h-3.5" />
                          <span>Bảo mật SSL</span>
                        </div>
                        <div className="w-px h-3 bg-gray-300" />
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Hỗ trợ 24/7</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Modals ── */}
      <AnimatePresence>
        {/* Multi-payment modal (thanh toán nhiều khóa) */}
        {multiPaymentOpen && cartItems && (
          <MultiPaymentModal
            items={cartItems}
            onClose={() => setMultiPaymentOpen(false)}
            onAllDone={(paidIds) => {
              handleMultiAllDone(paidIds);
              // Đóng modal sau khi user bấm "Đóng" bên trong
            }}
          />
        )}

        {/* Single-payment modal (mua từng khóa riêng) */}
        {singlePaymentItem && (
          <SinglePaymentModal
            item={singlePaymentItem}
            onClose={() => setSinglePaymentItem(null)}
            onPaid={handleSinglePaid}
          />
        )}
      </AnimatePresence>
    </>
  );
}
