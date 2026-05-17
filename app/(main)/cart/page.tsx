"use client";

import { useGetCart, useGetCartTotal, useRemoveFromCart, useClearCart } from "@/features/cart/hook";
import { formatVND } from "@/hooks/formatVND";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Trash2, ShoppingCart, ArrowRight, BookOpen, Clock, Tag, Shield, CreditCard, Gift, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function CartPage() {
  const router = useRouter();
  const { data: cartItems, isLoading: isCartLoading, isError: isCartError } = useGetCart();
  const { data: cartTotalData, isLoading: isTotalLoading } = useGetCartTotal();
  const { mutate: removeFromCart, isPending: isRemoving } = useRemoveFromCart();
  const { mutate: clearCart, isPending: isClearing } = useClearCart();

  const handleRemoveItem = (id: string) => {
    removeFromCart(id, {
      onSuccess: () => {
        toast.success("Đã xóa khóa học khỏi giỏ hàng");
      },
      onError: () => {
        toast.error("Có lỗi xảy ra khi xóa khóa học");
      }
    });
  };

  const handleClearCart = () => {
    if (confirm("Bạn có chắc chắn muốn xóa tất cả khóa học khỏi giỏ hàng?")) {
      clearCart(undefined, {
        onSuccess: () => {
          toast.success("Đã làm sạch giỏ hàng");
        },
        onError: () => {
          toast.error("Có lỗi xảy ra khi làm sạch giỏ hàng");
        }
      });
    }
  };

  const handleCheckout = () => {
    router.push("/checkout");
  };

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
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Không thể tải giỏ hàng</h2>
          <p className="text-gray-500 mb-6">Có lỗi xảy ra khi tải dữ liệu giỏ hàng của bạn</p>
          <Button onClick={() => window.location.reload()} className="rounded-full px-8">
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
              <ShoppingCart className="w-20 h-20 text-gray-400" strokeWidth={1.5} />
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
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen py-12">
      <div className="container mx-auto max-w-8xl px-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Giỏ hàng
            </h1>
            <p className="text-gray-500 mt-2">Quản lý các khóa học bạn muốn mua</p>
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
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className="overflow-hidden p-0 border-0 shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-0">
                      <div className="flex flex-col sm:flex-row">
                        {/* Image */}
                        <div className="sm:w-48 h-36 sm:h-auto relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                          <img
                            src={item.courseId?.thumbnail || "/api/placeholder/400/300"}
                            alt={item.courseId?.title || "Khóa học"}
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
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

                              {/* <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-3">
                                <div className="flex items-center gap-1">
                                  <BookOpen className="w-3.5 h-3.5" />
                                  <span>{item.courseId?.category || "Chưa phân loại"}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3.5 h-3.5" />
                                  <span>{item.courseId?.duration || "Không xác định"}</span>
                                </div>
                              </div> */}

                              <div className="flex items-center gap-2 mb-3">
                                <div className="bg-green-50 px-2 py-1 rounded-lg">
                                  <span className="text-green-700 text-xs font-medium">Học trọn đời</span>
                                </div>
                                <div className="bg-blue-50 px-2 py-1 rounded-lg">
                                  <span className="text-blue-700 text-xs font-medium">Chứng chỉ hoàn thành</span>
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
                              <div className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                {formatVND(item.price)}
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
                  <h3 className="text-xl font-bold text-white">Tổng đơn hàng</h3>
                  <p className="text-indigo-100 text-sm mt-1">Thông tin thanh toán chi tiết</p>
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
                        <span className="font-bold text-gray-900 text-lg">Tổng cộng</span>
                        {totalDiscount > 0 && (
                          <p className="text-xs text-green-600 mt-1">Đã bao gồm giảm giá</p>
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

                  {/* Checkout Button */}
                  <Button
                    className="w-full h-14 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 group"
                    onClick={handleCheckout}
                  >
                    <CreditCard className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                    Thanh toán ngay
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>

                  {/* Trust Badges */}
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Shield className="w-3.5 h-3.5" />
                        <span>Thanh toán an toàn</span>
                      </div>
                      <div className="w-px h-3 bg-gray-300" />
                      <div className="flex items-center gap-1">
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Bảo mật thông tin</span>
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
  );
}