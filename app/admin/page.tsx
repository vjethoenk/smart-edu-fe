"use client";

import { useState } from "react";
import {
  TrendingUp,
  Users,
  GraduationCap,
  BookOpen,
  DollarSign,
  ShoppingCart,
  Calendar,
  Clock,
  Award,
  Video,
  ChevronRight,
  TrendingDown,
  ArrowUpRight,
  Loader2,
  FileSpreadsheet,
} from "lucide-react";
import {
  useGetStatisticsOverview,
  useGetStatisticsRevenueMonthlyChart,
  useGetStatisticsTopCourses,
  useGetStatisticsCoursesCompletionRate,
  useGetStatisticsStudentsProgress,
  useGetStatisticsOrdersSummary,
  useGetStatisticsVideosOverview,
} from "@/features/statistics/hook";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export default function AdminDashboard() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [chartType, setChartType] = useState<"bar" | "line">("bar");
  const [topCoursesType, setTopCoursesType] = useState<"revenue" | "students">(
    "revenue",
  );
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(
    null,
  );

  // Gọi các React Query hooks lấy dữ liệu
  const { data: overview, isLoading: isOverviewLoading } =
    useGetStatisticsOverview();
  const { data: monthlyChart, isLoading: isChartLoading } =
    useGetStatisticsRevenueMonthlyChart(selectedYear);
  const { data: topRevenueCourses, isLoading: isTopRevenueLoading } =
    useGetStatisticsTopCourses({ type: "revenue", limit: 5 });
  const { data: topStudentsCourses, isLoading: isTopStudentsLoading } =
    useGetStatisticsTopCourses({ type: "students", limit: 5 });
  const { data: completionRates, isLoading: isCompletionLoading } =
    useGetStatisticsCoursesCompletionRate(5);
  const { data: studentProgress, isLoading: isProgressLoading } =
    useGetStatisticsStudentsProgress();
  const { data: ordersSummary, isLoading: isOrdersLoading } =
    useGetStatisticsOrdersSummary();
  const { data: videosOverview, isLoading: isVideosLoading } =
    useGetStatisticsVideosOverview();

  // Định dạng tiền tệ VND
  const formatVND = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  // Chuẩn hóa tháng (Ví dụ: "2026-05" -> "Tháng 5")
  const formatMonthLabel = (monthStr: string) => {
    try {
      const parts = monthStr.split("-");
      if (parts.length === 2) {
        return `T${parseInt(parts[1], 10)}`;
      }
      return monthStr;
    } catch {
      return monthStr;
    }
  };

  // Tính toán số liệu vẽ SVG
  const maxRevenue =
    monthlyChart && monthlyChart.length > 0
      ? Math.max(...monthlyChart.map((d) => d.revenue), 1000000)
      : 1000000;

  // Render Skeleton cho phần Loading
  const renderCardSkeleton = () => (
    <div className="h-32 rounded-2xl bg-white border border-slate-100 p-6 animate-pulse space-y-4">
      <div className="flex justify-between items-center">
        <div className="h-4 w-24 bg-slate-200 rounded"></div>
        <div className="h-8 w-8 bg-slate-200 rounded-lg"></div>
      </div>
      <div className="h-8 w-36 bg-slate-200 rounded"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 lg:p-8 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Hệ thống quản trị
            </span>
          </div>
          <h1 className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent lg:text-4xl">
            Tổng quan thống kê
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Chào mừng trở lại! Dưới đây là phân tích hoạt động và dữ liệu học
            tập hôm nay.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-100 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600">
            <Calendar className="h-4 w-4 text-indigo-500" />
            <span>2026-05-27</span>
          </div>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl gap-2 font-medium shadow-md shadow-indigo-100 transition-all hover:shadow-lg">
            <FileSpreadsheet className="h-4 w-4" />
            <span>Xuất báo cáo</span>
          </Button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {isOverviewLoading ? (
          Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx}>{renderCardSkeleton()}</div>
          ))
        ) : (
          <>
            {/* Card 1: Doanh Thu */}
            <div className="group relative overflow-hidden rounded-2xl bg-white border border-slate-100 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="absolute top-0 right-0 h-24 w-24 bg-gradient-to-bl from-indigo-500/10 to-transparent rounded-bl-full pointer-events-none transition-transform group-hover:scale-110"></div>
              <div className="flex justify-between items-start mb-4">
                <span className="text-sm font-semibold text-slate-500">
                  Doanh thu tổng
                </span>
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300">
                  <DollarSign className="h-5 w-5" />
                </div>
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors duration-300">
                {formatVND(overview?.totalRevenue || 0)}
              </h3>
              <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                <TrendingUp className="h-3.5 w-3.5" />
                <span>+12.4% so với tháng trước</span>
              </div>
            </div>

            {/* Card 2: Học Viên & Đăng Ký */}
            <div className="group relative overflow-hidden rounded-2xl bg-white border border-slate-100 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="absolute top-0 right-0 h-24 w-24 bg-gradient-to-bl from-emerald-500/10 to-transparent rounded-bl-full pointer-events-none transition-transform group-hover:scale-110"></div>
              <div className="flex justify-between items-start mb-4">
                <span className="text-sm font-semibold text-slate-500">
                  Học viên đăng ký
                </span>
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                  <Users className="h-5 w-5" />
                </div>
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 group-hover:text-emerald-600 transition-colors duration-300">
                {(overview?.totalUsers || 0).toLocaleString()}
              </h3>
              <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                <TrendingUp className="h-3.5 w-3.5" />
                <span>+8.2% học viên mới</span>
              </div>
            </div>

            {/* Card 3: Đơn Hàng */}
            <div className="group relative overflow-hidden rounded-2xl bg-white border border-slate-100 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="absolute top-0 right-0 h-24 w-24 bg-gradient-to-bl from-amber-500/10 to-transparent rounded-bl-full pointer-events-none transition-transform group-hover:scale-110"></div>
              <div className="flex justify-between items-start mb-4">
                <span className="text-sm font-semibold text-slate-500">
                  Đơn hàng đã bán
                </span>
                <div className="p-3 bg-amber-50 text-amber-600 rounded-xl group-hover:bg-amber-500 group-hover:text-white transition-all duration-300">
                  <ShoppingCart className="h-5 w-5" />
                </div>
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 group-hover:text-amber-600 transition-colors duration-300">
                {(overview?.totalOrders || 0).toLocaleString()}
              </h3>
              <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                <TrendingUp className="h-3.5 w-3.5" />
                <span>+15.3% tỷ lệ chuyển đổi</span>
              </div>
            </div>

            {/* Card 4: Khóa học & Nội dung */}
            <div className="group relative overflow-hidden rounded-2xl bg-white border border-slate-100 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="absolute top-0 right-0 h-24 w-24 bg-gradient-to-bl from-rose-500/10 to-transparent rounded-bl-full pointer-events-none transition-transform group-hover:scale-110"></div>
              <div className="flex justify-between items-start mb-4">
                <span className="text-sm font-semibold text-slate-500">
                  Khóa học / Bài học
                </span>
                <div className="p-3 bg-rose-50 text-rose-600 rounded-xl group-hover:bg-rose-500 group-hover:text-white transition-all duration-300">
                  <BookOpen className="h-5 w-5" />
                </div>
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 group-hover:text-rose-600 transition-colors duration-300">
                {overview?.totalCourses || 0} / {overview?.totalLessons || 0}
              </h3>
              <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-rose-500">
                <Award className="h-3.5 w-3.5" />
                <span>
                  Tổng số giảng viên: {overview?.totalInstructors || 0}
                </span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Revenue Monthly Chart Section */}
      <Card className="rounded-2xl border-slate-100 shadow-sm bg-white overflow-hidden">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-50 pb-6">
          <div>
            <CardTitle className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-indigo-500" />
              <span>Phân tích Doanh thu theo tháng</span>
            </CardTitle>
            <p className="text-xs font-medium text-slate-400 mt-1">
              Báo cáo doanh số bán khóa học qua các tháng trong năm{" "}
              {selectedYear}.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Bộ chọn định dạng biểu đồ */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl">
              <Button
                variant={chartType === "bar" ? "default" : "ghost"}
                size="sm"
                className={`rounded-lg text-xs font-semibold h-7 px-3 transition-all ${
                  chartType === "bar"
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
                onClick={() => setChartType("bar")}
              >
                Cột
              </Button>
              <Button
                variant={chartType === "line" ? "default" : "ghost"}
                size="sm"
                className={`rounded-lg text-xs font-semibold h-7 px-3 transition-all ${
                  chartType === "line"
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
                onClick={() => setChartType("line")}
              >
                Đường
              </Button>
            </div>

            {/* Bộ chọn Năm */}
            <Select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="w-28 rounded-xl bg-slate-50 border-slate-200 text-xs font-semibold h-9 focus:ring-indigo-500"
            >
              <option value="2026">Năm 2026</option>
              <option value="2025">Năm 2025</option>
              <option value="2024">Năm 2024</option>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="pt-8 relative">
          {isChartLoading ? (
            <div className="flex flex-col items-center justify-center h-80 space-y-3">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
              <p className="text-sm font-semibold text-slate-400">
                Đang tải dữ liệu biểu đồ...
              </p>
            </div>
          ) : !monthlyChart || monthlyChart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-80 text-center space-y-4">
              <div className="rounded-full bg-slate-50 p-4 text-slate-400">
                <TrendingDown className="h-8 w-8" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-slate-700">
                  Chưa có dữ liệu doanh thu
                </h4>
                <p className="text-xs text-slate-400 max-w-xs">
                  Không tìm thấy lịch sử thanh toán nào trong năm {selectedYear}
                  . Hãy thử đổi bộ lọc năm khác.
                </p>
              </div>
            </div>
          ) : (
            <div className="relative w-full overflow-hidden select-none">
              {/* Tooltip Overlay */}
              {hoveredBarIndex !== null &&
                monthlyChart[hoveredBarIndex] &&
                tooltipPos && (
                  <div
                    className="absolute z-30 pointer-events-none bg-slate-900/95 backdrop-blur-sm border border-slate-800 text-white rounded-xl p-3 shadow-xl flex flex-col gap-1 transition-all duration-150 -translate-x-1/2 -translate-y-full"
                    style={{
                      left: `${tooltipPos.x}px`,
                      top: `${tooltipPos.y - 12}px`,
                    }}
                  >
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                      Thống kê chi tiết
                    </span>
                    <span className="text-xs font-semibold text-slate-200">
                      Tháng {monthlyChart[hoveredBarIndex].month.split("-")[1]},{" "}
                      {selectedYear}
                    </span>
                    <span className="text-sm font-extrabold text-indigo-300">
                      {formatVND(monthlyChart[hoveredBarIndex].revenue)}
                    </span>
                  </div>
                )}

              {/* Custom SVG Responsive Chart */}
              <svg
                viewBox="0 0 700 300"
                className="w-full h-auto overflow-visible"
                style={{ minHeight: "260px" }}
              >
                <defs>
                  {/* Gradient fill for bars */}
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop
                      offset="100%"
                      stopColor="#4f46e5"
                      stopOpacity="0.15"
                    />
                  </linearGradient>
                  {/* Hover gradient for bars */}
                  <linearGradient id="barGradHover" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#818cf8" />
                    <stop offset="100%" stopColor="#6366f1" />
                  </linearGradient>
                  {/* Line area gradient */}
                  <linearGradient id="lineAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal Grid lines */}
                {Array.from({ length: 5 }).map((_, idx) => {
                  const y = 30 + idx * 50;
                  return (
                    <line
                      key={idx}
                      x1="40"
                      y1={y}
                      x2="680"
                      y2={y}
                      stroke="#f1f5f9"
                      strokeWidth="1.5"
                    />
                  );
                })}

                {/* Render Bars */}
                {chartType === "bar" &&
                  monthlyChart.map((d, idx) => {
                    const xSpace = 640 / monthlyChart.length;
                    const barWidth = Math.min(xSpace * 0.5, 30);
                    const x = 50 + idx * xSpace + (xSpace - barWidth) / 2;

                    const height = (d.revenue / maxRevenue) * 200;
                    const y = 230 - height;

                    const isHovered = hoveredBarIndex === idx;

                    return (
                      <g key={d.month}>
                        {/* Interactive hover background region */}
                        <rect
                          x={50 + idx * xSpace}
                          y="20"
                          width={xSpace}
                          height="220"
                          fill="transparent"
                          className="cursor-pointer"
                          onMouseEnter={(e) => {
                            setHoveredBarIndex(idx);
                            const svgRect =
                              e.currentTarget.parentElement?.parentElement?.getBoundingClientRect();
                            if (svgRect) {
                              // Calculate position relative to container
                              const relX =
                                (50 + idx * xSpace + xSpace / 2) *
                                (svgRect.width / 700);
                              const relY = y * (svgRect.height / 300);
                              setTooltipPos({ x: relX, y: relY });
                            }
                          }}
                          onMouseLeave={() => setHoveredBarIndex(null)}
                        />
                        {/* Glow effect behind hovered bar */}
                        {isHovered && (
                          <rect
                            x={x - 4}
                            y={y - 4}
                            width={barWidth + 8}
                            height={height + 8}
                            rx="6"
                            ry="6"
                            fill="#6366f1"
                            fillOpacity="0.08"
                          />
                        )}
                        {/* Main Bar */}
                        <rect
                          x={x}
                          y={y}
                          width={barWidth}
                          height={Math.max(height, 4)} // Ensure at least a line is visible
                          rx="4"
                          ry="4"
                          fill={
                            isHovered ? "url(#barGradHover)" : "url(#barGrad)"
                          }
                          className="transition-all duration-300"
                        />
                      </g>
                    );
                  })}

                {/* Render Line & Path */}
                {chartType === "line" &&
                  (() => {
                    const points = monthlyChart.map((d, idx) => {
                      const xSpace = 640 / monthlyChart.length;
                      const x = 50 + idx * xSpace + xSpace / 2;
                      const height = (d.revenue / maxRevenue) * 200;
                      const y = 230 - height;
                      return { x, y };
                    });

                    // Build smooth curve path string
                    const pathStr = points.reduce((acc, p, idx) => {
                      if (idx === 0) return `M ${p.x} ${p.y}`;
                      const prev = points[idx - 1];
                      const cpX1 = prev.x + (p.x - prev.x) / 2;
                      const cpY1 = prev.y;
                      const cpX2 = prev.x + (p.x - prev.x) / 2;
                      const cpY2 = p.y;
                      return `${acc} C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p.x} ${p.y}`;
                    }, "");

                    // Closed path for fill area
                    const areaPathStr = `${pathStr} L ${points[points.length - 1].x} 230 L ${points[0].x} 230 Z`;

                    return (
                      <g>
                        {/* Gradient fill area */}
                        <path d={areaPathStr} fill="url(#lineAreaGrad)" />
                        {/* Flowing curve line */}
                        <path
                          d={pathStr}
                          fill="none"
                          stroke="#6366f1"
                          strokeWidth="3"
                          strokeLinecap="round"
                        />
                        {/* Overlay node markers */}
                        {points.map((p, idx) => {
                          const isHovered = hoveredBarIndex === idx;
                          const xSpace = 640 / monthlyChart.length;
                          return (
                            <g key={idx}>
                              {/* Hover active highlight halo */}
                              {isHovered && (
                                <circle
                                  cx={p.x}
                                  cy={p.y}
                                  r="10"
                                  fill="#6366f1"
                                  fillOpacity="0.2"
                                />
                              )}
                              {/* Marker dot */}
                              <circle
                                cx={p.x}
                                cy={p.y}
                                r={isHovered ? "6" : "4.5"}
                                fill={isHovered ? "#4f46e5" : "#ffffff"}
                                stroke="#6366f1"
                                strokeWidth={isHovered ? "3.5" : "2.5"}
                                className="transition-all duration-200 pointer-events-none"
                              />
                              {/* Invisible interactive region */}
                              <rect
                                x={50 + idx * xSpace}
                                y="20"
                                width={xSpace}
                                height="220"
                                fill="transparent"
                                className="cursor-pointer"
                                onMouseEnter={(e) => {
                                  setHoveredBarIndex(idx);
                                  const svgRect =
                                    e.currentTarget.parentElement?.parentElement?.getBoundingClientRect();
                                  if (svgRect) {
                                    const relX = p.x * (svgRect.width / 700);
                                    const relY = p.y * (svgRect.height / 300);
                                    setTooltipPos({ x: relX, y: relY });
                                  }
                                }}
                                onMouseLeave={() => setHoveredBarIndex(null)}
                              />
                            </g>
                          );
                        })}
                      </g>
                    );
                  })()}

                {/* X Axis Labels */}
                {monthlyChart.map((d, idx) => {
                  const xSpace = 640 / monthlyChart.length;
                  const x = 50 + idx * xSpace + xSpace / 2;
                  const label = formatMonthLabel(d.month);
                  const isHovered = hoveredBarIndex === idx;

                  return (
                    <text
                      key={d.month}
                      x={x}
                      y="255"
                      textAnchor="middle"
                      fill={isHovered ? "#4f46e5" : "#64748b"}
                      className={`text-[10px] transition-colors font-bold ${
                        isHovered ? "scale-105" : ""
                      }`}
                    >
                      {label}
                    </text>
                  );
                })}

                {/* X Axis base line */}
                <line
                  x1="40"
                  y1="230"
                  x2="680"
                  y2="230"
                  stroke="#cbd5e1"
                  strokeWidth="2"
                />
              </svg>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Grid: 2 Columns (Top Courses & Learning stats) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Column 1: Top Courses list */}
        <Card className="rounded-2xl border-slate-100 shadow-sm bg-white overflow-hidden">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-50 pb-6">
            <div>
              <CardTitle className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <Award className="h-5 w-5 text-indigo-500" />
                <span>Khóa học nổi bật nhất</span>
              </CardTitle>
              <p className="text-xs font-medium text-slate-400 mt-1">
                Danh sách những khóa học mang lại giá trị cao nhất hệ thống.
              </p>
            </div>

            {/* Tabs chọn Top type */}
            <div className="flex bg-slate-100 p-1 rounded-xl shrink-0 self-start sm:self-center">
              <Button
                variant={topCoursesType === "revenue" ? "default" : "ghost"}
                size="sm"
                className={`rounded-lg text-xs font-semibold h-7 px-3 transition-all ${
                  topCoursesType === "revenue"
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
                onClick={() => setTopCoursesType("revenue")}
              >
                Doanh thu
              </Button>
              <Button
                variant={topCoursesType === "students" ? "default" : "ghost"}
                size="sm"
                className={`rounded-lg text-xs font-semibold h-7 px-3 transition-all ${
                  topCoursesType === "students"
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
                onClick={() => setTopCoursesType("students")}
              >
                Học viên
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {/* Loading / Content */}
            {(
              topCoursesType === "revenue"
                ? isTopRevenueLoading
                : isTopStudentsLoading
            ) ? (
              <div className="p-12 flex flex-col items-center justify-center space-y-3">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                <p className="text-sm font-semibold text-slate-400">
                  Đang tải danh sách khóa học...
                </p>
              </div>
            ) : (
              (() => {
                const courses =
                  topCoursesType === "revenue"
                    ? topRevenueCourses
                    : topStudentsCourses;
                if (!courses || courses.length === 0) {
                  return (
                    <div className="p-12 text-center text-sm font-semibold text-slate-400">
                      Không có khóa học nào để thống kê.
                    </div>
                  );
                }
                return (
                  <div className="divide-y divide-slate-50">
                    {courses.map((course, index) => {
                      const numberMetric =
                        topCoursesType === "revenue"
                          ? formatVND(course.revenue || 0)
                          : `${(course.students || course.sales || 0).toLocaleString()} học viên`;

                      const subMetric =
                        topCoursesType === "revenue"
                          ? `${course.sales || 0} lượt mua`
                          : `${formatVND(course.revenue || 0)} doanh thu`;

                      return (
                        <div
                          key={course.courseId || index}
                          className="flex items-center justify-between p-5 hover:bg-slate-50/50 transition-colors duration-200 group"
                        >
                          <div className="flex items-center gap-4">
                            {/* Rank Icon */}
                            <div
                              className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-extrabold shrink-0 shadow-sm ${
                                index === 0
                                  ? "bg-amber-100 text-amber-700 border border-amber-200"
                                  : index === 1
                                    ? "bg-slate-100 text-slate-700 border border-slate-200"
                                    : index === 2
                                      ? "bg-orange-100 text-orange-700 border border-orange-200"
                                      : "bg-slate-50 text-slate-500"
                              }`}
                            >
                              #{index + 1}
                            </div>
                            {/* Title */}
                            <div className="space-y-0.5">
                              <h4 className="text-sm font-bold text-slate-800 line-clamp-1 max-w-[200px] sm:max-w-[300px] group-hover:text-indigo-600 transition-colors duration-200">
                                {course.title}
                              </h4>
                              <p className="text-xs font-medium text-slate-400">
                                {subMetric}
                              </p>
                            </div>
                          </div>

                          {/* Metric Badge */}
                          <div className="text-right">
                            <span className="text-sm font-extrabold text-slate-900 bg-slate-50 border border-slate-100 py-1.5 px-3 rounded-xl shadow-2xs">
                              {numberMetric}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()
            )}
          </CardContent>
        </Card>

        {/* Column 2: Progress & Lesson stats */}
        <Card className="rounded-2xl border-slate-100 shadow-sm bg-white overflow-hidden flex flex-col justify-between">
          <CardHeader className="border-b border-slate-50 pb-6">
            <CardTitle className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-indigo-500" />
              <span>Tiến độ và Bài giảng</span>
            </CardTitle>
            <p className="text-xs font-medium text-slate-400 mt-1">
              Thống kê về bài giảng đa phương tiện và mức độ hoàn thành bài học.
            </p>
          </CardHeader>
          <CardContent className="p-6 space-y-8 flex-1 flex flex-col justify-center">
            {isProgressLoading || isVideosLoading ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-3">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                <p className="text-sm font-semibold text-slate-400">
                  Đang tải tiến độ học tập...
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {/* Ring 1: Tiến độ Học viên */}
                <div className="flex flex-col items-center text-center space-y-4 bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
                  <div className="relative h-28 w-28 flex items-center justify-center">
                    {/* Ring SVG background */}
                    <svg
                      className="absolute inset-0 transform -rotate-90"
                      viewBox="0 0 100 100"
                    >
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="#e2e8f0"
                        strokeWidth="8"
                        fill="transparent"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="#6366f1"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={251.2}
                        strokeDashoffset={
                          251.2 -
                          (251.2 * (studentProgress?.avgProgress || 0)) / 100
                        }
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>
                    <span className="text-2xl font-extrabold text-slate-800">
                      {Math.round(studentProgress?.avgProgress || 0)}%
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">
                      Tiến độ trung bình
                    </h4>
                    <p className="text-xs font-semibold text-slate-400 mt-1">
                      Mức hoàn thành bài học trung bình của mỗi học viên.
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className="border-indigo-100 bg-indigo-50/50 text-indigo-600 text-[10px] font-bold px-2.5 py-1"
                  >
                    Đã hoàn thành: {studentProgress?.completedCourses || 0} khóa
                  </Badge>
                </div>

                {/* Ring 2: Thống kê Video nội dung */}
                <div className="flex flex-col items-center text-center space-y-4 bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
                  <div className="relative h-28 w-28 flex items-center justify-center">
                    {/* Video Icon container */}
                    <div className="h-20 w-20 rounded-full bg-gradient-to-tr from-rose-500 to-pink-500 shadow-md flex items-center justify-center text-white">
                      <Video className="h-8 w-8 animate-pulse" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">
                      Tài nguyên bài giảng
                    </h4>
                    <p className="text-xs font-semibold text-slate-400 mt-1">
                      Hệ thống lưu trữ tổng số bài học đa phương tiện.
                    </p>
                  </div>

                  <div className="w-full grid grid-cols-2 gap-2 text-left bg-white border border-slate-100 p-2.5 rounded-xl">
                    <div className="space-y-0.5 border-r border-slate-100 pr-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        Bài giảng
                      </span>
                      <p className="text-xs font-extrabold text-slate-800">
                        {videosOverview?.totalVideos || 0} Video
                      </p>
                    </div>
                    <div className="space-y-0.5 pl-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        Thời lượng
                      </span>
                      <p className="text-xs font-extrabold text-slate-800 line-clamp-1">
                        {Math.round(
                          (videosOverview?.totalDuration || 0) / 3600,
                        )}{" "}
                        giờ
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Orders and Payments Stats Section */}
      <Card className="rounded-2xl border-slate-100 shadow-sm bg-white overflow-hidden">
        <CardHeader className="border-b border-slate-50 pb-6">
          <CardTitle className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-indigo-500" />
            <span>Thống kê Giao dịch & Đơn hàng</span>
          </CardTitle>
          <p className="text-xs font-medium text-slate-400 mt-1">
            Theo dõi chi tiết tình trạng thanh toán và doanh thu thực tế.
          </p>
        </CardHeader>
        <CardContent className="p-6">
          {isOrdersLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
            </div>
          ) : !ordersSummary ? (
            <div className="text-center py-6 text-slate-400 text-sm font-semibold">
              Không có giao dịch nào được ghi nhận.
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-400 uppercase">
                    Tổng doanh thu bán hàng
                  </span>
                  <h3 className="text-3xl font-extrabold text-slate-900">
                    {formatVND(ordersSummary.totalRevenue || 0)}
                  </h3>
                </div>
                <div className="flex items-center gap-2 bg-indigo-50/50 border border-indigo-100 rounded-xl px-4 py-2 text-indigo-600">
                  <ShoppingCart className="h-4.5 w-4.5" />
                  <span className="text-xs font-extrabold">
                    Tổng cộng: {ordersSummary.totalOrders || 0} đơn hàng
                  </span>
                </div>
              </div>

              {/* Progress bars of orders breakdown */}
              <div className="space-y-4 pt-4 border-t border-slate-50">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Trạng thái đơn hàng
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {ordersSummary.statusSummary?.map((item) => {
                    const statusText =
                      item.status === "completed" || item.status === "COMPLETED"
                        ? "Thành công"
                        : item.status === "failed" || item.status === "FAILED"
                          ? "Thất bại"
                          : "Đang chờ thanh toán";

                    const colorClass =
                      item.status === "completed" || item.status === "COMPLETED"
                        ? "bg-emerald-500"
                        : item.status === "failed" || item.status === "FAILED"
                          ? "bg-rose-500"
                          : "bg-amber-500";

                    const percent = ordersSummary.totalOrders
                      ? (item.count / ordersSummary.totalOrders) * 100
                      : 0;

                    return (
                      <div
                        key={item.status}
                        className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 space-y-2 hover:border-slate-200 transition-colors"
                      >
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-slate-700">
                            {statusText}
                          </span>
                          <span className="font-extrabold text-slate-800">
                            {item.count} đơn ({Math.round(percent)}%)
                          </span>
                        </div>
                        <Progress
                          value={percent}
                          className={`h-2 [&>div]:${colorClass}`}
                        />
                        <p className="text-xs font-extrabold text-slate-600 pt-1">
                          Tổng tiền: {formatVND(item.revenue || 0)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
