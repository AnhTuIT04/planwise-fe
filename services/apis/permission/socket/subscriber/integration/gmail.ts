import { QueryClient } from "@tanstack/react-query";
import { Socket } from "socket.io-client";

export function handleNewGmailEvent(socket: Socket, queryClient: QueryClient) {
  const handler = () => {
    queryClient.invalidateQueries({ queryKey: ["gmail-messages"] });
  };
  socket.on("integration:gmail", handler);

  return () => {
    socket.off("integration:gmail", handler);
  };
}
