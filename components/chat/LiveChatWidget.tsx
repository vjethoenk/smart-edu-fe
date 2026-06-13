"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { useSelector } from "react-redux";
import {
  MessageCircle,
  X,
  Send,
  Loader2,
  Lock,
  CircleDot,
  User,
  Minus,
} from "lucide-react";
import { RootState } from "@/store/type";
import { useGetCourses } from "@/features/course/hook";
import { useGetConversation } from "@/features/chat/hook";
import { ChatMessage } from "@/features/chat/api";
import { userApi } from "@/features/user/api";
import { cn } from "@/lib/utils";
import Link from "next/link";

const CHAT_NAMESPACE = `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000"}/chat`;

function getUserId(value: unknown): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object" && value !== null && "_id" in value) {
    return String((value as any)._id);
  }
  return "";
}

export default function LiveChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageText, setMessageText] = useState("");
  const [status, setStatus] = useState("disconnected");
  const [socket, setSocket] = useState<Socket | null>(null);
  const [typingIndicator, setTypingIndicator] = useState<string | null>(null);
  const [adminUser, setAdminUser] = useState<{ _id: string; name: string } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentUserId = useSelector((state: RootState) => state.auth.user?._id);
  const isLoggedIn = !!currentUserId;

  // 1. Tải danh sách khóa học để làm ngữ cảnh courseId
  const { data: coursesResponse } = useGetCourses();
  const courses = useMemo(() => coursesResponse ?? [], [coursesResponse]);

  const courseId = useMemo(() => {
    if (courses.length > 0) return courses[0]._id;
    return "";
  }, [courses]);

  // 2. Tìm tài khoản Admin hệ thống để làm receiverId
  useEffect(() => {
    if (!isLoggedIn) return;

    const fetchAdmin = async () => {
      try {
        // Thử tìm người tạo của khóa học đầu tiên (thường là Admin hoặc Instructor)
        if (courses.length > 0 && courses[0].createBy) {
          setAdminUser({
            _id: courses[0].createBy._id,
            name: courses[0].createBy.name || "Admin Hỗ trợ",
          });
          return;
        }

        // Fallback: Lấy danh sách user và tìm user có email/tên chứa chữ admin
        const response = await userApi.getAll(0, 50);
        const users = response?.data || [];
        if (Array.isArray(users)) {
          const foundAdmin = users.find(
            (u: any) =>
              u.email?.toLowerCase().includes("admin") ||
              u.name?.toLowerCase().includes("admin")
          );

          if (foundAdmin) {
            setAdminUser({
              _id: foundAdmin._id,
              name: foundAdmin.name || "Admin Hỗ trợ",
            });
          } else if (users.length > 0) {
            setAdminUser({
              _id: users[0]._id,
              name: users[0].name || "Hỗ trợ viên",
            });
          }
        }
      } catch (error) {
        console.error("Lỗi khi tìm tài khoản Admin hỗ trợ:", error);
      }
    };

    fetchAdmin();
  }, [isLoggedIn, courses]);

  const receiverId = adminUser?._id || "";

  // 3. Tải tin nhắn lịch sử giữa Học viên và Admin
  const { data: conversationResponse, isFetching: isConversationLoading } =
    useGetConversation(
      courseId || undefined,
      receiverId,
      1,
      50,
      isOpen && isLoggedIn && !!courseId && !!receiverId
    );

  // Cập nhật tin nhắn lịch sử
  useEffect(() => {
    if (conversationResponse?.data?.data) {
      setMessages(conversationResponse.data.data);
    }
  }, [conversationResponse]);

  // Tự động cuộn xuống tin nhắn mới nhất
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, typingIndicator]);

  // 4. Kết nối Socket IO
  useEffect(() => {
    if (!isOpen || !isLoggedIn || !receiverId) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setStatus("disconnected");
      }
      return;
    }

    const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
    const socketClient = io(CHAT_NAMESPACE, {
      auth: { token },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      transports: ["websocket"],
    });

    setSocket(socketClient);

    socketClient.on("connect", () => {
      setStatus("connected");
      if (courseId) {
        socketClient.emit("joinCourse", { courseId });
      }
    });

    socketClient.on("disconnect", () => {
      setStatus("disconnected");
    });

    socketClient.on("connect_error", () => {
      setStatus("error");
    });

    socketClient.on("connection_success", () => {
      setStatus("connected");
      if (courseId) {
        socketClient.emit("joinCourse", { courseId });
      }
    });

    socketClient.on("newMessage", (message: ChatMessage) => {
      const senderId = getUserId(message.senderId);
      const msgReceiverId = getUserId(message.receiverId);

      if (senderId === receiverId || msgReceiverId === receiverId) {
        setMessages((prev) => [...prev, message]);
      }
    });

    socketClient.on("messageSent", (message: ChatMessage) => {
      const senderId = getUserId(message.senderId);
      const msgReceiverId = getUserId(message.receiverId);

      if (senderId === receiverId || msgReceiverId === receiverId) {
        setMessages((prev) => [...prev, message]);
      }
    });

    socketClient.on("userTyping", (data: { userId?: string }) => {
      if (data.userId === receiverId) {
        setTypingIndicator("Admin đang gõ tin nhắn...");
      }
    });

    socketClient.on("userStopTyping", (data: { userId?: string }) => {
      if (data.userId === receiverId) {
        setTypingIndicator(null);
      }
    });

    return () => {
      socketClient.disconnect();
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [isOpen, isLoggedIn, receiverId, courseId]);

  // Gửi sự kiện typing
  const emitTyping = () => {
    if (!socket || !courseId || !receiverId) return;
    socket.emit("typing", { courseId, receiverId });
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping", { courseId, receiverId });
    }, 1200);
  };

  // Gửi tin nhắn
  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!socket || !courseId || !receiverId || !messageText.trim()) return;

    socket.emit("sendMessage", {
      courseId,
      receiverId,
      message: messageText.trim(),
      messageType: "text",
    });

    setMessageText("");
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      socket.emit("stopTyping", { courseId, receiverId });
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Cửa sổ Chat Box */}
      <div
        className={cn(
          "w-[360px] sm:w-[380px] h-[500px] bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden transition-all duration-300 transform origin-bottom-right mb-4",
          isOpen
            ? "scale-100 opacity-100 pointer-events-auto"
            : "scale-90 opacity-0 pointer-events-none absolute bottom-0 right-0 h-0 w-0"
        )}
      >
        {/* Header Chat Box */}
        <div className="p-4 bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 text-white flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm border border-white/20">
                <User className="w-5 h-5" />
              </div>
              {status === "connected" && (
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-indigo-700 flex items-center justify-center">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                </div>
              )}
            </div>
            <div>
              <h4 className="font-bold text-sm">Hỗ trợ SmartEdu</h4>
              <p className="text-[10px] text-white/70 flex items-center gap-1 mt-0.5">
                <CircleDot className={cn("w-2 h-2", status === "connected" ? "text-emerald-400" : "text-slate-400")} />
                {status === "connected" ? "Trực tuyến" : "Ngoại tuyến"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full hover:bg-white/10 transition-colors text-white/80 hover:text-white"
            >
              <Minus className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full hover:bg-white/10 transition-colors text-white/80 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Nội dung Chat Box */}
        <div className="flex-1 overflow-y-auto bg-slate-50/50 p-4 space-y-3.5 custom-scrollbar">
          {!isLoggedIn ? (
            <div className="h-full flex flex-col items-center justify-center p-6 text-center space-y-4">
              <div className="p-4 bg-indigo-50 text-indigo-600 rounded-full border border-indigo-100">
                <Lock className="w-8 h-8" />
              </div>
              <h5 className="font-bold text-slate-800">Yêu cầu đăng nhập</h5>
              <p className="text-xs text-slate-500 max-w-[240px]">
                Vui lòng đăng nhập tài khoản học viên để bắt đầu trò chuyện trực tuyến với đội ngũ hỗ trợ.
              </p>
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-md transition-all hover:scale-105"
              >
                Đăng nhập ngay
              </Link>
            </div>
          ) : isConversationLoading && messages.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
            </div>
          ) : messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-2">
              <MessageCircle className="w-10 h-10 text-slate-300" />
              <p className="text-xs font-medium">Chưa có tin nhắn nào</p>
              <p className="text-[10px] max-w-[200px]">
                Hãy gửi tin nhắn đầu tiên để kết nối với ban quản trị hỗ trợ.
              </p>
            </div>
          ) : (
            messages.map((message) => {
              const isMine = getUserId(message.senderId) === currentUserId;
              return (
                <div
                  key={message._id}
                  className={cn(
                    "flex flex-col max-w-[80%] rounded-2xl px-3.5 py-2 shadow-sm text-xs leading-5",
                    isMine
                      ? "ml-auto bg-indigo-600 text-white rounded-br-none"
                      : "mr-auto bg-white text-slate-800 border border-slate-200/60 rounded-bl-none"
                  )}
                >
                  <p className="whitespace-pre-wrap break-words">{message.message}</p>
                  <span
                    className={cn(
                      "text-[9px] text-right mt-1 font-medium",
                      isMine ? "text-white/60" : "text-slate-400"
                    )}
                  >
                    {new Date(message.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              );
            })
          )}
          {typingIndicator && (
            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium mr-auto bg-white border border-slate-100 rounded-full px-3 py-1.5 shadow-sm animate-pulse">
              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" />
              <span>{typingIndicator}</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Footer Chat Box */}
        {isLoggedIn && (
          <form
            onSubmit={handleSendMessage}
            className="p-3 bg-white border-t border-slate-100 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Nhập tin nhắn..."
              value={messageText}
              onChange={(e) => {
                setMessageText(e.target.value);
                emitTyping();
              }}
              disabled={status !== "connected"}
              className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder-slate-400"
            />
            <button
              type="submit"
              disabled={!messageText.trim() || status !== "connected"}
              className="p-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition shadow hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        )}
      </div>

      {/* Nút bấm nổi Live Chat (FAB) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 relative"
      >
        <div className="absolute inset-0 bg-indigo-600 rounded-full blur opacity-40 animate-ping -z-10" />
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6 animate-pulse" />}
      </button>
    </div>
  );
}
