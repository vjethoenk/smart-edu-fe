import { Button } from "@/components/ui/button";
import { TrendingUp } from "lucide-react";

export default function Hero() {
  return (
    <div className="container mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <div className="h-full">
        <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ">
          ✦ Nền tảng giáo dục thế hệ mới
        </span>
        <div className="space-y-6 mt-8">
          <h2 className="text-5xl lg:text-7xl font-extrabold text-gray-900 leading-tight">
            Học thông minh <br /> hơn với{" "}
            <span className="text-indigo-600">Smart-Edu</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-lg leading-relaxed">
            Trải nghiệm học tập được cá nhân hóa bởi AI, kết nối trực tiếp với
            các chuyên gia hàng đầu và lộ trình phát triển nghề nghiệp rõ ràng.
          </p>

          <div className="flex gap-4 pt-4">
            <Button
              size="lg"
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-8 h-14 shadow-lg shadow-indigo-200"
            >
              Bắt đầu học
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="rounded-xl px-8 h-14 border-gray-200 text-indigo-600"
            >
              Xem khóa học
            </Button>
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="rounded-[40px] overflow-hidden shadow-2xl">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDaIu1B4qoGg3JDgAm1UrFnmHFPuBFRDCVehs1Z2yga25RZatGdFi0aw1XbQP8mm4sWYNHMnrPQdV_2E-4qMZUV9Th0Pmyor4HpdHq4F0OXIa-sMTREevzMOZupdVjdhfFfP66GJkSOrJzKrPjykJFyZx-j_di5BmksXAHp84LxVHGAUJTFdxCLmfvb429nU_1quvWd5jKRwtb80AuwM-nzXS60rRKm3t8euO_6a0DAjFK7rsND_eILXqifmNPkgtKDhtxWOPi0LcQn"
            alt="Students"
            className="w-full h-[500px] object-cover"
          />
        </div>

        <div className="absolute bottom-8 left-8 right-8 bg-white/90 backdrop-blur-md p-6 rounded-3xl flex items-center gap-4 shadow-xl border border-white/50">
          <div className="bg-green-700 p-3 rounded-2xl">
            <TrendingUp className="text-white w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-green-800 tracking-widest">
              Tiến độ học tập
            </p>
            <p className="text-2xl font-bold text-gray-900">
              +85%{" "}
              <span className="text-lg font-medium">Hiệu quả tiếp thu</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
