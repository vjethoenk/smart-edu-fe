"use client";

import { StudentProgressManagement } from "./components/StudentProgressManagement";

export default function AdminStudentsPage() {
  return (
    <div className="px-8 md:py-8 bg-[#fdfdfd] min-h-[calc(100vh-80px)]">
      <StudentProgressManagement role="ADMIN" />
    </div>
  );
}
