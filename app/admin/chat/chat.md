# 📱 CHAT REALTIME API DOCUMENTATION

## 📋 Mục lục

1. [Tổng quan](#tổng-quan)
2. [Cài đặt Socket.io Client](#cài-đặt-socketio-client)
3. [WebSocket Events](#websocket-events)
4. [REST API Endpoints](#rest-api-endpoints)
5. [Flow sử dụng](#flow-sử-dụng)
6. [Code Examples](#code-examples)
7. [Error Handling](#error-handling)

---

## 🎯 Tổng quan

Hệ thống chat realtime cho phép:

- **Học viên** nhắn tin với **Giảng viên** trong một khóa học cụ thể
- Gửi tin nhắn text, image, file
- Thông báo typing indicator (đang gõ)
- Đánh dấu tin nhắn đã đọc
- Lưu trữ và tìm kiếm tin nhắn

**Architecture:**

- **Backend:** NestJS + MongoDB + Socket.io
- **Protocol:** WebSocket + REST API
- **Namespace:** `/chat`
- **Authentication:** JWT Token

---

## 📦 Cài đặt Socket.io Client

### 1. Cài đặt package

```bash
npm install socket.io-client
# hoặc
yarn add socket.io-client
```

### 2. Import và khởi tạo

```typescript
import { io } from "socket.io-client";

const socket = io("http://localhost:3000/chat", {
  auth: {
    token: localStorage.getItem("access_token"), // JWT token từ login
  },
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5,
});
```

### 3. Kiểm tra kết nối

```typescript
// Listen sự kiện connection thành công
socket.on("connection_success", (data) => {
  console.log("Connected:", data);
  // Response: { message: 'Kết nối thành công', userId: 'xxx' }
});

// Listen lỗi kết nối
socket.on("connect_error", (error) => {
  console.error("Connection error:", error);
});

// Listen disconnect
socket.on("disconnect", () => {
  console.log("Disconnected from server");
});
```

---

## 🔌 WebSocket Events

### Event 1: Vào Khóa Học (Join Course)

**Khi học viên vào khóa học, phải join vào room tương ứng**

```typescript
// Frontend emit
socket.emit("joinCourse", { courseId: "65f1a2b3c4d5e6f7g8h9i0j1" });

// Backend response
socket.on("joinCourse", (response) => {
  console.log(response); // { success: true, message: 'Joined course' }
});

// Các user khác trong room được thông báo
socket.on("userJoinedCourse", (data) => {
  console.log(data);
  // { userId: 'xxx', email: 'user@example.com', timestamp: '2024-05-26...' }
});
```

---

### Event 2: Gửi Tin Nhắn (Send Message)

**Gửi tin nhắn trong một khóa học**

```typescript
// Frontend emit
socket.emit("sendMessage", {
  courseId: "65f1a2b3c4d5e6f7g8h9i0j1",
  receiverId: "65f1a2b3c4d5e6f7g8h9i0j2", // ID giảng viên
  message: "Xin chào thầy/cô, em có câu hỏi về bài học",
  messageType: "text", // 'text' | 'image' | 'file'
  // Nếu gửi file/image
  fileUrl: "https://s3.amazonaws.com/file-name.pdf",
  fileName: "document.pdf",
});

// Backend response - tin nhắn được lưu
socket.on("messageSent", (message) => {
  console.log("Message saved:", message);
  // {
  //   _id: '65f1a2b3c4d5e6f7g8h9i0j3',
  //   courseId: '...',
  //   senderId: '...',
  //   receiverId: '...',
  //   message: '...',
  //   messageType: 'text',
  //   isRead: false,
  //   createdAt: '2024-05-26T10:00:00.000Z',
  //   status: 'sent'
  // }
});

// Receiver được thông báo tin nhắn mới
socket.on("newMessage", (message) => {
  console.log("Received message:", message);
  // Cập nhật UI để hiển thị tin nhắn mới
});

// Nếu có lỗi
socket.on("messageError", (error) => {
  console.error("Error:", error.error);
});
```

---

### Event 3: Typing Indicator (Đang gõ)

```typescript
// Frontend emit - người dùng bắt đầu gõ
socket.emit("typing", {
  courseId: "65f1a2b3c4d5e6f7g8h9i0j1",
  receiverId: "65f1a2b3c4d5e6f7g8h9i0j2",
});

// Receiver nhận được thông báo
socket.on("userTyping", (data) => {
  console.log(data);
  // { courseId: '...', userId: '...', email: 'user@example.com' }
  // Hiển thị "user@example.com đang gõ..."
});

// Frontend emit - người dùng dừng gõ
socket.emit("stopTyping", {
  courseId: "65f1a2b3c4d5e6f7g8h9i0j1",
  receiverId: "65f1a2b3c4d5e6f7g8h9i0j2",
});

// Receiver nhận được thông báo
socket.on("userStopTyping", (data) => {
  console.log(data); // { courseId: '...', userId: '...' }
  // Ẩn thông báo "đang gõ"
});
```

---

### Event 4: Đánh dấu đã đọc

```typescript
// Frontend emit
socket.emit("markAsRead", { chatId: "65f1a2b3c4d5e6f7g8h9i0j3" });

// Backend response
socket.on("markAsRead", (response) => {
  console.log(response); // { success: true }
});

// Sender được thông báo
socket.on("messageRead", (data) => {
  console.log(data);
  // { chatId: '...', readAt: '2024-05-26T10:05:00.000Z', readBy: 'userId' }
  // Hiển thị dấu tích cho tin nhắn
});
```

---

### Event 5: Vào Cuộc Trò Chuyện Riêng (Join Private Chat)

```typescript
// Frontend emit
socket.emit("joinPrivateChat", {
  courseId: "65f1a2b3c4d5e6f7g8h9i0j1",
  otherUserId: "65f1a2b3c4d5e6f7g8h9i0j2",
});

// Backend response
socket.on("joinPrivateChat", (response) => {
  console.log(response);
  // { success: true, roomName: 'private_65f1a2b3c4d5e6f7g8h9i0j1_xxx_yyy' }
});
```

---

### Event 6: Rời Khóa Học (Leave Course)

```typescript
// Frontend emit
socket.emit("leaveCourse", { courseId: "65f1a2b3c4d5e6f7g8h9i0j1" });

// Backend response
socket.on("leaveCourse", (response) => {
  console.log(response); // { success: true, message: 'Left course' }
});

// Các user khác được thông báo
socket.on("userLeftCourse", (data) => {
  console.log(data); // { userId: '...', timestamp: '...' }
});
```

---

## 🔗 REST API Endpoints

### 1. POST - Tạo Tin Nhắn

```
POST /v1/chat/message
Authorization: Bearer <JWT_TOKEN>

Request body:
{
  "courseId": "65f1a2b3c4d5e6f7g8h9i0j1",
  "receiverId": "65f1a2b3c4d5e6f7g8h9i0j2",
  "message": "Xin chào thầy/cô",
  "messageType": "text",
  "fileUrl": "https://...",
  "fileName": "document.pdf"
}

Response 201:
{
  "_id": "65f1a2b3c4d5e6f7g8h9i0j3",
  "courseId": "...",
  "senderId": "...",
  "receiverId": "...",
  "message": "Xin chào thầy/cô",
  "messageType": "text",
  "isRead": false,
  "createdAt": "2024-05-26T10:00:00.000Z"
}
```

---

### 2. GET - Lấy Tin Nhắn Theo Khóa Học

```
GET /v1/chat/messages/:courseId?page=1&limit=50
Authorization: Bearer <JWT_TOKEN>

Query parameters:
- page: số trang (default: 1)
- limit: số tin nhắn per page (default: 50, max: 100)

Response 200:
{
  "data": [
    {
      "_id": "...",
      "courseId": "...",
      "senderId": {
        "_id": "...",
        "name": "Nguyễn Văn A",
        "email": "a@example.com",
        "avatar": "https://..."
      },
      "receiverId": {
        "_id": "...",
        "name": "Trần Thị B",
        "email": "b@example.com",
        "avatar": "https://..."
      },
      "message": "Xin chào",
      "messageType": "text",
      "isRead": true,
      "readAt": "2024-05-26T10:05:00.000Z",
      "createdAt": "2024-05-26T10:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 120,
    "pages": 3
  }
}
```

---

### 3. GET - Lấy Danh Sách Cuộc Trò Chuyện

```
GET /v1/chat/conversations/:courseId
Authorization: Bearer <JWT_TOKEN>

Response 200:
[
  {
    "_id": {
      "courseId": "...",
      "participant1": "..."
    },
    "lastMessage": "Hello, how are you?",
    "lastMessageTime": "2024-05-26T10:00:00.000Z",
    "unreadCount": 3,
    "otherUser": {
      "_id": "65f1a2b3c4d5e6f7g8h9i0j2",
      "name": "Trần Thị B",
      "email": "b@example.com",
      "avatar": "https://..."
    }
  }
]
```

---

### 4. GET - Lấy Cuộc Trò Chuyện Giữa 2 User

```
GET /v1/chat/conversation/:courseId/:otherUserId?page=1&limit=50
Authorization: Bearer <JWT_TOKEN>

Response 200:
{
  "data": [
    {
      "_id": "...",
      "courseId": "...",
      "senderId": { ... },
      "receiverId": { ... },
      "message": "...",
      "messageType": "text",
      "isRead": true,
      "createdAt": "2024-05-26T10:00:00.000Z"
    }
  ],
  "pagination": { ... }
}
```

---

### 5. POST - Đánh dấu tin nhắn đã đọc

```
POST /v1/chat/message/:chatId/read
Authorization: Bearer <JWT_TOKEN>

Response 200:
{
  "_id": "65f1a2b3c4d5e6f7g8h9i0j3",
  "isRead": true,
  "readAt": "2024-05-26T10:05:00.000Z"
}
```

---

### 6. POST - Đánh dấu tất cả tin nhắn từ user đã đọc

```
POST /v1/chat/conversation/:courseId/:receiverId/read-all
Authorization: Bearer <JWT_TOKEN>

Response 200:
{
  "modifiedCount": 5,
  "message": "Marked 5 messages as read"
}
```

---

### 7. DELETE - Xóa Tin Nhắn

```
DELETE /v1/chat/message/:chatId
Authorization: Bearer <JWT_TOKEN>

Response 200:
{
  "_id": "65f1a2b3c4d5e6f7g8h9i0j3",
  "message": "Deleted successfully"
}
```

---

### 8. GET - Lấy Số Tin Nhắn Chưa Đọc

```
GET /v1/chat/unread-count?courseId=65f1a2b3c4d5e6f7g8h9i0j1 (optional)
Authorization: Bearer <JWT_TOKEN>

Response 200:
{
  "count": 5
}
```

---

### 9. GET - Tìm Kiếm Tin Nhắn

```
GET /v1/chat/search/:courseId?q=hello
Authorization: Bearer <JWT_TOKEN>

Query parameters:
- q: Nội dung tìm kiếm (bắt buộc)

Response 200:
[
  {
    "_id": "...",
    "message": "Hello, how are you?",
    "senderId": { ... },
    "receiverId": { ... },
    "messageType": "text",
    "createdAt": "2024-05-26T10:00:00.000Z"
  }
]
```

---

## 🔄 Flow sử dụng

### Flow 1: Học Viên Nhắn Tin Với Giảng Viên

```
1. Học viên vào khóa học
   │
   ├─> Frontend emit 'joinCourse' với courseId
   │
   ├─> Backend tạo room 'course_<courseId>'
   │
   └─> Học viên được add vào room

2. Học viên gõ tin nhắn
   │
   ├─> Frontend emit 'typing' (tùy chọn)
   │
   ├─> Backend gửi 'userTyping' cho receiver
   │
   └─> Receiver thấy "X đang gõ..."

3. Học viên gửi tin nhắn
   │
   ├─> Frontend emit 'sendMessage'
   │
   ├─> Backend:
   │   ├─> Lưu vào MongoDB
   │   ├─> Emit 'messageSent' cho sender
   │   └─> Emit 'newMessage' cho receiver
   │
   ├─> Frontend cập nhật UI
   │
   └─> Receiver thấy tin nhắn mới

4. Receiver đọc tin nhắn
   │
   ├─> Frontend emit 'markAsRead'
   │
   ├─> Backend:
   │   ├─> Update isRead = true
   │   └─> Emit 'messageRead' cho sender
   │
   └─> Sender thấy dấu tích
```

---

### Flow 2: Tải Lịch Sử Chat

```
1. Mở cuộc trò chuyện
   │
   ├─> GET /v1/chat/conversation/:courseId/:otherUserId
   │
   ├─> Backend trả về tin nhắn (sorted by createdAt)
   │
   └─> Frontend hiển thị tin nhắn trên UI

2. Scroll lên để tải tin nhắn cũ
   │
   ├─> GET /v1/chat/conversation/:courseId/:otherUserId?page=2
   │
   ├─> Backend trả về tin nhắn trang 2
   │
   └─> Frontend thêm tin nhắn vào đầu danh sách
```

---

### Flow 3: Thông Báo Tin Nhắn Chưa Đọc

```
1. Mở ứng dụng
   │
   ├─> GET /v1/chat/unread-count
   │
   ├─> Backend trả về số tin chưa đọc
   │
   └─> Frontend hiển thị badge trên icon chat

2. Vào khóa học
   │
   ├─> GET /v1/chat/conversations/:courseId
   │
   ├─> Backend trả về danh sách conversations với unreadCount
   │
   └─> Frontend hiển thị số chưa đọc cho mỗi conversation
```

---

## 💻 Code Examples

### Example 1: Vue 3 Composition API

```typescript
// composables/useChat.ts
import { ref, onMounted, onUnmounted } from "vue";
import { io, Socket } from "socket.io-client";

export function useChat(courseId: string) {
  const socket = ref<Socket | null>(null);
  const messages = ref<any[]>([]);
  const isConnected = ref(false);
  const typing = ref<string | null>(null);

  onMounted(() => {
    // Kết nối WebSocket
    const token = localStorage.getItem("access_token");
    socket.value = io("http://localhost:3000/chat", {
      auth: { token },
    });

    // Listen sự kiện
    socket.value.on("connection_success", () => {
      isConnected.value = true;
      socket.value?.emit("joinCourse", { courseId });
    });

    socket.value.on("newMessage", (message) => {
      messages.value.push(message);
    });

    socket.value.on("userTyping", (data) => {
      typing.value = `${data.email} đang gõ...`;
    });

    socket.value.on("userStopTyping", () => {
      typing.value = null;
    });

    socket.value.on("messageRead", (data) => {
      const msg = messages.value.find((m) => m._id === data.chatId);
      if (msg) msg.isRead = true;
    });
  });

  const sendMessage = (receiverId: string, text: string) => {
    socket.value?.emit("sendMessage", {
      courseId,
      receiverId,
      message: text,
      messageType: "text",
    });
  };

  const markAsRead = (chatId: string) => {
    socket.value?.emit("markAsRead", { chatId });
  };

  const handleTyping = (receiverId: string) => {
    socket.value?.emit("typing", { courseId, receiverId });
  };

  onUnmounted(() => {
    socket.value?.emit("leaveCourse", { courseId });
    socket.value?.disconnect();
  });

  return {
    socket,
    messages,
    isConnected,
    typing,
    sendMessage,
    markAsRead,
    handleTyping,
  };
}
```

---

### Example 2: React with Hooks

```typescript
// hooks/useChat.ts
import { useEffect, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";

export function useChat(courseId: string) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [typing, setTyping] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const newSocket = io("http://localhost:3000/chat", {
      auth: { token },
    });

    newSocket.on("connection_success", () => {
      setIsConnected(true);
      newSocket.emit("joinCourse", { courseId });
    });

    newSocket.on("newMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    newSocket.on("userTyping", (data) => {
      setTyping(`${data.email} đang gõ...`);
    });

    newSocket.on("userStopTyping", () => {
      setTyping(null);
    });

    setSocket(newSocket);

    return () => {
      newSocket.emit("leaveCourse", { courseId });
      newSocket.disconnect();
    };
  }, [courseId]);

  const sendMessage = useCallback(
    (receiverId: string, text: string) => {
      socket?.emit("sendMessage", {
        courseId,
        receiverId,
        message: text,
        messageType: "text",
      });
    },
    [socket, courseId],
  );

  const markAsRead = useCallback(
    (chatId: string) => {
      socket?.emit("markAsRead", { chatId });
    },
    [socket],
  );

  return {
    socket,
    messages,
    isConnected,
    typing,
    sendMessage,
    markAsRead,
  };
}
```

---

### Example 3: Angular Service

```typescript
// services/chat.service.ts
import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { io, Socket } from "socket.io-client";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ChatService {
  private socket: Socket | null = null;
  private messagesSubject = new BehaviorSubject<any[]>([]);
  public messages$ = this.messagesSubject.asObservable();

  private typingSubject = new BehaviorSubject<string | null>(null);
  public typing$ = this.typingSubject.asObservable();

  constructor(private http: HttpClient) {}

  connect(token: string): void {
    this.socket = io("http://localhost:3000/chat", {
      auth: { token },
    });

    this.socket.on("newMessage", (message) => {
      const current = this.messagesSubject.value;
      this.messagesSubject.next([...current, message]);
    });

    this.socket.on("userTyping", (data) => {
      this.typingSubject.next(`${data.email} đang gõ...`);
    });

    this.socket.on("userStopTyping", () => {
      this.typingSubject.next(null);
    });
  }

  joinCourse(courseId: string): void {
    this.socket?.emit("joinCourse", { courseId });
  }

  sendMessage(courseId: string, receiverId: string, message: string): void {
    this.socket?.emit("sendMessage", {
      courseId,
      receiverId,
      message,
      messageType: "text",
    });
  }

  markAsRead(chatId: string): void {
    this.socket?.emit("markAsRead", { chatId });
  }

  getConversation(
    courseId: string,
    otherUserId: string,
    page: number = 1,
    limit: number = 50,
  ): Observable<any> {
    return this.http.get(`/v1/chat/conversation/${courseId}/${otherUserId}`, {
      params: new HttpParams()
        .set("page", page.toString())
        .set("limit", limit.toString()),
    });
  }

  searchMessages(courseId: string, searchText: string): Observable<any> {
    return this.http.get(`/v1/chat/search/${courseId}`, {
      params: new HttpParams().set("q", searchText),
    });
  }

  disconnect(): void {
    this.socket?.disconnect();
  }
}
```

---

## ⚠️ Error Handling

### Các lỗi có thể xảy ra:

```typescript
// 1. Lỗi kết nối
socket.on("connect_error", (error) => {
  console.error("Connection error:", error);
  // Retry logic
});

// 2. Lỗi gửi tin nhắn
socket.on("messageError", (error) => {
  console.error("Message error:", error.error);
  // Hiển thị thông báo lỗi cho user
});

// 3. Lỗi validation
// Response từ REST API
if (response.status === 400) {
  // Bad Request - dữ liệu không hợp lệ
  console.error("Validation error:", response.data);
}

// 4. Lỗi authentication
if (response.status === 401) {
  // Unauthorized - token hết hạn
  // Redirect to login
}

// 5. Lỗi authorization
if (response.status === 403) {
  // Forbidden - không có quyền truy cập
  console.error("Access denied");
}

// 6. Lỗi server
if (response.status === 500) {
  // Server error
  console.error("Server error occurred");
}
```

---

## 📱 UI Components Layout

### Chat Screen Layout:

```
┌─────────────────────────────────┐
│  [Back] Course Name    [Info]   │  ← Header
├─────────────────────────────────┤
│                                 │
│  [Avatar] Sender Name   10:00   │
│  ┌─────────────────────────┐    │
│  │ Xin chào thầy/cô        │✓✓  │  ← Tin nhắn của user
│  └─────────────────────────┘    │
│                                 │
│                    10:01   [Avatar] │  ← Tin nhắn của người khác
│              ┌──────────────────┐   │
│              │ Xin chào em      │   │
│              └──────────────────┘   │
│                                 │
│  user@example.com đang gõ...   │  ← Typing indicator
├─────────────────────────────────┤
│  [📎] [😊] Text input... [➤]    │  ← Input area
└─────────────────────────────────┘
```

---

## 🔐 Security Notes

1. **JWT Token:**
   - Lưu token an toàn (localStorage / sessionStorage)
   - Refresh token khi hết hạn
   - Không share token

2. **Message Validation:**
   - Validate độ dài tin nhắn (max 5000 characters)
   - Sanitize HTML input để tránh XSS
   - Kiểm tra file type khi upload

3. **Access Control:**
   - Chỉ user trong course mới có thể chat
   - Chỉ người tương ứng mới có thể xem tin nhắn riêng
   - Backend phải verify quyền truy cập

4. **Rate Limiting:**
   - Giới hạn số tin nhắn gửi per second
   - Giới hạn số request API per minute

---

## 📊 Database Schema

```
Chat Collection:
{
  _id: ObjectId,
  courseId: ObjectId (ref: Course),
  senderId: ObjectId (ref: User),
  receiverId: ObjectId (ref: User),
  message: String,
  messageType: 'text' | 'image' | 'file',
  fileUrl: String (optional),
  fileName: String (optional),
  isRead: Boolean,
  readAt: Date (optional),
  createdBy: {
    _id: ObjectId,
    email: String,
    name: String
  },
  createdAt: Date,
  updatedAt: Date,

  // Indexes:
  // { courseId: 1, senderId: 1, receiverId: 1 }
  // { courseId: 1, createdAt: -1 }
  // { senderId: 1, receiverId: 1, createdAt: -1 }
}
```

---

## 🚀 Testing WebSocket

Sử dụng Postman hoặc WebSocket client tương tự:

```
Connection URL: ws://localhost:3000/chat
Headers:
  - Authorization: Bearer <JWT_TOKEN>

hoặc

URL with auth:
ws://localhost:3000/chat?token=<JWT_TOKEN>
```

---

## 📞 Support

Nếu có vấn đề, kiểm tra:

1. Backend logs
2. Network tab trong DevTools
3. Socket.io version compatibility
4. JWT token expiry
5. CORS configuration
