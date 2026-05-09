"use client";

import { use, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  CreditCard,
  ShieldCheck,
  Lock,
  ChevronRight,
  Smartphone,
  CheckCircle,
  ArrowLeft,
  X,
  Copy,
  Check,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatVND } from "@/hooks/formatVND";
import { useGetByIdCourse } from "@/features/course/hook";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  useCancelPayment,
  useCreatePayment,
  usePaymentStatus,
} from "@/features/payment/hook";
import { IPayment } from "@/types/api";
import { QRCodeSVG } from "qrcode.react";

export default function CheckoutPage() {
  const router = useRouter();
  const { id } = useParams();
  const { data: courseData } = useGetByIdCourse(id as string);
  const [paymentMethod, setPaymentMethod] = useState("vietQr");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const { mutate: createPaymentMutate } = useCreatePayment();

  const paymentMutation = useCreatePayment();
  const handlePayment = () => {
    if (!id || !total) return;

    paymentMutation.mutate(
      { courseId: id as string, amount: Number(courseData?.price) },
      {
        onSuccess: (res) => {
          setPaymentData(res.data);
          // console.log("Payment API Response:", res.data);
          setIsModalOpen(true);
          toast.success("Đã tạo mã QR thanh toán");
        },
        onError: () => toast.error("Lỗi khởi tạo thanh toán"),
      },
    );
  };

  const handleCopyAccountNumber = () => {
    if (paymentData?.data) {
      navigator.clipboard.writeText(paymentData.data.qrCode);
      setCopied(true);
      toast.success("Đã sao chép số tài khoản");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const subtotal = courseData?.price || 0;
  const total = Number(subtotal);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Quay lại</span>
            </button>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-green-600" />
              <span className="text-xs text-gray-600">
                Thanh toán an toàn & bảo mật
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-indigo-600" />
                Phương thức thanh toán
              </h2>

              <div className="space-y-3">
                {[
                  {
                    id: "vietQr",
                    name: "VietQR",
                    icon: Smartphone,
                    description: "Thanh toán nhanh chóng qua mã VietQR",
                  },
                ].map((method) => (
                  <label
                    key={method.id}
                    className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      paymentMethod === method.id
                        ? "border-indigo-600 bg-indigo-50/30"
                        : "border-gray-200 hover:border-indigo-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.id}
                      checked={paymentMethod === method.id}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mt-0.5 w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <method.icon className="w-5 h-5 text-gray-600" />
                        <span className="font-semibold text-gray-800">
                          {method.name}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {method.description}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="lg:hidden">
              <PaymentSummary
                total={total}
                onPayment={handlePayment}
                isProcessing={paymentMutation.isPending}
              />
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
                  <h3 className="font-bold text-lg">Đơn hàng của bạn</h3>
                  <p className="text-sm opacity-90 mt-1">Hoàn tất thanh toán</p>
                </div>

                <div className="p-6">
                  <div className="flex gap-4 pb-4 border-b border-gray-200">
                    <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                      <img
                        src={courseData?.thumbnail}
                        alt={courseData?.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 line-clamp-2">
                        {courseData?.title}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {courseData?.createBy?.name}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 py-4 border-b border-gray-200">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tạm tính</span>
                      <span className="text-gray-800">
                        {formatVND(subtotal as number)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Phí giao dịch</span>
                      <span className="text-gray-800">Miễn phí</span>
                    </div>
                    <div className="flex justify-between pt-3 border-t border-gray-200">
                      <span className="font-bold text-gray-800">Tổng cộng</span>
                      <span className="text-2xl font-bold text-indigo-600">
                        {formatVND(total)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 mt-4">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Lock className="w-3.5 h-3.5 text-green-600" />
                      <span>Thanh toán an toàn & bảo mật</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
                      <span>Được bảo vệ bởi SSL Encryption</span>
                    </div>
                  </div>

                  {/* Payment button desktop */}
                  <div className="hidden lg:block mt-6">
                    <Button
                      onClick={handlePayment}
                      disabled={paymentMutation.isPending}
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-6 rounded-xl text-lg gap-2"
                    >
                      {paymentMutation.isPending ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Đang xử lý...
                        </>
                      ) : (
                        <>
                          Thanh toán {formatVND(total)}
                          <ChevronRight className="w-5 h-5" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {isModalOpen && paymentData && (
        <PaymentModal
          paymentData={paymentData}
          total={total}
          onClose={() => setIsModalOpen(false)}
          onCopy={handleCopyAccountNumber}
          copied={copied}
        />
      )}
    </div>
  );
}

// Component tổng thanh toán
function PaymentSummary({
  total,
  onPayment,
  isProcessing,
}: {
  total: number;
  onPayment: () => void;
  isProcessing: boolean;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
      <h3 className="font-bold text-lg mb-4">Tổng thanh toán</h3>
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-lg font-bold pt-2">
          <span>Tổng</span>
          <span className="text-indigo-600">{formatVND(total)}</span>
        </div>
      </div>
      <Button
        onClick={onPayment}
        disabled={isProcessing}
        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
      >
        {isProcessing ? "Đang xử lý..." : "Xác nhận thanh toán"}
      </Button>
    </div>
  );
}

// Payment Modal Component
function PaymentModal({
  paymentData,
  total,
  onClose,
  onCopy,
  copied,
}: {
  paymentData: IPayment;
  total: number;
  onClose: () => void;
  onCopy: () => void;
  copied: boolean;
}) {
  const [checkingStatus, setCheckingStatus] = useState(false);
  const { data: res, isFetching } = usePaymentStatus(paymentData.orderCode);

  const paymentStatus = res?.data?.status;
  useEffect(() => {
    if (paymentStatus === "SUCCESS") {
      window.location.href = "/payments/success";
    }
  }, [paymentStatus]);

  const { mutate: cancelPayment, isPending } = useCancelPayment();

  const handleClose = () => {
    const confirmCancel = window.confirm("Bạn có muốn hủy giao dịch không?");
    if (!confirmCancel) return;

    cancelPayment(paymentData.orderCode, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      {/* <div className="flex items-center gap-2">
        {isFetching && <Loader2 className="w-4 h-4 animate-spin" />}
        <p>Trạng thái: {paymentStatus || "Đang kiểm tra..."}</p>
      </div> */}
      <div className="relative max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-5 text-white relative">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Thanh toán VietQR</h3>
              <p className="text-xs opacity-90">Quét mã QR để thanh toán</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Amount */}
          <div className="text-center mb-6">
            <p className="text-sm text-gray-500 mb-1">Số tiền cần thanh toán</p>
            <p className="text-3xl font-bold text-gray-800">
              {formatVND(total)}
            </p>
          </div>

          {/* QR Code */}
          <div className="flex justify-center mb-6">
            {paymentData?.qrCode ? (
              <QRCodeSVG
                value={paymentData.qrCode}
                size={240}
                level="M"
                includeMargin={false}
                fgColor="#1e1b4b"
              />
            ) : (
              <div className="w-[240px] h-[240px] flex items-center justify-center bg-gray-50 text-gray-400">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
            )}
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-6">
            <p className="text-xs text-amber-800">
              <span className="font-semibold">📌 Hướng dẫn:</span> Mở ứng dụng
              ngân hàng hoặc ví điện tử, chọn "Quét mã QR", sau đó quét mã QR
              bên trên và xác nhận thanh toán.
            </p>
          </div>

          {/* Check Status Button */}
          <Button
            disabled={checkingStatus}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold gap-2"
          >
            {checkingStatus ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Đang kiểm tra...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                Tôi đã thanh toán
              </>
            )}
          </Button>

          <p className="text-center text-xs text-gray-400 mt-4">
            Sau khi thanh toán, vui lòng nhấn "Tôi đã thanh toán" để kích hoạt
            khóa học
          </p>
        </div>
      </div>
    </div>
  );
}
