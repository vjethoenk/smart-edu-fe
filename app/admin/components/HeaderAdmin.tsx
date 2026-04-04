"use client";

import { Bell, Search } from "lucide-react";

export default function HeaderAdmin() {
  return (
    <header className="bg-white border-b px-6 py-4 flex items-center justify-between max-h-[74px] ">
      <div className="relative w-2/3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          placeholder="Tìm kiếm học viên, khóa học..."
          className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        />
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-full hover:bg-gray-100 transition">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        <div className="h-6 w-[1px] bg-gray-200" />

        <div className="relative group cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 flex items-center justify-center text-white font-semibold">
              A
            </div>

            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold text-gray-700">Admin User</p>
              <p className="text-xs text-gray-400">Administrator</p>
            </div>
          </div>

          <div className="absolute right-0 mt-3 w-52 bg-white rounded-xl shadow-lg opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-all duration-200">
            <div className="flex flex-col text-sm py-2">
              <button className="px-4 py-2 text-left hover:bg-gray-100">
                Hồ sơ
              </button>
              <button className="px-4 py-2 text-left hover:bg-gray-100">
                Cài đặt
              </button>
              <button className="px-4 py-2 text-left text-red-500 hover:bg-gray-100">
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
