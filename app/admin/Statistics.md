# Statistics API Documentation

Tài liệu này mô tả các API backend để FE hiển thị dashboard và thống kê. Base route: `/statistics`.

1. GET `/statistics/overview`

- Mô tả: Trả về tổng quan nhanh (số lượng, doanh thu, đơn hàng...)
- Response (200):
  {
  "totalUsers": number,
  "totalInstructors": number,
  "totalCourses": number,
  "totalOrders": number,
  "totalRevenue": number,
  "totalEnrollments": number,
  "totalLessons": number
  }

2. GET `/statistics/revenue`

- Query params:
  - `period`: `day` | `week` | `month` | `year` (mặc định `month`)
  - `start` (optional ISO date) - bắt đầu phạm vi
  - `end` (optional ISO date) - kết thúc phạm vi
- Mô tả: Trả về doanh thu nhóm theo khoảng (mỗi phần tử có `period`, `revenue`, `orders`).
- Example: `/statistics/revenue?period=day&start=2026-05-01&end=2026-05-10`

3. GET `/statistics/revenue/monthly-chart`

- Query params: `year` (số, mặc định year hiện tại)
- Mô tả: Trả về mảng 12 object { month: "YYYY-MM", revenue: number } để FE vẽ biểu đồ theo tháng.

4. GET `/statistics/courses/top`

- Query params:
  - `type`: `revenue` | `sales` | `students` | `rating` (rating không hỗ trợ nếu chưa có dữ liệu reviews)
  - `limit`: số lượng (mặc định 10)
- Mô tả: Trả top khóa học theo `type`. Response tuỳ type, ví dụ revenue trả { courseId, title, revenue, sales }.

5. GET `/statistics/courses/completion-rate`

- Query params: `limit` (mặc định 20)
- Mô tả: Trung bình tiến độ/học viên đã hoàn thành cho mỗi khoá, sắp xếp theo tiến độ.

6. Student statistics

- GET `/statistics/students/new?start=YYYY-MM-DD&end=YYYY-MM-DD` — số học viên mới theo ngày.
- GET `/statistics/students/active?start=...&end=...` — số học viên hoạt động (dựa vào `lessonProgress` activity).
- GET `/statistics/students/progress` — trả về `avgProgress` và `completedCourses`.

7. Order statistics

- GET `/statistics/orders/summary` — tổng đơn hàng và thống kê theo `status` (count, revenue).
- GET `/statistics/orders/by-payment-method` — cố gắng nhóm theo `orderInfo` (fallback) và `currency`.

8. Video/Lesson statistics

- GET `/statistics/videos/overview` — trả `totalVideos`, `totalDuration` (tổng duration từ `lesson.completionConditions.duration`).
- GET `/statistics/videos/top-watched?limit=10` — top lessons theo `watchedSeconds` (từ `lessonProgress`).
- GET `/statistics/videos/completion-rate` — tổng `lessonProgress` và `isCompleted` percentage.

Notes / Giới hạn hiện tại

- Một số trường (ví dụ: rating, payment method) không có schema rõ ràng trong backend hiện tại. Nếu FE cần `rating` hoặc `paymentMethod`, backend cần mở rộng schema (ví dụ collection `reviews` với `rating`, và thêm `method` vào `payments`).
- Định dạng ngày: FE gửi `start`/`end` theo ISO 8601 (ví dụ `2026-05-01T00:00:00Z` hoặc `2026-05-01`).
- Các API trả dữ liệu đã được tổng hợp (aggregations). FE chịu trách nhiệm format hiển thị (chuẩn hoá tiền tệ, làm tròn, local timezone nếu cần).

Ví dụ flow FE để vẽ Dashboard Overview:

1. Gọi `/statistics/overview` để hiển thị các KPI chính.
2. Gọi `/statistics/revenue?period=month&start=2026-01-01&end=2026-06-30` để hiển thị biểu đồ doanh thu theo tháng.
3. Gọi `/statistics/courses/top?type=revenue&limit=5` và `/statistics/courses/top?type=students&limit=5` cho các lists.

Nếu muốn, FE có thể gửi thêm yêu cầu cho các endpoint để lọc theo `categoryId`, `instructorId` hoặc `courseId` — backend có thể bổ sung filter sau khi thống nhất yêu cầu.

---

If you want, I can also add pagination, role-based guards (admin-only), or Swagger decorators to the controller for improved dev experience.
