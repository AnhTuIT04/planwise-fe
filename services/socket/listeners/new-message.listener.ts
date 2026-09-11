import { IBasicUser } from "@/types/user.type";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { produce } from "immer";
import { useEffect } from "react";
import { Socket } from "socket.io-client";
import { GetChannelMessagesResponse as Response } from "@/services/apis/channel/get-channel-messages.api";

interface IS2CPayload {
  id: string;
  channelId: string;
  sender: IBasicUser;
  content: string;
  contentType: "TEXT" | "IMAGE" | "VIDEO" | "FILE";
  createdAt: string;
  tempId: string;
}

export function useNewMessageListener(socket: Socket | null) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) return;

    const handler = (data: IS2CPayload) => {
      queryClient.setQueryData<InfiniteData<Response>>(["channel-messages", data.channelId], (old) =>
        produce(old, (draft) => {
          if (!draft) return;

          for (const page of draft.pages) {
            if (page.data.some((m) => m.id === data.id)) return;
          }

          let replaced = false;
          for (const page of draft.pages) {
            const index = page.data.findIndex((m) => m.id === data.tempId);

            if (index !== -1) {
              page.data[index] = data;
              replaced = true;
              break;
            }
          }

          if (!replaced) {
            if (draft.pages.length === 0) {
              draft.pages.push({
                data: [data],
                nextCursor: null,
              });
            } else {
              draft.pages[0].data.unshift(data);
            }
          }
        }),
      );
    };

    socket.on("s2c:channel:new-message", handler);

    return () => {
      socket.off("s2c:channel:new-message", handler);
    };
  }, [socket, queryClient]);
}
