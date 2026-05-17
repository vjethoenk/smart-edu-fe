"use client";

import { StudentProgressManagement } from "@/app/admin/students/components/StudentProgressManagement";

export default function InstructorStudentsPage() {
  return (
    <div className="p-6 md:p-8 bg-[#fdfdfd] min-h-[calc(100vh-80px)]">
      <StudentProgressManagement role="INSTRUCTOR" />
    </div>
  );
}
