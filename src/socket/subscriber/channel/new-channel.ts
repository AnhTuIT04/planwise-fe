import { QueryClient } from "@tanstack/react-query";
import { Socket } from "socket.io-client";
import { produce } from "immer";

import { IChannel } from "@/types/channel.type";

interface IS2CPayload {
  id: string;
  name: string;
  type: IChannel["type"];
  projectId: string;
}

export function handleNewChannel(socket: Socket, queryClient: QueryClient) {
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

  socket.on("s2c:project:new-channel", handler);

  return () => {
    socket.off("s2c:project:new-channel", handler);
  };
}
