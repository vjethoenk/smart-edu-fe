"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
    BadgeCheck,
    BookOpenText,
    ShieldCheck,
} from "lucide-react";

const features = [
    {
        icon: BookOpenText,
        title: "Lộ trình cá nhân hóa",
        description:
            "Hệ thống AI phân tích điểm mạnh và điểm yếu để thiết kế chương trình học tối ưu nhất cho riêng bạn.",
        bg: "bg-violet-100",
        iconColor: "text-violet-600",
    },
    {
        icon: ShieldCheck,
        title: "Chứng chỉ uy tín",
        description:
            "Sở hữu chứng nhận được các tập đoàn hàng đầu công nhận sau mỗi khóa học hoàn tất.",
        bg: "bg-green-100",
        iconColor: "text-green-600",
    },
    {
        icon: BadgeCheck,
        title: "Cộng đồng học thuật",
        description:
            "Kết nối và trao đổi cùng hàng ngàn học viên và chuyên gia trong các buổi workshop hằng tuần.",
        bg: "bg-orange-100",
        iconColor: "text-orange-500",
    },
];

export default function WhyChooseSection() {
    return (
        <section className="w-full bg-[#f5f5f5] py-20">
            <div className="container mx-auto px-4">
                {/* Heading */}
                <div className="mb-14 text-center">
                    <h2 className="text-4xl font-bold tracking-tight text-slate-900">
                        Tại sao chọn Smart-Edu?
                    </h2>

                    <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-500">
                        Chúng tôi tái định nghĩa cách tiếp cận giáo dục số bằng sự tinh
                        giản và tập trung vào kết quả thực tiễn.
                    </p>
                </div>

                {/* Cards */}
                <div className="grid gap-6 md:grid-cols-3">
                    {features.map((item, index) => {
                        const Icon = item.icon;

                        return (
                            <Card
                                key={index}
                                className="rounded-3xl border-0 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                            >
                                <CardContent className="p-8">
                                    <div
                                        className={`mb-6 flex h-12 w-12 items-center justify-center rounded-xl ${item.bg}`}
                                    >
                                        <Icon className={`h-6 w-6 ${item.iconColor}`} />
                                    </div>

                                    <h3 className="mb-3 text-lg font-semibold text-slate-900">
                                        {item.title}
                                    </h3>

                                    <p className="text-sm leading-7 text-slate-500">
                                        {item.description}
                                    </p>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}