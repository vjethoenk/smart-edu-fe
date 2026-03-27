import AdminLayout from "@/components/layout/AdminLayout";
import ProtectedRoute from "@/components/common/ProtectedRoute";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <AdminLayout>{children}</AdminLayout>
    </ProtectedRoute>
  );
}
