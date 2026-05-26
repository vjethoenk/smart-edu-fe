# 🔄 CHAT FLOW DIAGRAM

## Flow 1: Kết Nối & Vào Khóa Học

```
Frontend                          Backend                        Database
   │                               │                               │
   ├─ Lấy JWT Token ────────────────────────────────────────────────┤
   │  từ localStorage              │                               │
   │                               │                               │
   ├─ io.connect(url,             │                               │
   │    { auth: token })          │                               │
   │                               │                               │
   │─── WebSocket Connect ───────> │                               │
   │  (auth: { token })            ├─ Verify JWT                  │
   │                               │  ├─ Valid ✓                 │
   │                               │  ├─ Store user ID             │
   │                               │  └─ Add to userSockets Map    │
   │                               │                               │
   │ <─── connection_success ──────┤                               │
   │  { message, userId }          │                               │
   │                               │                               │
   ├─ emit('joinCourse',          │                               │
   │    { courseId })             │                               │
   │                               │                               │
   │─── joinCourse ───────────────> │                               │
   │                               ├─ room.join(course_xxx)       │
   │                               │  store courseId in socket    │
   │                               │                               │
   │ <─── joinCourse response ─────┤                               │
   │  { success: true }            │                               │
   │                               │                               │
   └─ Ready to send messages       └─ Waiting for events          └─ Ready

     ============ User A Connected in Course 1 ============
```

---

## Flow 2: Gửi & Nhận Tin Nhắn

```
Sender (User A)         WebSocket Server           Receiver (User B)    Database
       │                      │                          │                │
       │ emit('sendMessage')  │                          │                │
       ├─ courseId: "1"       │                          │                │
       ├─ receiverId: "B"     │                          │                │
       ├─ message: "Hello"    │                          │                │
       │                      │                          │                │
       ├─────────────────────>│                          │                │
       │                      │ Validate                 │                │
       │                      ├─ Auth                    │                │
       │                      ├─ Permissions             │                │
       │                      └─ Message length          │                │
       │                      │                          │                │
       │                      ├─ Save to DB ─────────────────────────────>│
       │                      │  Chat Document:         │                 │
       │                      │  - senderId: A          │                 │
       │                      │  - receiverId: B        │                 │
       │                      │  - message: "Hello"     │                 │
       │                      │  - isRead: false        │                 │
       │                      │                          │                 │
       │<─── messageSent ─────┤                          │                │
       │  { _id, status }     │                          │                │
       │  (Lưu thành công)    │                          │                │
       │                      │                          │                │
       │                      ├─ Check if receiver      │                │
       │                      │  online (userSockets)    │                │
       │                      │                          │                │
       │                      │ YES ✓                    │                │
       │                      │                          │                │
       │                      ├─ emit('newMessage') ──>│                │
       │                      │  { _id, message, ... }  │                │
       │                      │                          │                │
       │                      │                          ├─ updateUI()   │
       │                      │                          │  hiển thị msg  │
       │                      │                          │                │
       │                      │                          ├─ Auto mark as │
       │                      │                          │  read if type │
       │                      │                          │                │
       │                      │ <─── markAsRead ────────│                │
       │                      │  { chatId }             │                │
       │                      │                          │                │
       │                      ├─ Update DB: ────────────────────────────>│
       │                      │  isRead: true           │                │
       │                      │  readAt: timestamp      │                │
       │                      │                         │                │
       │ <─── messageRead ────┤                         │                │
       │  { chatId, readAt }  │                         │                │
       │  (Hiển thị ✓✓)       │                         │                │
       │                      │                         │                │

     ============ Message Delivered & Read ============
```

---

## Flow 3: Typing Indicator

```
User A (Typing)      Server                  User B (Receiving)
       │               │                            │
       ├─ typing ─────>│                            │
       │ { receiverId } │                            │
       │               │ ─ emit('userTyping') ──> │
       │               │   { userId, email }     │
       │               │                            ├─ Show "User A đang gõ..."
       │               │                            │
    (2 seconds)       │                            │
       │               │                            │
       ├─ stopTyping ─>│                            │
       │               │ ─ emit('userStopTyping')-> │
       │               │   { userId }              │
       │               │                            ├─ Hide typing status
       │               │                            │

     ============ Typing State Synchronized ============
```

---

## Flow 4: Load Lịch Sử Chat (Pagination)

