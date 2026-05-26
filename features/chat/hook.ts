import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  chatApi,
  SendChatMessageRequest,
  ChatConversationResponse,
  ChatConversationSummary,
} from "./api";

export const useGetChatConversations = (courseId?: string, enabled = false) => {
  return useQuery({
    queryKey: ["chat", "conversations", courseId ?? "all"],
    queryFn: async () => {
      const response = await chatApi.getConversations(courseId);
      return response;
    },
    enabled: courseId !== undefined ? enabled : true,
    staleTime: 1000 * 60,
  });
};

export const useGetConversation = (
  courseId: string | undefined,
  otherUserId: string,
  page = 1,
  limit = 50,
  enabled = false,
) => {
  return useQuery({
    queryKey: [
      "chat",
      "conversation",
      courseId ?? "all",
      otherUserId,
      page,
      limit,
    ],
    queryFn: async () => {
      const response = await chatApi.getConversation(
        courseId,
        otherUserId,
        page,
        limit,
      );
      return response;
    },
    enabled: !!otherUserId,
    staleTime: 1000 * 60,
  });
};

export const useSendChatMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SendChatMessageRequest) => chatApi.sendMessage(data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["chat", "conversations", variables.courseId],
      });
      queryClient.invalidateQueries({
        queryKey: [
          "chat",
          "conversation",
          variables.courseId,
          variables.receiverId,
        ],
      });
    },
  });
};

export const useGetUnreadCount = (courseId?: string, enabled = false) => {
  return useQuery({
    queryKey: ["chat", "unread-count", courseId],
    queryFn: async () => {
      const response = await chatApi.getUnreadCount(courseId);
      return response;
    },
    enabled,
    staleTime: 1000 * 10,
  });
};
