"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  BarChart3,
  Settings,
} from "lucide-react";

const menus = [
  {
    name: "Tổng quan",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Người dùng",
    href: "/admin/users",
    icon: Users,
  },
  {
    name: "Thể loại",
    href: "/admin/category",
    icon: Users,
  },
  {
    name: "Khóa học",
    href: "/admin/courses",
    icon: BookOpen,
  },
  {
    name: "Báo cáo",
    href: "/admin/reports",
    icon: BarChart3,
  },
  {
    name: "Cài đặt",
    href: "/admin/settings",
    icon: Settings,
  },
];

const SidebarAdmin = () => {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen bg-white border-r flex flex-col ">
      {/* Logo */}
      <div className="p-6 border-b max-h-[74px]">
        <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
          Smart-Edu
        </h1>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {menus.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");

          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-indigo-600 text-white shadow"
                  : "text-gray-600 hover:bg-gray-100 hover:text-indigo-600",
              )}
            >
              <Icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t text-xs text-gray-400">
        © 2026 SmartEdu Admin
      </div>
    </aside>
  );
};

export default SidebarAdmin;
