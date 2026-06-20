# Xây dựng giao diện giấy khen Hoàn thành khóa học cho hệ thống SmartEdu

Hãy đóng vai Senior Frontend Developer và xây dựng giao diện chức năng giấy khen hoàn thành khóa học cho hệ thống E-Learning SmartEdu bằng:

- React 19
- TypeScript
- TailwindCSS
- Shadcn UI
- React Query
- Axios
- React Router DOM

Yêu cầu code production-ready, responsive và UI hiện đại.

---

# API Backend

## Nhận giấy khen

GET /certificates/course/:courseId

Authorization:

```http
Bearer Token
```

Response:

```json
{
  "statusCode": 200,
  "message": "Nhận giấy khen thành công!",
  "data": {
    "_id": "647a32e185c",
    "certificateCode": "SE-2026-4829-9182",
    "issuedAt": "2026-06-02T16:30:00.000Z",
    "userId": {
      "name": "Nguyễn Văn A",
      "email": "student@gmail.com"
    },
    "courseId": {
      "title": "Lập trình NodeJS nâng cao"
    }
  }
}
```

---

## Xem giấy khen

GET /certificates/:code/view

Ví dụ:

```text
http://localhost:8000/certificates/SE-2026-4829-9182/view
```

---

## Xác thực giấy khen

GET /certificates/verify/:code

Response:

```json
{
  "statusCode": 200,
  "data": {
    "isValid": true,
    "certificateCode": "SE-2026-4829-9182",
    "studentName": "Nguyễn Văn A",
    "courseTitle": "Lập trình NodeJS nâng cao",
    "issuedAt": "2026-06-02T16:30:00.000Z"
  }
}
```

---

# Chức năng 1: Nút nhận giấy khen

Trong trang học khóa học:

Nếu progress = 100%

Hiển thị button:

```text
🎓 Nhận giấy khen hoàn thành
```

UI:

- Nút nổi bật
- Gradient xanh tím
- Có icon Award/Lucide
- Hover animation

Khi click:

```typescript
GET /certificates/course/:courseId
```

Sau khi thành công:

Mở modal chúc mừng.

---

# Chức năng 2: Modal giấy khen

Tạo component:

```text
CertificateModal.tsx
```

Hiển thị:

```text
🎉 Chúc mừng bạn đã hoàn thành khóa học!
```

Thông tin:

- Tên học viên
- Tên khóa học
- Ngày cấp
- Mã giấy khen

---

Preview giấy khen:

```tsx
<img
  src={`${API_URL}/certificates/${certificateCode}/view`}
  alt="Certificate"
/>
```

Yêu cầu:

- Responsive
- Border đẹp
- Shadow
- Zoom nhẹ khi hover

---

# Chức năng 3: Tải PDF / In giấy khen

Button:

```text
📄 Tải PDF / In giấy khen
```

Khi click:

```typescript
const printWindow = window.open(
  `${API_URL}/certificates/${certificateCode}/view`,
  "_blank",
);

if (printWindow) {
  setTimeout(() => {
    printWindow.print();
  }, 1000);
}
```

Hiển thị loading trong khi mở.

---

# Chức năng 4: Chia sẻ giấy khen

Button:

```text
🔗 Chia sẻ giấy khen
```

Link:

```text
https://smartedu.com/verify-certificate?code=SE-2026-4829-9182
```

Hỗ trợ:

- Copy link
- LinkedIn
- Facebook
- Email

Sau khi copy:

```text
Đã sao chép liên kết giấy khen
```

Sử dụng toast của Shadcn UI.

---

# Chức năng 5: Trang xác thực giấy khen

Route:

```text
/verify-certificate
```

Đọc query:

```typescript
?code=SE-2026-4829-9182
```

Gọi API:

```typescript
GET /certificates/verify/:code
```

---

Nếu hợp lệ

Hiển thị:

```text
✅ giấy khen hợp lệ
```

Card thông tin:

- Học viên
- Khóa học
- Mã giấy khen
- Ngày cấp

Kèm icon ShieldCheck.

---

Nếu không hợp lệ

Hiển thị:

```text
❌ giấy khen không tồn tại hoặc đã bị thu hồi
```

Kèm icon AlertTriangle.

Yêu cầu sinh đầy đủ:

- TypeScript Types
- Axios Service
- React Query Hooks
- Shadcn Dialog
- Toast Notification
- Responsive UI
- TailwindCSS Styling
- Loading State
- Error State
- Verify Certificate Page
- Certificate Modal
- Share Certificate Component
- Production Ready Source Code
