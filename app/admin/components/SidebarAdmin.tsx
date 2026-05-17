"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  BarChart3,
  Settings,
  ChevronLeft,
  GraduationCap,
  FolderTree,
  LogOut,
  Sparkles,
  FileQuestionMark,
  ListChecks,
  Shield,
  Users2,
  Tag,
} from "lucide-react";
import { useState, useMemo } from "react";

const ALL_MENUS = [
  {
    name: "Tổng quan",
    href: "/admin",
    icon: LayoutDashboard,
    requiredRole: null, // visible to all
  },
  {
    name: "Quản Lí Giáo Viên",
    href: "/admin/users",
    icon: Users2,
    requiredRole: "ADMIN", // only ADMIN
  },
  {
    name: "Thể loại",
    href: "/admin/category",
    icon: FolderTree,
    requiredRole: "ADMIN", // only ADMIN
  },
  {
    name: "Khóa học",
    href: "/admin/courses",
    icon: BookOpen,
    requiredRole: null, // visible to all
  },
  {
    name: "Quản lý học viên",
    href: "/admin/students",
    icon: GraduationCap,
    requiredRole: null, // visible to all
  },
  {
    name: "Khuyến mãi",
    href: "/admin/promotions",
    icon: Tag,
    requiredRole: "ADMIN", // visible to all
  },
  {
    name: "Câu hỏi",
    href: "/admin/questions",
    icon: FileQuestionMark,
    requiredRole: null, // visible to all
  },
  {
    name: "Báo cáo",
    href: "/admin/reports",
    icon: BarChart3,
    requiredRole: "ADMIN", // only ADMIN
  },
  {
    name: "Phê duyệt",
    href: "/admin/approvals",
    icon: ListChecks,
    requiredRole: "ADMIN", // only ADMIN
  },
  {
    name: "Vai Trò",
    href: "/admin/roles",
    icon: Shield,
    requiredRole: "ADMIN", // only ADMIN
  },
  {
    name: "Cài đặt",
    href: "/admin/settings",
    icon: Settings,
    requiredRole: "ADMIN", // only ADMIN
  },
];

interface Props {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

const SidebarAdmin = ({ isCollapsed, toggleSidebar }: Props) => {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const userRole = useSelector((state: any) => state.auth.role);

  // Filter menus based on user role and adjust paths for INSTRUCTOR
  const menus = useMemo(() => {
    return ALL_MENUS.filter((menu) => {
      if (menu.requiredRole === null) return true; // visible to all (ADMIN and INSTRUCTOR)
      return menu.requiredRole === userRole; // only show if role matches
    }).map((menu) => {
      // For INSTRUCTOR, redirect admin routes to instructor routes
      if (userRole === "INSTRUCTOR") {
        if (menu.href === "/admin/courses") {
          return { ...menu, href: "/instructor/courses" };
        }
        if (menu.href === "/admin/questions") {
          return { ...menu, href: "/instructor/questions" };
        }
        if (menu.href === "/admin/students") {
          return { ...menu, href: "/instructor/students" };
        }
        // Redirect main admin page to instructor page
        if (menu.href === "/admin") {
          return { ...menu, href: "/instructor" };
        }
      }
      return menu;
    });
  }, [userRole]);

  return (
    <>
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
      >
        <GraduationCap className="w-5 h-5 text-indigo-600" />
      </button>

      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 transition-all duration-300 shadow-2xl",
          isCollapsed ? "-translate-x-full" : "translate-x-0",
          !isMobile && (isCollapsed ? "w-20" : "w-64"),
          "lg:translate-x-0",
        )}
      >
        {/* Logo Section */}
        <div className="relative p-5 border-b border-white/10 h-[80px] ">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl blur-lg opacity-50" />
                <div className="relative p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
              </div>
              {(!isCollapsed || isMobile) && (
                <div className="overflow-hidden">
                  <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    SmartEdu
                  </h1>
                  <p className="text-xs text-white/40">Admin Dashboard</p>
                </div>
              )}
            </div>
            {!isMobile && (
              <button
                onClick={toggleSidebar}
                className="flex items-center justify-center w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 hover:scale-110"
              >
                <ChevronLeft
                  className={cn(
                    "w-3 h-3 text-white transition-all duration-300",
                    isCollapsed && "rotate-180",
                  )}
                />
              </button>
            )}
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto max-h-[calc(100vh-180px)] custom-scrollbar">
          {menus.map((item) => {
            const isActive = (() => {
              if (item.href === "/admin" || item.href === "/instructor") {
                return pathname === item.href;
              }

              // For courses and questions, match both admin and instructor paths
              if (item.href === "/instructor/courses") {
                return (
                  pathname.startsWith("/instructor/courses") ||
                  pathname.startsWith("/admin/courses")
                );
              }
              if (item.href === "/instructor/questions") {
                return (
                  pathname.startsWith("/instructor/questions") ||
                  pathname.startsWith("/admin/questions")
                );
              }
              if (item.href === "/instructor/students") {
                return (
                  pathname.startsWith("/instructor/students") ||
                  pathname.startsWith("/admin/students")
                );
              }

              return (
                pathname === item.href || pathname.startsWith(item.href + "/")
              );
            })();

            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  if (isMobile) toggleSidebar();
                }}
                className={cn(
                  "group relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 overflow-hidden",
                  isActive
                    ? "bg-gradient-to-r from-indigo-500/20 to-purple-600/20 text-white border border-white/10"
                    : "text-white/60 hover:text-white hover:bg-white/5",
                  !isCollapsed || isMobile ? "justify-start" : "justify-center",
                  "hover:translate-x-1",
                )}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-indigo-400 to-purple-400 rounded-r-full" />
                )}

                <Icon
                  className={cn(
                    "w-5 h-5 transition-all duration-200",
                    !isCollapsed &&
                    "group-hover:scale-110 group-hover:rotate-3",
                  )}
                />

                {(!isCollapsed || isMobile) && (
                  <span className="truncate">{item.name}</span>
                )}

                {/* Tooltip */}
                {isCollapsed && !isMobile && (
                  <div className="absolute left-full ml-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-50 shadow-xl border border-white/10">
                    {item.name}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10 bg-gradient-to-t from-slate-900 to-transparent">
          {!isCollapsed || isMobile ? (
            <div className="text-center space-y-1">
              <p className="text-xs text-white/40">© 2026 SmartEdu Admin</p>
              <div className="flex items-center justify-center gap-1 text-xs text-white/30">
                <Sparkles className="w-3 h-3" />
                <span>Powered by Next.js</span>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group cursor-pointer hover:bg-white/10 transition-all">
                <LogOut className="w-4 h-4 text-white/40 group-hover:text-white/60 transition-colors" />
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default SidebarAdmin;
