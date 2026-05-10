"use client";

import { nanoid } from "nanoid";
import { produce } from "immer";
import { InfiniteData, useInfiniteQuery, useQueryClient } from "@tanstack/react-query";

import { useSocket } from "@/components/providers/socket-provider";
import { useAuth } from "@/components/providers/auth-provider";
import {
  getChannelMessagesApi,
  GetChannelMessagesResponse as Response,
} from "@/services/apis/channel/get-channel-messages.api";
import { uploadSingleApi } from "@/services/apis/upload/upload-single.api";
import { IMessage } from "@/types/channel.type";

export function useChannelMessages({ channelId }: { channelId: string }) {
  const { user } = useAuth();
  const { sendMessage } = useSocket();
  const queryClient = useQueryClient();

  // Fetch messages from API
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ["channel-messages", channelId],
    initialPageParam: null as string | null,
    queryFn: ({ pageParam }) => getChannelMessagesApi(channelId, pageParam),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled: !!channelId,
  });

  // Combine all pages of messages into a single array
  const messages = data?.pages.flatMap((page) => page.data) ?? [];

  const handleSendMessage = async (content: string, contentType: "TEXT" | "IMAGE" | "VIDEO" | "FILE" = "TEXT") => {
    if (!user) return;

    const tempId = nanoid();
    const optimisticMessage: IMessage = {
      id: tempId,
      content,
      contentType,
      sender: user,
      createdAt: new Date().toISOString(),
    };
    // Optimistically update the messages list
    queryClient.setQueryData<InfiniteData<Response>>(["channel-messages", channelId], (old) =>
      produce(old, (draft) => {
        if (!draft) return;

        // If there are no pages yet, create the first page
        if (draft.pages.length === 0) {
          draft.pages.push({
            data: [optimisticMessage],
            nextCursor: null,
          });
          return;
        }

        // Insert the optimistic message at the start of the first page
        draft.pages[0].data.unshift(optimisticMessage);
      }),
    );

    // Send the message through the socket
    sendMessage({
      channelId,
      content,
      contentType,
      tempId,
    });
  };

  const handleSendFile = async (file: File) => {
    if (!user) return;

    // Determine content type based on file MIME type
    let contentType: "IMAGE" | "VIDEO" | "FILE" = "FILE";
    if (file.type.startsWith("image/")) {
      contentType = "IMAGE";
    } else if (file.type.startsWith("video/")) {
      contentType = "VIDEO";
    }

    const tempId = nanoid();

    // Show optimistic message with file name
    const optimisticMessage = {
      id: tempId,
      content: file.name,
      contentType,
      sender: user,
      createdAt: new Date().toISOString(),
      pending: true,
    };

    queryClient.setQueryData<InfiniteData<Response>>(["channel-messages", channelId], (old) =>
      produce(old, (draft) => {
        if (!draft) return;

        if (draft.pages.length === 0) {
          draft.pages.push({
            data: [optimisticMessage],
            nextCursor: null,
          });
          return;
        }

        draft.pages[0].data.unshift(optimisticMessage);
      }),
    );

    try {
      // Upload file first
      const uploadedUrl = await uploadSingleApi({ file });

      if (uploadedUrl) {
        // Send message with uploaded file URL
        sendMessage({
          channelId,
          content: uploadedUrl,
          contentType,
          tempId,
        });
      }
    } catch (error) {
      console.error("Failed to upload file:", error);
      // Remove optimistic message on error
      queryClient.setQueryData<InfiniteData<Response>>(["channel-messages", channelId], (old) =>
        produce(old, (draft) => {
          if (!draft) return;
          draft.pages[0].data = draft.pages[0].data.filter((msg) => msg.id !== tempId);
        }),
      );
    }
  };

  return {
    messages: messages.reverse(),
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    sendMessage: handleSendMessage,
    sendFile: handleSendFile,
  };
}
