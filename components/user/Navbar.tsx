"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const pathname = usePathname();

  const menus = [
    { name: "Trang chủ", href: "/" },
    { name: "Thể loại", href: "/categories" },
    { name: "Khóa học", href: "/courses" },
    { name: "Giới thiệu", href: "/about" },
  ];

  return (
    <header className="w-full border-b bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* LEFT */}
        <div className="flex items-center gap-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-primary"></div>
            <span className="text-lg text-primary font-semibold">
              Smart-Edu
            </span>
          </Link>

          {/* MENU */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {menus.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative pb-1 text-gray-600 transition-all hover:text-primary",
                    isActive && "text-primary font-semibold",
                  )}
                >
                  {item.name}

                  {/* underline */}
                  <span
                    className={cn(
                      "absolute left-0 bottom-0 h-[2px] w-0 bg-primary transition-all duration-300",
                      isActive && "w-full",
                    )}
                  />
                </Link>
              );
            })}
          </nav>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" className="hover:text-primary">
              Đăng nhập
            </Button>
          </Link>

          <Link href="/register">
            <Button className="bg-primary hover:bg-primary/90">Đăng ký</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
