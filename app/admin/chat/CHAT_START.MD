# ⚡ QUICK START - CHAT SYSTEM

## Backend Setup (2 phút)

### 1. Cài đặt

```bash
npm install
```

### 2. Start Server

```bash
npm run dev
```

Server chạy tại: `http://localhost:3000`

---

## Frontend Setup (5 phút)

### 1. Cài đặt Socket.io Client

```bash
npm install socket.io-client
```

### 2. Tạo Chat Hook

```typescript
// hooks/useChat.ts
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export function useChat(courseId: string) {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const newSocket = io("http://localhost:3000/chat", {
      auth: { token },
    });

    newSocket.on("connection_success", () => {
      newSocket.emit("joinCourse", { courseId });
    });

    newSocket.on("newMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    setSocket(newSocket);

    return () => newSocket.disconnect();
  }, [courseId]);

  return {
    socket,
    messages,
    sendMessage: (receiverId, text) => {
      socket?.emit("sendMessage", {
        courseId,
        receiverId,
        message: text,
        messageType: "text",
      });
    },
  };
}
```

### 3. Sử dụng trong Component

```typescript
export function ChatWindow() {
  const { socket, messages, sendMessage } = useChat(courseId);

  return (
    <div>
      {messages.map((msg) => (
        <div key={msg._id}>{msg.message}</div>
      ))}
      <input
        onSend={(text) => sendMessage(receiverId, text)}
      />
    </div>
  );
}
```

---

## API Endpoints

| Method | Endpoint                                       | Purpose                  |
| ------ | ---------------------------------------------- | ------------------------ |
| POST   | `/v1/chat/message`                             | Tạo tin nhắn             |
| GET    | `/v1/chat/messages/:courseId`                  | Lấy tin nhắn             |
| GET    | `/v1/chat/conversations/:courseId`             | Lấy danh sách trò chuyện |
| GET    | `/v1/chat/conversation/:courseId/:otherUserId` | Lấy cuộc trò chuyện      |
| POST   | `/v1/chat/message/:chatId/read`                | Đánh dấu đã đọc          |
| DELETE | `/v1/chat/message/:chatId`                     | Xóa tin nhắn             |
| GET    | `/v1/chat/search/:courseId`                    | Tìm kiếm                 |

---

## WebSocket Events

| Event         | Direction       | Purpose         |
| ------------- | --------------- | --------------- |
| `joinCourse`  | Client → Server | Vào khóa học    |
| `sendMessage` | Client → Server | Gửi tin nhắn    |
| `markAsRead`  | Client → Server | Đánh dấu đã đọc |
| `typing`      | Client → Server | Đang gõ         |
| `newMessage`  | Server → Client | Tin nhắn mới    |
| `messageRead` | Server → Client | Tin nhắn đã đọc |
| `userTyping`  | Server → Client | User đang gõ    |

---

## Test WebSocket

```bash
# Với Postman
1. New → WebSocket
2. URL: ws://localhost:3000/chat
3. Headers: { "Authorization": "Bearer <JWT_TOKEN>" }
4. Send: { "event": "joinCourse", "data": {"courseId": "xxx"} }
```

---

## Common Issues

| Issue                  | Solution                               |
| ---------------------- | -------------------------------------- |
| Connection refused     | Check server running, verify JWT token |
| Messages not appearing | Check room name, verify receiver ID    |
| High latency           | Use pagination, add DB indexes         |
| Socket disconnect      | Enable auto-reconnect, check logs      |

---

## Files Created

```
src/chat/
├── schemas/chat.schema.ts
├── dto/
│   ├── create-chat.dto.ts
│   └── socket-message.dto.ts
├── chat.gateway.ts
├── chat.service.ts
├── chat.controller.ts
└── chat.module.ts

Documentation:
├── CHAT_API_DOCUMENTATION.md      (Chi tiết)
├── CHAT_IMPLEMENTATION_GUIDE.md   (Hướng dẫn)
├── CHAT_REACT_EXAMPLE.tsx         (Component)
└── CHAT_REACT_EXAMPLE.css         (Styling)
```

---

## Next Steps

1. ✅ Backend setup hoàn tất
2. ⏳ Integrate frontend (sử dụng `CHAT_REACT_EXAMPLE.tsx`)
3. ⏳ Add file upload support (S3)
4. ⏳ Add message encryption
5. ⏳ Add audio/video messages

---

## Documentation Links

- 📖 **Full API Docs:** `CHAT_API_DOCUMENTATION.md`
- 🛠️ **Implementation Guide:** `CHAT_IMPLEMENTATION_GUIDE.md`
- ⚛️ **React Example:** `CHAT_REACT_EXAMPLE.tsx`
- 🎨 **CSS Styling:** `CHAT_REACT_EXAMPLE.css`

---

**Ready to go! 🚀**
