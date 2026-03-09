"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { io, Socket } from "socket.io-client";

import { socketURL } from "@/lib/consts";
import { subscribeEvents } from "@/socket/subscriber";
import { createSendMessage } from "@/socket/emitter/useSendMessage";

type SocketContextType = {
  socket: Socket | null;
  isConnected: boolean;
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export default function SocketProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  if (!socketRef.current) {
    socketRef.current = io(socketURL, {
      transports: ["websocket"],
      autoConnect: false,
    });
  }

  useEffect(() => {
    const socket = socketRef.current!;
    socket.connect();

    const unsubscribe = subscribeEvents(socket, queryClient);

    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      unsubscribe();
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.disconnect();
    };
  }, [queryClient]);

  return (
    <SocketContext.Provider value={{ socket: socketRef.current!, isConnected }}>{children}</SocketContext.Provider>
  );
}

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) throw new Error("useSocket must be used inside SocketProvider");
  if (!context.socket) throw new Error("Socket is not initialized");

  const { sendMessage } = createSendMessage(context.socket);

  return {
    socket: context.socket,
    isConnected: context.isConnected,
    sendMessage,
  };
};