```
Frontend                     REST API             Database
   │                            │                    │
   ├─ GET /v1/chat/           │                    │
   │  conversation/course1     │                    │
   │  /userB?page=1&limit=50   │                    │
   │                            │                    │
   ├───────────────────────────>│                    │
   │  (with Authorization)     │                    │
   │                            │                    │
   │                            ├─ Query ──────────>│
   │                            │ find({            │
   │                            │  courseId: 1,     │
   │                            │  $or: [...]       │
   │                            │ }).skip(0)        │
   │                            │  .limit(50)       │
   │                            │  .sort({createdAt}│
   │                            │                    │
   │                            │<── 50 messages ──┤
   │                            │                    │
   │<─ 200 OK ─────────────────┤                    │
   │ {                         │                    │
   │   data: [msgs],           │                    │
   │   pagination: {           │                    │
   │     page: 1,              │                    │
   │     total: 240,           │                    │
   │     pages: 5              │                    │
   │   }                        │                    │
   │ }                         │                    │
   │                            │                    │
   ├─ Display messages         │                    │
   │ & load more button        │                    │
   │                            │                    │
   ├─ Scroll to top            │                    │
   ├─ Click load more (page 2) │                    │
   │                            │                    │
   ├─ GET /v1/chat/           │                    │
   │  conversation/...         │                    │
   │  ?page=2&limit=50         │                    │
   │                            │                    │
   │──────────────────────────>│                    │
   │                            ├─ Skip(50)         │
   │                            ├─ Limit(50)        │
   │                            ├─ Return 50 more  >|
   │                            │                    │
   │<─ 200 OK ─────────────────┤                    │
   │ { data: [50 msgs], ... }  │                    │
   │                            │                    │
   └─ Prepend messages         │                    │

     ============ Pagination Complete ============
```

---

## Flow 5: Unread Messages Count

```
Frontend (App Load)    REST API          Database
       │                  │                 │
       ├─ GET /v1/chat/  │                 │
       │  unread-count   │                 │
       │  ?courseId=1    │                 │
       │                  │                 │
       ├────────────────>│                 │
       │                  │                 │
       │                  ├─ countDocuments({│
       │                  │  receiverId: me, │
       │                  │  isRead: false   │
       │                  │ })              │
       │                  │                 │
       │                  │<── count: 5 ──┤
       │                  │                 │
       │<─ 200 OK ────────┤                 │
       │ { count: 5 }     │                 │
       │                  │                 │
       ├─ Show badge "5"  │                 │
       │ on chat icon     │                 │
       │                  │                 │

     ============ Unread Count Displayed ============
```

---

## Flow 6: Search Messages

```
Frontend              REST API             Database
   │                    │                     │
   ├─ Input: "hello"    │                     │
   │ (Debounce 300ms)   │                     │
   │                    │                     │
   ├─ GET /v1/chat/    │                     │
   │  search/course1    │                     │
   │  ?q=hello          │                     │
   │                    │                     │
   ├──────────────────>│                     │
   │                    │                     │
   │                    ├─ find({            │
   │                    │  courseId: 1,      │
   │                    │  message: /hello/  │
   │                    │ })                 │
   │                    │                     │
   │                    │<── [msgs] ────────┤
   │                    │                     │
   │<─ 200 OK ──────────┤                     │
   │ [15 results]       │                     │
   │                    │                     │
   └─ Display results   │                     │

     ============ Search Complete ============
```

---

## Architecture Diagram

