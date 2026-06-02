"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { CircleDot, Send, Wifi, WifiOff } from "lucide-react";
import { useSelector } from "react-redux";
import { useGetCourses } from "@/features/course/hook";
import {
  useGetChatConversations,
  useGetConversation,
} from "@/features/chat/hook";
import { ChatConversationSummary, ChatMessage } from "@/features/chat/api";
import { RootState } from "@/store/type";
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

interface ChatPanelProps {
  title: string;
  subtitle: string;
  defaultCourseId?: string;
  defaultReceiverId?: string;
  showCourseFilter?: boolean;
}

export function ChatPanel({
  title,
  subtitle,
  defaultCourseId,
  defaultReceiverId,
  showCourseFilter = false,
}: ChatPanelProps) {
  const [courseId, setCourseId] = useState<string>(defaultCourseId ?? "");
  const [receiverId, setReceiverId] = useState<string>(defaultReceiverId ?? "");
  const [messageText, setMessageText] = useState<string>("");
  const [selectedConversation, setSelectedConversation] =
    useState<ChatConversationSummary | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState<string>("disconnected");
  const [typingIndicator, setTypingIndicator] = useState<string | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const currentUserId = useSelector((state: RootState) => state.auth.user?._id);
  const currentUserName = useSelector(
    (state: RootState) => state.auth.user?.name,
  );

  const { data: coursesResponse } = useGetCourses();
  const courses = useMemo(() => coursesResponse ?? [], [coursesResponse]);
  const teacherCourses = useMemo(
    () =>
      showCourseFilter
        ? courses.filter((course) => course.createBy?._id === currentUserId)
        : [],
    [showCourseFilter, courses, currentUserId],
  );
  const activeCourseId = courseId || undefined;
  const selectedConversationCourseId =
    getConversationCourseId(selectedConversation);
  const conversationCourseId =
    activeCourseId || selectedConversationCourseId || undefined;

  useEffect(() => {
    if (defaultCourseId) {
      setCourseId(defaultCourseId);
      return;
    }
    if (showCourseFilter && !courseId && teacherCourses.length > 0) {
      setCourseId(teacherCourses[0]._id);
    }
  }, [defaultCourseId, courseId, showCourseFilter, teacherCourses]);

  useEffect(() => {
    if (defaultReceiverId) {
      setReceiverId(defaultReceiverId);
    }
  }, [defaultReceiverId]);

  useEffect(() => {
    setSelectedConversation(null);
    if (!defaultReceiverId) {
      setReceiverId("");
    }
  }, [courseId, defaultReceiverId]);

  const {
    data: conversationsResponse,
    isFetching: conversationsLoading,
    refetch: refetchConversations,
  } = useGetChatConversations(
    activeCourseId,
    showCourseFilter ? !!activeCourseId : true,
  );

  const conversationTargetId =
    selectedConversation?.otherUser._id ?? receiverId;

  const {
    data: conversationResponse,
    isFetching: conversationLoading,
    refetch: refetchConversation,
  } = useGetConversation(
    conversationCourseId,
    conversationTargetId,
    1,
    50,
    !!conversationTargetId,
  );

  const conversations = useMemo(
    () => conversationsResponse?.data ?? [],
    [conversationsResponse],
  );
  const totalUnreadCount = useMemo(
    () =>
      conversations.reduce(
        (sum, conversation) => sum + (conversation.unreadCount ?? 0),
        0,
      ),
    [conversations],
  );

  useEffect(() => {
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
    });

    socketClient.on("disconnect", () => {
      setStatus("disconnected");
    });

    socketClient.on("connect_error", () => {
      setStatus("error");
    });

    socketClient.on("connection_success", () => {
      setStatus("connected");
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

    socketClient.on("userTyping", (data: { email?: string }) => {
      setTypingIndicator(data?.email ? `${data.email} đang gõ...` : null);
    });

    socketClient.on("userStopTyping", () => {
      setTypingIndicator(null);
    });

    return () => {
      socketClient.disconnect();
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [receiverId, selectedConversation, refetchConversations]);

  useEffect(() => {
    if (!conversationResponse?.data) return;
    setMessages(conversationResponse.data.data);
  }, [conversationResponse]);

  useEffect(() => {
    if (!socket || !courseId) return;
    socket.emit("joinCourse", { courseId });
  }, [socket, courseId]);

  const handleSelectConversation = (conversation: ChatConversationSummary) => {
    setSelectedConversation(conversation);
    setReceiverId(conversation.otherUser._id);
    if (conversation.otherUser._id) {
      refetchConversation();
    }
  };

  const emitTyping = () => {
    const typingCourseId = conversationCourseId;
    if (!socket || !typingCourseId || !receiverId) return;
    socket.emit("typing", { courseId: typingCourseId, receiverId });
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping", { courseId: typingCourseId, receiverId });
    }, 1000);
  };

  const handleSendMessage = () => {
    const sendCourseId = conversationCourseId;
    if (!socket || !sendCourseId || !receiverId || !messageText.trim()) return;
    socket.emit("sendMessage", {
      courseId: sendCourseId,
      receiverId,
      message: messageText.trim(),
      messageType: "text",
    });
    setMessageText("");
  };

  const handleLeaveCourse = () => {
    if (!socket || !courseId) return;
    socket.emit("leaveCourse", { courseId });
    setStatus("disconnected");
    setMessages([]);
    setSelectedConversation(null);
    setReceiverId("");
    setTypingIndicator(null);
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-semibold">{title}</h1>
            {totalUnreadCount > 0 && (
              <span className="rounded-full bg-rose-100 px-3 py-1 text-sm font-semibold text-rose-700">
                {totalUnreadCount} tin nhắn mới
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-medium",
              status === "connected"
                ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                : status === "error"
                  ? "border-rose-300 bg-rose-50 text-rose-700"
                  : "border-slate-300 bg-slate-50 text-slate-700",
            )}
          >
            {status === "connected" ? (
              <Wifi className="h-4 w-4" />
            ) : (
              <WifiOff className="h-4 w-4" />
            )}
            {status === "connected"
              ? "Đã kết nối"
              : status === "error"
                ? "Lỗi kết nối"
                : "Chưa kết nối"}
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-slate-50 px-3 py-1 text-sm text-slate-700">
            <CircleDot className="h-4 w-4 text-indigo-600" />
            {currentUserName ?? "Không xác định"}
          </span>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
        <div className="space-y-4">
          {showCourseFilter && (
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle>Bộ lọc khóa học</CardTitle>
                <CardDescription>
                  Chọn khóa học bạn đang giảng dạy để lọc danh sách cuộc trò
                  chuyện.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Khóa học
                  </label>
                  <select
                    value={courseId}
                    onChange={(event) => setCourseId(event.target.value)}
                    className="block w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  >
                    <option value="">Chọn khóa học</option>
                    {teacherCourses.map((course) => (
                      <option key={course._id} value={course._id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="h-fit overflow-hidden">
            <CardHeader>
              <CardTitle>Cuộc trò chuyện</CardTitle>
              <CardDescription>
                Chọn một cuộc trò chuyện để xem lịch sử hoặc nhập receiverId để
                gửi tin nhắn trực tiếp.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {conversationsLoading ? (
                <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-slate-500">
                  Đang tải danh sách cuộc trò chuyện...
                </div>
              ) : conversations.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-slate-500">
                  {showCourseFilter
                    ? "Chưa có cuộc trò chuyện nào trong khóa học này."
                    : "Chưa có cuộc trò chuyện nào."}
                </div>
              ) : (
                <div className="space-y-2">
                  {conversations.map((conversation) => (
                    <button
                      key={conversation.otherUser._id}
                      type="button"
                      onClick={() => handleSelectConversation(conversation)}
                      className={cn(
                        "w-full rounded-2xl border px-4 py-3 text-left transition hover:border-slate-400",
                        selectedConversation?.otherUser._id ===
                          conversation.otherUser._id
                          ? "border-indigo-500 bg-indigo-50"
                          : "border-slate-200 bg-white",
                      )}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-medium text-slate-900">
                            {conversation.otherUser.name}
                          </p>
                          <p className="text-sm text-slate-500 truncate">
                            {conversation.lastMessage}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-slate-400">
                            {formatDate(conversation.lastMessageTime)}
                          </p>
                          {conversation.unreadCount > 0 && (
                            <span className="mt-2 inline-flex items-center rounded-full bg-rose-100 px-2.5 py-0.5 text-[11px] font-semibold text-rose-700">
                              {conversation.unreadCount} mới
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="mt-4 min-h-[520px] overflow-hidden">
          <CardHeader>
            <CardTitle>Trò chuyện</CardTitle>
            <CardDescription>
              {selectedConversation
                ? `Đang nói chuyện với ${selectedConversation.otherUser.name}`
                : receiverId
                  ? `Nhắn tin tới ${receiverId}`
                  : "Chưa có cuộc trò chuyện được chọn"}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex h-[560px] flex-col gap-3 overflow-hidden p-0">
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-slate-50">
              {conversationLoading && (
                <div className="rounded-3xl border border-dashed border-slate-200 bg-white/80 p-6 text-center text-slate-500">
                  Đang tải lịch sử tin nhắn...
                </div>
              )}

              {!conversationLoading && messages.length === 0 && (
                <div className="rounded-3xl border border-dashed border-slate-200 bg-white/80 p-6 text-center text-slate-500">
                  Không có tin nhắn lịch sử. Gửi tin nhắn đầu tiên để bắt đầu.
                </div>
              )}

              {messages.map((message) => {
                const isMine = getUserId(message.senderId) === currentUserId;
                return (
                  <div
                    key={message._id}
                    className={cn(
                      "flex flex-col gap-2 rounded-3xl px-4 py-3 shadow-sm",
                      isMine
                        ? "ml-auto max-w-[80%] bg-indigo-600 text-white"
                        : "mr-auto max-w-[80%] bg-white text-slate-900 border border-slate-200",
                    )}
                  >
                    <div className="flex items-center justify-between gap-3 text-[11px] uppercase tracking-[0.15em] text-slate-400">
                      <span>
                        {isMine
                          ? "Bạn"
                          : typeof message.senderId === "object"
                            ? message.senderId?.name
                            : "Người khác"}
                      </span>
                      <span>{formatDate(message.createdAt)}</span>
                    </div>
                    <p className="whitespace-pre-wrap break-words text-sm leading-6">
                      {message.message}
                    </p>
                  </div>
                );
              })}
            </div>

            <CardFooter className="flex flex-col gap-3 border-t px-4 py-4 bg-white">
              {typingIndicator && (
                <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-sm text-slate-600">
                  <CircleDot className="h-3 w-3 text-emerald-500" />
                  {typingIndicator}
                </div>
              )}
              <div className="grid gap-3 w-full sm:grid-cols-[1fr_auto]">
                <Textarea
                  value={messageText}
                  onChange={(event) => {
                    setMessageText(event.target.value);
                    emitTyping();
                  }}
                  placeholder="Gõ tin nhắn..."
                  rows={3}
                />
                <Button
                  className="h-14 w-full sm:w-auto"
                  onClick={handleSendMessage}
                  disabled={
                    !messageText.trim() || !conversationCourseId || !receiverId
                  }
                >
                  <Send className="mr-2 h-4 w-4" /> Gửi
                </Button>
              </div>
            </CardFooter>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
