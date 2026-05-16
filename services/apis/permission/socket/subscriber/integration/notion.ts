import { QueryClient } from "@tanstack/react-query";
import { Socket } from "socket.io-client";

export function handleNewNotionEvent(socket: Socket, queryClient: QueryClient) {
  const handler = () => {
    // Notion-imported pages live under task queries; the FE Notion browser uses
    // mutation-backed local state, so just invalidate task-side caches here.
    queryClient.invalidateQueries({ queryKey: ["tasks"] });
    queryClient.invalidateQueries({ queryKey: ["sections"] });
    queryClient.invalidateQueries({ queryKey: ["project-detail"] });
  };
  socket.on("integration:notion", handler);

  return () => {
    socket.off("integration:notion", handler);
  };
}