```
                        ┌─────────────────────────┐
                        │    Frontend (React)     │
                        │  ┌─────────────────┐   │
                        │  │  ChatWindow     │   │
                        │  │  - Messages     │   │
                        │  │  - Input        │   │
                        │  │  - Typing       │   │
                        │  └─────────────────┘   │
                        └────────┬────────────────┘
                                 │
                    ┌────────────┼────────────┐
                    │            │            │
              WebSocket       REST API      Polling
                    │            │            │
         ┌──────────▼──────────────▼──────────▼──────────┐
         │         Backend (NestJS + Socket.io)        │
         │ ┌──────────────────────────────────────────┐│
         │ │ Chat Gateway (WebSocket Handler)        ││
         │ │  - handleConnection                    ││
         │ │  - handleSendMessage                   ││
         │ │  - handleMarkAsRead                    ││
         │ │  - handleTyping                        ││
         │ │  - handleJoinCourse                    ││
         │ └──────────────────────────────────────────┘│
         │ ┌──────────────────────────────────────────┐│
         │ │ Chat Controller (REST API)              ││
         │ │  - POST /message                       ││
         │ │  - GET /messages                       ││
         │ │  - GET /conversations                  ││
         │ │  - GET /search                         ││
         │ │  - DELETE /message                     ││
         │ └──────────────────────────────────────────┘│
         │ ┌──────────────────────────────────────────┐│
         │ │ Chat Service                           ││
         │ │  - createMessage()                     ││
         │ │  - getMessages()                       ││
         │ │  - markAsRead()                        ││
         │ │  - searchMessages()                    ││
         │ └──────────────────────────────────────────┘│
         └──────────────┬──────────────────────────────┘
                        │
                        │
         ┌──────────────▼──────────────┐
         │   MongoDB Database          │
         │ ┌────────────────────────┐ │
         │ │ Chat Collection        │ │
         │ │ - _id                  │ │
         │ │ - courseId             │ │
         │ │ - senderId             │ │
         │ │ - receiverId           │ │
         │ │ - message              │ │
         │ │ - isRead               │ │
         │ │ - createdAt            │ │
         │ │ - updatedAt            │ │
         │ │                        │ │
         │ │ Indexes:               │ │
         │ │ - courseId             │ │
         │ │ - sender/receiver      │ │
         │ │ - createdAt            │ │
         │ └────────────────────────┘ │
         └─────────────────────────────┘
```

---

## Real-time Data Sync

```
Client 1                          Server                        Client 2
(User A)                         (Hub)                        (User B)
  │                               │                             │
  ├─ emit event ────────────────>│                             │
  │                               │ Validate & Process          │
  │                               ├─ Save to DB                │
  │                               │                             │
  │                               ├─ Broadcast to room ──────>│
  │                               │                             ├─ Update UI
  │                               │<─ emit ack ────────────────┤
  │<─ Response ──────────────────┤                             │
  │                               │                             │
  │                               │ (All changes synced         │
  │                               │  within milliseconds)       │
  │                               │                             │
  └─────────────────────────────────────────────────────────────┘

        Latency: ~50-200ms (depending on network)
```

---

## State Management

```
┌─────────────────────────────────────────────────┐
│           Frontend State (React)                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  useChat Hook:                                  │
│  ├─ socket: Socket instance                     │
│  ├─ messages: Message[]                         │
│  ├─ isConnected: boolean                        │
│  ├─ typing: string | null                       │
│  ├─ currentUser: User                           │
│  └─ receiver: User                              │
│                                                 │
│  Component State:                               │
│  ├─ inputMessage: string                        │
│  ├─ loading: boolean                            │
│  ├─ error: string | null                        │
│  └─ pagination: { page, limit, total }          │
│                                                 │
└─────────────────────────────────────────────────┘
              │
              │ Sync with
              │
┌─────────────▼─────────────────────────────────┐
│       Backend (NestJS)                         │
├───────────────────────────────────────────────┤
│                                                 │
│  Socket Data:                                   │
│  ├─ userSockets: Map<userId, Set<socketId>>   │
│  ├─ rooms: course_<id>, private_<id>          │
│  │                                             │
│  Database (MongoDB):                            │
│  ├─ Chat Documents                             │
│  ├─ User References                            │
│  └─ Message Metadata (isRead, readAt)          │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## Error Handling Flow

```
Action                     Error Check                 Response
  │                            │                          │
  ├─ Send Message ────────> Invalid User? ──────────────>│
  │                         Invalid Course?               │
  │                         Message too long?             │
  │                         User not authenticated?       │
  │                         Access denied?                │
  │                                                       │
  │                       ✓ All checks pass              │
  │                                                       │
  │                       Save to DB ─────────────────>│
  │                                                       │
  │                       DB Error? ──────────────────>│
  │                       Validation Error?             │
  │                                                       │
  │                       ✓ Success                      │
  │                                                       │
  │<───────────────────── Return Response ──────────────│
  │
  ├─ Success:
  │  { _id, message, createdAt, status: 'sent' }
  │
  └─ Error:
     { error: 'Error message', code: 400/401/403/500 }
```

---

**Tất cả flows đã được thiết kế để đảm bảo:**

- ✅ Real-time synchronization
- ✅ Error handling & validation
- ✅ Scalability
- ✅ Security
- ✅ User experience
