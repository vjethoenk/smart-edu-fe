"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  BadgeCheck,
  BookOpenText,
  ShieldCheck,
  Sparkles,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    icon: BookOpenText,
    title: "Lộ trình cá nhân hóa",
    description:
      "Hệ thống AI phân tích điểm mạnh và điểm yếu để thiết kế chương trình học tối ưu nhất cho riêng bạn.",
    bg: "bg-indigo-100",
    iconColor: "text-indigo-600",
  },
  {
    icon: ShieldCheck,
    title: "Chứng chỉ uy tín",
    description:
      "Sở hữu chứng nhận được các tập đoàn hàng đầu công nhận sau mỗi khóa học hoàn tất.",
    bg: "bg-indigo-100",
    iconColor: "text-indigo-600",
  },
  {
    icon: BadgeCheck,
    title: "Cộng đồng học thuật",
    description:
      "Kết nối và trao đổi cùng hàng ngàn học viên và chuyên gia trong các buổi workshop hằng tuần.",
    bg: "bg-indigo-100",
    iconColor: "text-indigo-600",
  },
];

export default function WhyChooseSection() {
  return (
    <section className="w-full bg-gradient-to-br from-indigo-50 via-white to-indigo-50 py-24">
      <div className="container mx-auto px-4">
        {/* Heading */}
        <div className="mb-16 text-center">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Tại sao chọn Smart-Edu?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-500">
            Chúng tôi tái định nghĩa cách tiếp cận giáo dục số bằng sự tinh giản
            và tập trung vào kết quả thực tiễn.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-8 md:grid-cols-3">
          {features.map((item, index) => {
            const Icon = item.icon;

            return (
              <Card
                key={index}
                className="group relative rounded-2xl border-0 p-0 bg-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl overflow-hidden"
              >
                {/* Gradient border effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur-xl" />

                <CardContent className="relative p-8 bg-white rounded-2xl">
                  {/* Icon container */}
                  <div
                    className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl ${item.bg} group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className={`h-7 w-7 ${item.iconColor}`} />
                  </div>

                  {/* Title with number */}
                  <div className="mb-3 flex items-center gap-2">
                    <span className="text-4xl font-bold text-indigo-400">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-xl font-semibold text-slate-800">
                      {item.title}
                    </h3>
                  </div>

                  <p className="text-sm leading-relaxed text-slate-500">
                    {item.description}
                  </p>

                  {/* Hover arrow indicator */}
                  <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ArrowRight className="w-5 h-5 text-indigo-500" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Stats section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-indigo-600">10,000+</div>
            <div className="text-sm text-slate-500 mt-1">Học viên</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-indigo-600">100+</div>
            <div className="text-sm text-slate-500 mt-1">Khóa học</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-indigo-600">50+</div>
            <div className="text-sm text-slate-500 mt-1">Chuyên gia</div>
          </div>
        </div>
      </div>
    </section>
  );
}
