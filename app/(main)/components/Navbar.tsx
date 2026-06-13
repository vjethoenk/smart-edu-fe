"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ShoppingCart, Bell, Trash2 } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useLogout } from "@/features/auth/hook";
import { RootState } from "@/store/type";
import { useGetCartTotal, useGetCart, useRemoveFromCart } from "@/features/cart/hook";
import { toast } from "sonner";

function UserMenu() {
  const logout = useLogout();
  const { user, role } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    logout();
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  };

  return (
    <div className="relative group">
      <div className="cursor-pointer font-semibold text-gray-700">
        {user?.name}
      </div>

      <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-200 z-50">
        <div className="flex flex-col py-2">
          <Link href="/profile" className="px-4 py-2 hover:bg-gray-100">
            Tài khoản
          </Link>

          <Link href="/enrollments" className="px-4 py-2 hover:bg-gray-100">
            Khóa học của tôi
          </Link>

          <Link href="/my-certificates" className="px-4 py-2 hover:bg-gray-100">
            Chứng chỉ của tôi
          </Link>

          {role === "ADMIN" && (
            <Link
              href="/admin"
              className="px-4 py-2 hover:bg-gray-100 text-indigo-600 font-semibold"
            >
              Trang quản lí
            </Link>
          )}

          {role === "INSTRUCTOR" && (
            <Link
              href="/instructor"
              className="px-4 py-2 hover:bg-gray-100 text-indigo-600 font-semibold"
            >
              Trang giảng dạy
            </Link>
          )}

          <button
            type="button"
            onClick={handleLogout}
            className="text-left px-4 py-2 hover:bg-gray-100 text-red-500"
          >
            Đăng xuất
          </button>
        </div>
      </div>
    </div>
  );
}

function CartMenu() {
  const router = useRouter();
  const { data: cartItems } = useGetCart();
  const { data: cartTotalData } = useGetCartTotal();
  const removeFromCart = useRemoveFromCart();
  const totalItems = cartTotalData?.totalItems || 0;
  const totalPrice = cartTotalData?.totalPrice || 0;

  const handleRemove = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    removeFromCart.mutate(id, {
      onSuccess: () => {
        toast.success("Xóa khỏi giỏ hàng thành công");
      },
      onError: () => {
        toast.error("Xóa khỏi giỏ hàng thất bại");
      },
    });
  };

  return (
    <div className="relative group">
      <button className="hover:text-indigo-600 transition-colors relative" onClick={() => router.push("/cart")}>
        <ShoppingCart className="w-[22px] h-[22px]" />
        {totalItems > 0 && (
          <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
            {totalItems > 99 ? "99+" : totalItems}
          </span>
        )}
      </button>

      <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-200 z-50 pointer-events-none group-hover:pointer-events-auto">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-800">Giỏ hàng ({totalItems})</h3>
        </div>

        {cartItems && cartItems.length > 0 ? (
          <>
            <div className="max-h-80 overflow-y-auto">
              {cartItems.map((item: any) => (
                <div
                  key={item._id}
                  className="flex gap-3 p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <img
                    src={item.courseId?.thumbnail || "/placeholder.png"}
                    alt={item.courseId?.title || "Khóa học"}
                    className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                    onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.png"; }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 line-clamp-2">
                      {item.courseId?.title || "Khóa học"}
                    </p>
                    <p className="text-sm font-semibold text-indigo-600 mt-1">
                      {Number(item.price || item.courseId?.price || 0).toLocaleString("vi-VN")}₫
                    </p>
                  </div>
                  <button
                    onClick={(e) => handleRemove(e, item._id)}
                    className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0 self-start mt-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-gray-200 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tổng cộng:</span>
                <span className="font-semibold text-gray-800">
                  {Number(totalPrice || 0).toLocaleString("vi-VN")}₫
                </span>
              </div>
              <button
                onClick={() => router.push("/cart")}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition-colors"
              >
                Xem giỏ hàng
              </button>
            </div>
          </>
        ) : (
          <div className="p-8 text-center">
            <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">Giỏ hàng của bạn đang trống</p>
          </div>
        )}
      </div>
    </div>
  );
}


export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, role } = useSelector((state: RootState) => state.auth);

  const menus = [
    { name: "Khóa học", href: "/course" },
    { name: "Thể loại", href: "/categories" },
    { name: "Giảng viên", href: "/mentor" },
    { name: "Tin nhắn", href: "/chat" },
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
            <CartMenu />
          </div>

          <div className="hidden sm:block h-6 w-[1px] bg-gray-200 mx-2" />

          <div className="flex items-center gap-4">
            {!user ? (
              <>
                <Link href="/login">
                  <button className="text-[15px] font-semibold text-gray-700 hover:text-indigo-600 transition-colors px-2 cursor-pointer">
                    Đăng nhập
                  </button>
                </Link>

                <Link href="/register">
                  <Button className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-7 h-11 font-semibold transition-all active:scale-95">
                    Đăng ký
                  </Button>
                </Link>
              </>
            ) : (
              <UserMenu />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
