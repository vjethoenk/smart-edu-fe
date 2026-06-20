import { Card } from "@/components/ui/card";

const steps = [
  {
    number: "01",
    title: "Đăng ký",
    description: "Tạo tài khoản SmartEdu chỉ trong vài giây.",
  },
  {
    number: "02",
    title: "Chọn khóa học",
    description: "Lựa chọn lĩnh vực bạn muốn phát triển.",
  },
  {
    number: "03",
    title: "Học trực tuyến",
    description: "Học qua video và thực hành dự án thực tế.",
  },
  {
    number: "04",
    title: "Nhận giấy khen",
    description: "Khẳng định năng lực với giấy khen chuyên nghiệp.",
  },
];

export default function StepProgress() {
  return (
    <section className="py-24 bg-gradient-to-br from-indigo-50 via-white to-indigo-50">
      <div className="container mx-auto px-4">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
            Lộ trình học tập đơn giản
          </h2>
          <p className="mt-4 text-slate-500 max-w-2xl mx-auto">
            Chỉ với 4 bước để bắt đầu hành trình chinh phục tương lai.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative max-w-6xl mx-auto">
          {/* Line - đổi màu indigo */}
          <div className="absolute top-[32px] left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-indigo-300 to-transparent" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 relative">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className="flex flex-col items-center text-center group"
              >
                {/* Circle */}
                <div className="relative z-10 flex items-center justify-center">
                  {/* Outer ring - đổi sang indigo */}
                  <div className="absolute w-20 h-20 rounded-full bg-indigo-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Inner circle - đổi gradient từ blue sang indigo */}
                  <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-indigo-600 to-indigo-700 text-white flex items-center justify-center font-semibold text-xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                    {step.number}
                  </div>
                </div>

                {/* Content */}
                <div className="mt-6">
                  <h3 className="font-semibold text-lg text-slate-800">
                    {step.title}
                  </h3>

                  <p className="mt-2 text-sm text-slate-500 leading-relaxed max-w-[200px] mx-auto">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
