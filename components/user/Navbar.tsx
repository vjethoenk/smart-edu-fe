"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ShoppingCart, Bell } from "lucide-react";
export default function Navbar() {
  const pathname = usePathname();

  const menus = [
    { name: "Khóa học", href: "/my-learning" },
    { name: "Thể loại", href: "/categories" },
    { name: "Giảng viên", href: "/mentors" },
  ];

  return (
    <header className="w-full shadow bg-white sticky top-0 z-50">
      <div className="container mx-auto flex h-20 items-center justify-between px-6 lg:px-10">
        <div className="flex items-center gap-12">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold tracking-tight text-[#111827]">
              Smart-Edu
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-[15px] font-medium">
            {menus.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative py-2 transition-all duration-300",
                    isActive
                      ? "text-indigo-600 font-semibold"
                      : "text-gray-500 hover:text-indigo-600",
                  )}
                >
                  {item.name}

                  <span
                    className={cn(
                      "absolute bottom-[-22px] left-0 h-[3px] bg-indigo-600 transition-all duration-300 rounded-full",
                      isActive ? "w-full opacity-100" : "w-0 opacity-0",
                    )}
                  />
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-5 text-gray-500">
            <button className="hover:text-indigo-600 transition-colors">
              <Bell className="w-[22px] h-[22px]" />
            </button>
            <button className="hover:text-indigo-600 transition-colors">
              <ShoppingCart className="w-[22px] h-[22px]" />
            </button>
          </div>

          <div className="hidden sm:block h-6 w-[1px] bg-gray-200 mx-2" />

          <div className="flex items-center gap-4">
            <Link href="/login">
              <button className="text-[15px] font-semibold text-gray-700 hover:text-indigo-600 transition-colors px-2 cursor-pointer">
                Đăng nhập
              </button>
            </Link>

            <Link href="/register">
              <Button className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-7 h-11 font-semibold transition-all active:scale-95">
                Đăng kí
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
