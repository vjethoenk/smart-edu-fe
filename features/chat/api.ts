import axiosClient from "@/lib/axios";
import { ApiResponse } from "@/types/api";

export type ChatMessageType = "text" | "image" | "file";

export interface ChatUserSummary {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface ChatMessage {
  _id: string;
  courseId: string;
  senderId: ChatUserSummary | string;
  receiverId: ChatUserSummary | string;
  message: string;
  messageType: ChatMessageType;
  fileUrl?: string;
  fileName?: string;
  isRead: boolean;
  readAt?: string;
  status?: string;
  createdAt: string;
}

export interface ChatConversationSummary {
  _id: string | Record<string, any>;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  otherUser: ChatUserSummary;
}

export interface ChatConversationResponse {
  data: ChatMessage[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ChatConversationsResponse {
  data: ChatConversationSummary[];
}

export interface SendChatMessageRequest {
  courseId: string;
  receiverId: string;
  message: string;
  messageType?: ChatMessageType;
  fileUrl?: string;
  fileName?: string;
}

export const chatApi = {
  getConversations: (courseId?: string) => {
    const path = courseId
      ? `/v1/chat/conversations/${courseId}`
      : "/v1/chat/conversations";
    return axiosClient.get<ApiResponse<ChatConversationSummary[]>>(path);
  },

  getConversation: (
    courseId: string | undefined,
    otherUserId: string,
    page = 1,
    limit = 50,
  ) => {
    const path = courseId
      ? `/v1/chat/conversation/${courseId}/${otherUserId}`
      : `/v1/chat/conversation/${otherUserId}`;
    return axiosClient.get<ApiResponse<ChatConversationResponse>>(
      `${path}?page=${page}&limit=${limit}`,
    );
  },

  sendMessage: (data: SendChatMessageRequest) => {
    return axiosClient.post<ApiResponse<ChatMessage>>("/v1/chat/message", data);
  },

  markAsRead: (chatId: string) => {
    return axiosClient.post<ApiResponse<any>>(
      `/v1/chat/message/${chatId}/read`,
    );
  },

  getUnreadCount: (courseId?: string) => {
    const query = courseId ? `?courseId=${encodeURIComponent(courseId)}` : "";
    return axiosClient.get<ApiResponse<{ count: number }>>(
      `/v1/chat/unread-count${query}`,
    );
  },

  searchMessages: (courseId: string, q: string) => {
    return axiosClient.get<ApiResponse<ChatMessage[]>>(
      `/v1/chat/search/${courseId}?q=${encodeURIComponent(q)}`,
    );
  },
};
