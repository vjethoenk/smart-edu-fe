"use client";

import { StudentProgressManagement } from "./components/StudentProgressManagement";

export default function AdminStudentsPage() {
  return (
    <div className="p-6 md:p-8 bg-[#fdfdfd] min-h-[calc(100vh-80px)]">
      <StudentProgressManagement role="ADMIN" />
    </div>
  );
}
