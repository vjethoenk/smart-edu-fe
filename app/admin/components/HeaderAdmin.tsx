"use client";

import {
  Bell,
  Search,
  Settings,
  User,
  LogOut,
  HelpCircle,
  Moon,
  Sun,
} from "lucide-react";
import { useState } from "react";

export default function HeaderAdmin() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 px-6 py-3 flex items-center justify-between sticky top-0 z-30 shadow-sm h-[80px]">
      {/* Search Section */}
      <div className="relative w-2/5">
        <Search
          className={cn(
            "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-200",
            searchFocused ? "text-indigo-500" : "text-gray-400",
          )}
        />
        <input
          placeholder="Tìm kiếm học viên, khóa học..."
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          className={cn(
            "w-full pl-10 pr-4 py-2.5 rounded-xl border transition-all duration-200",
            searchFocused
              ? "border-indigo-300 ring-2 ring-indigo-500/20 bg-white"
              : "border-gray-200 bg-gray-50/50 hover:bg-white",
          )}
        />
      </div>

      {/* Actions Section */}
      <div className="flex items-center gap-3">
        {/* Dark Mode Toggle */}
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="relative p-2 rounded-full hover:bg-gray-100 transition-all duration-200 group"
        >
          {isDarkMode ? (
            <Sun className="w-5 h-5 text-gray-600 group-hover:rotate-90 transition-transform" />
          ) : (
            <Moon className="w-5 h-5 text-gray-600 group-hover:rotate-12 transition-transform" />
          )}
        </button>

        {/* Notifications */}
        <div className="relative group">
          <button className="relative p-2 rounded-full hover:bg-gray-100 transition-all duration-200">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-pulse" />
          </button>

          {/* Notification dropdown */}
          <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-xl opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-all duration-200 border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-800">Thông báo</h3>
              <p className="text-xs text-gray-500 mt-1">
                Bạn có 3 thông báo mới
              </p>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="p-4 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-50"
                >
                  <p className="text-sm text-gray-700">Thông báo mới #{i}</p>
                  <p className="text-xs text-gray-400 mt-1">2 phút trước</p>
                </div>
              ))}
            </div>
            <div className="p-3 bg-gray-50 text-center">
              <button className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">
                Xem tất cả
              </button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-8 w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent" />

        {/* User Profile */}
        <div className="relative group">
          <div className="flex items-center gap-3 cursor-pointer p-1.5 rounded-xl hover:bg-gray-100 transition-all duration-200">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full blur-md opacity-60" />
              <div className="relative w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold shadow-lg">
                A
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
            </div>

            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-gray-800">
                Nguyễn Văn A
              </p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
          </div>

          {/* Dropdown menu */}
          <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-xl opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-all duration-200 border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50">
              <p className="text-sm font-semibold text-gray-800">
                Nguyễn Văn A
              </p>
              <p className="text-xs text-gray-500 mt-1">admin@smartedu.com</p>
            </div>
            <div className="py-2">
              <button className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3">
                <User className="w-4 h-4" />
                Hồ sơ cá nhân
              </button>
              <button className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3">
                <Settings className="w-4 h-4" />
                Cài đặt tài khoản
              </button>
              <button className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3">
                <HelpCircle className="w-4 h-4" />
                Trợ giúp
              </button>
            </div>
            <div className="border-t border-gray-100 py-2">
              <button className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3">
                <LogOut className="w-4 h-4" />
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
