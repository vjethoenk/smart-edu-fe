import { Button } from "@/components/ui/button";
import { formatVND } from "@/hooks/formatVND";
import {
  ShoppingCart,
  Zap,
  Clock,
  Download,
  Infinity,
  ShieldCheck,
} from "lucide-react";

export default function PriceCard({ price }: { price: number | undefined }) {
  const isFree = !price || price === 0;
  const displayPrice = isFree
    ? "Miễn phí"
    : formatVND(parseFloat(price?.toString() || "0"));

  return (
    <div className="relative sticky top-6 bg-white rounded-4xl shadow-xl border border-gray-100 overflow-hidden transition-all hover:shadow-2xl">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#6760FD] to-[#4D44E3] px-6 py-4 text-white">
        <p className="text-xs font-medium uppercase tracking-wider opacity-90">
          Ưu đãi đặc biệt
        </p>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-4xl font-bold">{displayPrice}</span>
          {!isFree && (
            <span className="text-sm line-through opacity-70">
              {formatVND(parseFloat(price?.toString() || "0") * 1.5)}
            </span>
          )}
        </div>
        {!isFree && <p className="text-xs mt-1 opacity-80">Đã bao gồm VAT</p>}
      </div>

      {/* Buttons */}
      <div className="p-6 pt-5">
        <Button className="w-full bg-[#4D44E3] hover:bg-[#4F46E5] text-white font-semibold gap-2 shadow-md hover:shadow-lg transition-all">
          <ShoppingCart className="w-4 h-4" />
          Thêm vào giỏ hàng
        </Button>

        <Button
          variant="outline"
          className="w-full mt-3 border-[#4D44E3]/20 text-[#4D44E3] hover:bg-[#4D44E3]/5 font-medium gap-2"
        >
          <Zap className="w-4 h-4" />
          Mua ngay
        </Button>

        <div className="mt-4 flex items-center justify-center gap-1 text-xs text-gray-400">
          <ShieldCheck className="w-3 h-3" />
          <span>Bảo hành 30 ngày hoàn tiền</span>
        </div>
      </div>

      {/* Features */}
      <div className="border-t border-gray-100 bg-gray-50/50 px-6 py-5">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Khóa học bao gồm
        </p>
        <ul className="space-y-2.5">
          {[
            { icon: Clock, text: "78 giờ video theo yêu cầu" },
            { icon: Download, text: "24 tài nguyên có thể tải xuống" },
            { icon: Infinity, text: "Truy cập trọn đời" },
          ].map((item, i) => (
            <li
              key={i}
              className="flex items-center gap-3 text-sm text-gray-600"
            >
              <div className="p-0.5 rounded-full bg-[#4D44E3]/10">
                <item.icon className="w-3.5 h-3.5 text-[#4D44E3]" />
              </div>
              <span>{item.text}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Badge */}
      <div className="px-6 pb-5">
        <div className="rounded-lg p-2 text-center bg-[#4D44E3]/5">
          <p className="text-xs font-medium text-[#4D44E3]">
            ✨ Tiết kiệm 40% so với giá gốc
          </p>
        </div>
      </div>
    </div>
  );
}
