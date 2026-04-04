import ProtectedRoute from "@/components/common/ProtectedRoute";
import SidebarAdmin from "./components/SidebarAdmin";
import HeaderAdmin from "./components/HeaderAdmin";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <div className="flex min-h-screen">
        <SidebarAdmin />
        <div className="flex-1 flex flex-col">
          <HeaderAdmin />
          {/* Content */}
          <main className="flex-1 p-6 bg-gray-50">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
