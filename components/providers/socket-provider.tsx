"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";

import { useAuth } from "@/components/providers/auth-provider";
import { socketURL } from "@/lib/consts";
import { useNotificationListener } from "@/services/socket/listeners/notification.listener";
import { sendMessageEmitter } from "@/services/socket/emitters/send-message.emiter";
import { useNewChannelListener } from "@/services/socket/listeners/new-channel.listener";
import { useNewMessageListener } from "@/services/socket/listeners/new-message.listener";
import { subscribeEvents } from "@/services/apis/permission/socket/subscriber";

interface SocketContextValue {
  socket: Socket | null;
  connected: boolean;
}

const SocketContext = createContext<SocketContextValue>({ socket: null, connected: false });

export default function SocketProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!user) return;

    const instance = io(socketURL, {
      withCredentials: true,
    });

    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);
    const onError = (err: Error) => console.error("[socket] connect_error:", err.message);

    instance.on("connect", onConnect);
    instance.on("disconnect", onDisconnect);
    instance.on("connect_error", onError);

    // Sync the socket handle into React state so consumers can subscribe to it.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSocket(instance);

    return () => {
      instance.off("connect", onConnect);
      instance.off("disconnect", onDisconnect);
      instance.off("connect_error", onError);
      instance.disconnect();
      setSocket(null);
      setConnected(false);
    };
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, connected }}>
      <SocketListeners socket={socket} />
      {children}
    </SocketContext.Provider>
  );
}

function SocketListeners({ socket }: { socket: Socket | null }) {
  const queryClient = useQueryClient();

  useNotificationListener(socket);
  useNewChannelListener(socket);
  useNewMessageListener(socket);

  useEffect(() => {
    if (!socket) return;
    return subscribeEvents(socket, queryClient);
  }, [socket, queryClient]);

  return null;
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) throw new Error("useSocket must be used inside SocketProvider");
  if (!context.socket) throw new Error("Socket is not initialized");

  const sendMessage = sendMessageEmitter(context.socket);

  return { ...context, sendMessage };
}
