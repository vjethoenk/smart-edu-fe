"use client";
import { useEnrollment } from "@/features/enrollment/hook";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import CardItem from "./components/CardItem";

const EnrollmentPage = () => {
  const { data: enrollmentList } = useEnrollment();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="mb-8 text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full mb-4">
            <BookOpen className="w-4 h-4" />
            <span className="text-sm font-medium">Khóa học của tôi</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Hành trình học tập
          </h1>
          <p className="text-gray-500 mt-2 text-lg">
            Tiếp tục chinh phục kiến thức mới mỗi ngày
          </p>
        </div>

        {/* Course List */}
        <div className="space-y-5">
          {enrollmentList && enrollmentList.length > 0 ? (
            enrollmentList.map((e) => (
              <CardItem key={e._id} courseId={e.courseId} />
            ))
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="text-7xl mb-4">📚</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Chưa có khóa học nào
              </h3>
              <p className="text-gray-400">
                Hãy khám phá và đăng ký khóa học đầu tiên của bạn
              </p>
              <Button className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white">
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
