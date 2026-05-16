"use client";
import { useEnrollment } from "@/features/enrollment/hook";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import CardItem from "./components/CardItem";

const EnrollmentPage = () => {
  const { data: enrollmentList } = useEnrollment();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Header Section - thu gọn padding */}
        <div className="mb-6 text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-full mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">Khóa học của tôi</span>
          </div>
          <h1 className="text-2xl md:text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Hành trình học tập
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Tiếp tục chinh phục kiến thức mới mỗi ngày
          </p>
        </div>

        {/* Course List - điều chỉnh khoảng cách */}
        <div className="space-y-4">
          {enrollmentList && enrollmentList.length > 0 ? (
            enrollmentList.map((e) => (
              <CardItem key={e._id} courseId={e.courseId} />
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="text-6xl mb-3">📚</div>
              <h3 className="text-lg font-semibold text-gray-700 mb-1">
                Chưa có khóa học nào
              </h3>
              <p className="text-gray-400 text-sm">
                Hãy khám phá và đăng ký khóa học đầu tiên của bạn
              </p>
              <Button className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-1.5">
                Khám phá khóa học
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnrollmentPage;
