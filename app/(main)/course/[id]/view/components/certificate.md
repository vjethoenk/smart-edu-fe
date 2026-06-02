# Xây dựng giao diện Chứng chỉ Hoàn thành khóa học cho hệ thống SmartEdu

Hãy đóng vai Senior Frontend Developer và xây dựng giao diện chức năng Chứng chỉ hoàn thành khóa học cho hệ thống E-Learning SmartEdu bằng:

* React 19
* TypeScript
* TailwindCSS
* Shadcn UI
* React Query
* Axios
* React Router DOM

Yêu cầu code production-ready, responsive và UI hiện đại.

---

# API Backend

## Nhận chứng chỉ

GET /certificates/course/:courseId

Authorization:

```http
Bearer Token
```

Response:

```json
{
  "statusCode": 200,
  "message": "Nhận chứng chỉ thành công!",
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

## Xem chứng chỉ

GET /certificates/:code/view

Ví dụ:

```text
http://localhost:8000/certificates/SE-2026-4829-9182/view
```

---

## Xác thực chứng chỉ

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

# Chức năng 1: Nút nhận chứng chỉ

Trong trang học khóa học:

Nếu progress = 100%

Hiển thị button:

```text
🎓 Nhận chứng chỉ hoàn thành
```

UI:

* Nút nổi bật
* Gradient xanh tím
* Có icon Award/Lucide
* Hover animation

Khi click:

```typescript
GET /certificates/course/:courseId
```

Sau khi thành công:

Mở modal chúc mừng.

---

# Chức năng 2: Modal chứng chỉ

Tạo component:

```text
CertificateModal.tsx
```

Hiển thị:

```text
🎉 Chúc mừng bạn đã hoàn thành khóa học!
```

Thông tin:

* Tên học viên
* Tên khóa học
* Ngày cấp
* Mã chứng chỉ

---

Preview chứng chỉ:

```tsx
<img
  src={`${API_URL}/certificates/${certificateCode}/view`}
  alt="Certificate"
/>
```

Yêu cầu:

* Responsive
* Border đẹp
* Shadow
* Zoom nhẹ khi hover

---

# Chức năng 3: Tải PDF / In chứng chỉ

Button:

```text
📄 Tải PDF / In chứng chỉ
```

Khi click:

```typescript
const printWindow = window.open(
  `${API_URL}/certificates/${certificateCode}/view`,
  "_blank"
);

if (printWindow) {
  setTimeout(() => {
    printWindow.print();
  }, 1000);
}
```

Hiển thị loading trong khi mở.

---

# Chức năng 4: Chia sẻ chứng chỉ

Button:

```text
🔗 Chia sẻ chứng chỉ
```

Link:

```text
https://smartedu.com/verify-certificate?code=SE-2026-4829-9182
```

Hỗ trợ:

* Copy link
* LinkedIn
* Facebook
* Email

Sau khi copy:

```text
Đã sao chép liên kết chứng chỉ
```

Sử dụng toast của Shadcn UI.

---

# Chức năng 5: Trang xác thực chứng chỉ

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
✅ Chứng chỉ hợp lệ
```

Card thông tin:

* Học viên
* Khóa học
* Mã chứng chỉ
* Ngày cấp

Kèm icon ShieldCheck.

---

Nếu không hợp lệ

Hiển thị:

```text
❌ Chứng chỉ không tồn tại hoặc đã bị thu hồi
```

Kèm icon AlertTriangle.


Yêu cầu sinh đầy đủ:

* TypeScript Types
* Axios Service
* React Query Hooks
* Shadcn Dialog
* Toast Notification
* Responsive UI
* TailwindCSS Styling
* Loading State
* Error State
* Verify Certificate Page
* Certificate Modal
* Share Certificate Component
* Production Ready Source Code
