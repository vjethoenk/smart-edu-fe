"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import {
  Bell,
  CircleDot,
  Send,
  Wifi,
  WifiOff,
  MessageSquare,
  Loader2,
  User,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  useGetChatConversations,
  useGetConversation,
} from "@/features/chat/hook";
import { ChatConversationSummary, ChatMessage } from "@/features/chat/api";
import { cn } from "@/lib/utils";

const CHAT_NAMESPACE = `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000"}/chat`;

function formatDate(timestamp?: string) {
  if (!timestamp) return "";
  return new Date(timestamp).toLocaleString([], {
    hour: "2-digit",
    minute: "2-digit",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

function getUserId(value: unknown): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object" && value !== null && "_id" in value) {
    return String((value as any)._id);
  }
  return "";
}

function getConversationCourseId(
  conversation: ChatConversationSummary | null,
): string {
  if (!conversation) return "";
  const id = conversation._id;
  if (typeof id === "object" && id !== null && "courseId" in id) {
    return String((id as any).courseId);
  }
  return "";
}

export default function AdminChatPage() {
  const [courseId, setCourseId] = useState<string>("");
  const [receiverId, setReceiverId] = useState<string>("");
  const [messageText, setMessageText] = useState<string>("");
  const [selectedConversation, setSelectedConversation] =
    useState<ChatConversationSummary | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState<string>("disconnected");
  const [typingIndicator, setTypingIndicator] = useState<string | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
    data: conversationsResponse,
    isFetching: conversationsLoading,
    refetch: refetchConversations,
  } = useGetChatConversations(undefined, true);

  // Tải lịch sử tin nhắn của cuộc trò chuyện được chọn
  const {
    data: conversationResponse,
    isFetching: conversationLoading,
    refetch: refetchConversation,
  } = useGetConversation(
    courseId || undefined,
    selectedConversation?.otherUser._id ?? receiverId,
    1,
    50,
    !!(selectedConversation?.otherUser._id ?? receiverId) && !!courseId,
  );

  const conversations = useMemo(
    () => conversationsResponse?.data ?? [],
    [conversationsResponse],
  );

  // Lọc cuộc trò chuyện theo thanh tìm kiếm học viên
  const filteredConversations = useMemo(() => {
    return conversations.filter(
      (c) =>
        c.otherUser.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.otherUser.email.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [conversations, searchQuery]);

  // Thiết lập socket connection
  useEffect(() => {
    if (!receiverId) return;

    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("access_token")
        : null;
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
      const targetId = selectedConversation?.otherUser._id ?? receiverId;
      const senderId = getUserId(message.senderId);
      const receiver = getUserId(message.receiverId);

      if (targetId && (senderId === targetId || receiver === targetId)) {
        setMessages((prev) => [...prev, message]);
      }
      refetchConversations();
    });

    socketClient.on("messageSent", (message: ChatMessage) => {
      const targetId = selectedConversation?.otherUser._id ?? receiverId;
      const senderId = getUserId(message.senderId);
      const receiver = getUserId(message.receiverId);

      if (targetId && (senderId === targetId || receiver === targetId)) {
        setMessages((prev) => [...prev, message]);
      }
      refetchConversations();
    });

    socketClient.on("messageRead", () => {
      refetchConversations();
    });

    socketClient.on(
      "userTyping",
      (data: { email?: string; userId?: string }) => {
        if (data.userId === receiverId) {
          setTypingIndicator(
            data?.email ? `${data.email} đang soạn tin...` : "Đang soạn tin...",
          );
        }
      },
    );

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
  }, [receiverId, courseId, selectedConversation, refetchConversations]);

  useEffect(() => {
    if (!conversationResponse?.data) return;
    setMessages(conversationResponse.data.data);
  }, [conversationResponse]);

  // Tự động join khi courseId thay đổi
  useEffect(() => {
    if (!socket || !courseId) return;
    socket.emit("joinCourse", { courseId });
  }, [socket, courseId]);

  // Cuộn xuống tin nhắn mới nhất
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingIndicator]);

  const handleSelectConversation = (conversation: ChatConversationSummary) => {
    setSelectedConversation(conversation);
    setReceiverId(conversation.otherUser._id);

    // Tự động trích xuất courseId từ conversation
    const cId = getConversationCourseId(conversation);
    setCourseId(cId);
  };

  const emitTyping = () => {
    if (!socket || !courseId || !receiverId) return;
    socket.emit("typing", { courseId, receiverId });
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping", { courseId, receiverId });
    }, 1000);
  };

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
    <div className="p-6 max-w-8xl mx-auto space-y-6 h-[calc(100vh-100px)] flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-2">
            <MessageSquare className="w-8 h-8 text-indigo-600" />
            Hỗ trợ Học viên
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Hộp thư hỗ trợ trực tuyến kết nối thời gian thực giữa Admin và Học
            viên.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {selectedConversation && (
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1 text-xs font-semibold shadow-sm",
                status === "connected"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : status === "error"
                    ? "border-rose-200 bg-rose-50 text-rose-700"
                    : "border-slate-200 bg-slate-50 text-slate-600",
              )}
            >
              <CircleDot
                className={cn(
                  "w-2 h-2",
                  status === "connected"
                    ? "bg-emerald-500 animate-pulse rounded-full"
                    : "bg-slate-400 rounded-full",
                )}
              />
              {status === "connected"
                ? "Đã kết nối Socket"
                : status === "error"
                  ? "Lỗi kết nối Socket"
                  : "Chưa kết nối"}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1 text-xs font-semibold text-slate-600 shadow-sm">
            <Bell className="h-3.5 w-3.5 text-indigo-500" />
            {conversations.length} cuộc hội thoại
          </span>
        </div>
      </div>

      {/* Main Chat Container */}
      <div className="flex-1 min-h-0 bg-white rounded-3xl border border-slate-100 shadow-lg flex overflow-hidden">
        {/* Cột trái: Danh sách cuộc trò chuyện */}
        <div className="w-full lg:w-[360px] border-r border-slate-100 flex flex-col shrink-0">
          {/* Search bar */}
          <div className="p-4 border-b border-slate-50 relative shrink-0">
            <Search className="absolute left-7 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm học viên..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder-slate-400"
            />
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-1.5 custom-scrollbar">
            {conversationsLoading ? (
              <div className="flex flex-col items-center justify-center py-12 gap-2 text-slate-400">
                <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
                <span className="text-xs">Đang tải danh sách...</span>
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs font-medium">
                {searchQuery
                  ? "Không tìm thấy học viên nào"
                  : "Chưa có cuộc trò chuyện hỗ trợ nào"}
              </div>
            ) : (
              filteredConversations.map((conversation) => {
                const isActive =
                  selectedConversation?.otherUser._id ===
                  conversation.otherUser._id;
                return (
                  <button
                    key={conversation.otherUser._id}
                    type="button"
                    onClick={() => handleSelectConversation(conversation)}
                    className={cn(
                      "w-full rounded-2xl p-3.5 text-left transition-all duration-200 border flex items-center gap-3",
                      isActive
                        ? "border-indigo-500 bg-indigo-50/70 shadow-sm"
                        : "border-transparent bg-white hover:bg-slate-50",
                    )}
                  >
                    <div className="relative shrink-0">
                      <div
                        className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs uppercase shadow-sm",
                          isActive
                            ? "bg-indigo-600 text-white"
                            : "bg-slate-100 text-slate-600",
                        )}
                      >
                        {conversation.otherUser.name ? (
                          conversation.otherUser.name.charAt(0)
                        ) : (
                          <User className="w-4 h-4" />
                        )}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline gap-2">
                        <p className="font-semibold text-xs text-slate-800 truncate">
                          {conversation.otherUser.name}
                        </p>
                        <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">
                          {
                            formatDate(conversation.lastMessageTime).split(
                              " ",
                            )[0]
                          }
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {conversation.lastMessage}
                      </p>
                    </div>
                    {conversation.unreadCount > 0 && (
                      <span className="shrink-0 w-5 h-5 rounded-full bg-rose-500 text-white font-bold text-[10px] flex items-center justify-center animate-pulse">
                        {conversation.unreadCount}
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Cột phải: Vùng Trò chuyện */}
        <div className="flex-1 flex flex-col min-w-0 bg-slate-50/30">
          {selectedConversation ? (
            <>
              {/* Header Khung Chat */}
              <div className="px-6 py-4 bg-white border-b border-slate-100 flex items-center justify-between shrink-0 shadow-sm z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm shadow-sm border border-indigo-100">
                    {selectedConversation.otherUser.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-800">
                      {selectedConversation.otherUser.name}
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-0.5 font-medium">
                      Email: {selectedConversation.otherUser.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Danh sách tin nhắn */}
              <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 custom-scrollbar">
                {conversationLoading && messages.length === 0 ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
                  </div>
                ) : (
                  messages.map((message) => {
                    const isMine =
                      getUserId(message.senderId) !==
                      selectedConversation.otherUser._id;
                    return (
                      <div
                        key={message._id}
                        className={cn(
                          "flex flex-col max-w-[75%] rounded-2xl px-4 py-2.5 shadow-sm text-xs leading-5 transition-all",
                          isMine
                            ? "ml-auto bg-indigo-600 text-white rounded-br-none"
                            : "mr-auto bg-white text-slate-800 border border-slate-200/50 rounded-bl-none",
                        )}
                      >
                        <p className="whitespace-pre-wrap break-words">
                          {message.message}
                        </p>
                        <span
                          className={cn(
                            "text-[9px] text-right mt-1.5 font-medium",
                            isMine ? "text-white/60" : "text-slate-400",
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
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-semibold mr-auto bg-white border border-slate-100 rounded-full px-4.5 py-2 shadow-sm animate-pulse">
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" />
                    <span>{typingIndicator}</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Ô soạn thảo và gửi */}
              <form
                onSubmit={handleSendMessage}
                className="p-4 bg-white border-t border-slate-100 flex items-end gap-3 shrink-0"
              >
                <div className="flex-1">
                  <Textarea
                    value={messageText}
                    onChange={(event) => {
                      setMessageText(event.target.value);
                      emitTyping();
                    }}
                    placeholder="Gõ tin nhắn hỗ trợ học viên..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none min-h-[44px] max-h-[120px] placeholder-slate-400 custom-scrollbar"
                    rows={1}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={!messageText.trim() || status !== "connected"}
                  className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition font-semibold text-xs flex items-center gap-1.5 shadow disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Gửi</span>
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-3">
              <div className="p-4 bg-white rounded-full border border-slate-100 shadow-md">
                <MessageSquare className="w-8 h-8 text-indigo-500" />
              </div>
              <h4 className="font-bold text-slate-700">
                Hộp thư hỗ trợ SmartEdu
              </h4>
              <p className="text-xs text-slate-400 max-w-[280px]">
                Chọn một cuộc trò chuyện từ danh sách học viên bên trái để tải
                lịch sử và bắt đầu hỗ trợ trực tuyến.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
