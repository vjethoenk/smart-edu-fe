"use client";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import SidebarAdmin from "./components/SidebarAdmin";
import HeaderAdmin from "./components/HeaderAdmin";
import { useState } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <div className="flex min-h-screen">
        <SidebarAdmin
          isCollapsed={isCollapsed}
          toggleSidebar={() => setIsCollapsed(!isCollapsed)}
        />

        <div
          className={`flex-1 flex flex-col transition-all duration-300 ${
            isCollapsed ? "lg:ml-20" : "lg:ml-64"
          }`}
        >
          <HeaderAdmin />
          <main className="flex-1 bg-[#fdfdfd] ">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
