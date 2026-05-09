import { Button } from "@/components/ui/button";
import { formatVND } from "@/hooks/formatVND";
import {
  ShoppingCart,
  Zap,
  Clock,
  Download,
  Infinity,
  ShieldCheck,
  TrendingUp,
  Gift,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function PriceCard({
  price,
  courseId,
}: {
  price: number | undefined;
  courseId: string;
}) {
  const router = useRouter();
  const isFree = !price || price === 0;
  const displayPrice = isFree
    ? "Miễn phí"
    : formatVND(parseFloat(price?.toString() || "0"));

  return (
    <div className="relative  z-20 top-6 group">
      {/* Badge nổi bật */}
      <div className="absolute -top-3 left-6 z-10">
        <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
          <Sparkles className="w-3 h-3" />
          <span>TIẾT KIỆM 33%</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
        {/* Header với gradient hiện đại */}
        <div className="relative bg-gradient-to-br from-[#4F46E5] via-[#7C3AED] to-[#A855F7] px-6 py-6 text-white overflow-hidden">
          {/* Hiệu ứng nền */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl" />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Gift className="w-4 h-4 text-yellow-300" />
              <p className="text-xs font-semibold uppercase tracking-wider">
                Ưu đãi đặc biệt
              </p>
            </div>

            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="text-5xl font-extrabold tracking-tight">
                {displayPrice}
              </span>
              {!isFree && (
                <>
                  <span className="text-sm line-through opacity-70">
                    {formatVND(parseFloat(price?.toString() || "0") * 1.5)}
                  </span>
                  <div className="bg-white/20 px-2 py-0.5 rounded-full text-xs font-semibold">
                    -33%
                  </div>
                </>
              )}
            </div>

            {!isFree && (
              <div className="flex items-center gap-2 mt-3">
                <Clock className="w-3.5 h-3.5" />
                <p className="text-xs opacity-90">
                  Khuyến mãi kết thúc sau 12:34:56
                </p>
                <TrendingUp className="w-3.5 h-3.5 ml-auto" />
              </div>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="p-6 pt-5">
          <Button className="w-full bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] hover:shadow-lg hover:scale-[1.02] transition-all duration-300 text-white font-semibold gap-2 rounded-xl h-12">
            <ShoppingCart className="w-4 h-4" />
            Thêm vào giỏ hàng
          </Button>

          <Button
            variant="outline"
            className="w-full mt-3 border-2 border-gray-200 hover:border-[#4F46E5] hover:bg-gradient-to-r hover:from-[#4F46E5]/5 hover:to-[#7C3AED]/5 font-semibold gap-2 rounded-xl h-11 transition-all duration-300"
            onClick={() => {
              router.push(`/checkout/${courseId}`);
            }}
          >
            <Zap className="w-4 h-4 text-[#4F46E5]" />
            Mua ngay
          </Button>

          <div className="mt-5 flex items-center justify-center gap-2 text-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-gray-500">Bảo hành 30 ngày</span>
            <div className="w-1 h-1 bg-gray-300 rounded-full" />
            <span className="text-gray-500">Hỗ trợ 24/7</span>
          </div>
        </div>

        {/* Features */}
        <div className="border-t border-gray-100 bg-gradient-to-b from-gray-50 to-white px-6 py-5">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            Khóa học bao gồm
          </p>
          <ul className="space-y-3">
            {[
              { icon: Clock, text: "78 giờ video theo yêu cầu", color: "blue" },
              {
                icon: Download,
                text: "24 tài nguyên có thể tải xuống",
                color: "green",
              },
              { icon: Infinity, text: "Truy cập trọn đời", color: "purple" },
            ].map((item, i) => (
              <li
                key={i}
                className="flex items-center gap-3 text-sm text-gray-700 group/item"
              >
                <div className="p-1 rounded-lg bg-gradient-to-br from-[#4F46E5]/10 to-[#7C3AED]/10 group-hover/item:scale-110 transition-transform">
                  <item.icon className="w-3.5 h-3.5 text-[#4F46E5]" />
                </div>
                <span className="group-hover/item:text-gray-900 transition-colors">
                  {item.text}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Badge cuối */}
        <div className="px-6 pb-5">
          <div className="rounded-xl p-3 text-center bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100">
            <p className="text-xs font-semibold text-amber-700 flex items-center justify-center gap-2">
              <span>✨</span>
              Tiết kiệm ngay 40% so với giá gốc
              <span>✨</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
