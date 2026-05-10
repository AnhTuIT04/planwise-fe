import { IChannel } from "@/types/channel.type";
import { useQueryClient } from "@tanstack/react-query";
import { produce } from "immer";
import { useEffect } from "react";
import { Socket } from "socket.io-client";

interface IS2CPayload {
  id: string;
  name: string;
  type: IChannel["type"];
  projectId: string;
}

export function useNewChannelListener(socket: Socket | null) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) return;

    const handler = (data: IS2CPayload) => {
      queryClient.setQueryData<IChannel[]>(["channels", data.projectId], (old) =>
        produce(old, (draft) => {
          if (!draft) return;

          ///// Check if channel already exists /////
          const exists = draft.some((channel) => channel.id === data.id);
          if (exists) return;

          draft.push({
            id: data.id,
            name: data.name,
            type: data.type,
          });
        }),
      );
    };

    socket.on("s2c:channel:new", handler);

    return () => {
      socket.off("s2c:channel:new", handler);
    };
  }, [socket, queryClient]);
}
