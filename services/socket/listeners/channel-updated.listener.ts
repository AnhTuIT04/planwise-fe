import { IChannel } from "@/types/channel.type";
import { useQueryClient } from "@tanstack/react-query";
import { produce } from "immer";
import { useEffect } from "react";
import { Socket } from "socket.io-client";

interface IUpdatePayload {
  id: string;
  name: string;
  type: IChannel["type"];
  projectId: string;
}

interface IDeletePayload {
  id: string;
  projectId?: string;
}

export function useChannelUpdatedListener(socket: Socket | null) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) return;

    const onUpdate = (data: IUpdatePayload) => {
      queryClient.setQueryData<IChannel[]>(["channels", data.projectId], (old) =>
        produce(old, (draft) => {
          if (!draft) return;
          const ch = draft.find((c) => c.id === data.id);
          if (ch) {
            ch.name = data.name;
            ch.type = data.type;
          }
        }),
      );
    };

    const onDelete = (data: IDeletePayload) => {
      const queries = queryClient.getQueriesData<IChannel[]>({ queryKey: ["channels"] });
      for (const [key, value] of queries) {
        if (!value) continue;
        const next = value.filter((c) => c.id !== data.id);
        if (next.length !== value.length) {
          queryClient.setQueryData(key, next);
        }
      }
    };

    socket.on("s2c:project:update-channel", onUpdate);
    socket.on("s2c:project:delete-channel", onDelete);

    return () => {
      socket.off("s2c:project:update-channel", onUpdate);
      socket.off("s2c:project:delete-channel", onDelete);
    };
  }, [socket, queryClient]);
}
