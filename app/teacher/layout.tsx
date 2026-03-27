import TeacherLayout from "@/components/layout/TeacherLayout";
import ProtectedRoute from "@/components/common/ProtectedRoute";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={["TEACHER"]}>
      <TeacherLayout>{children}</TeacherLayout>
    </ProtectedRoute>
  );
}
