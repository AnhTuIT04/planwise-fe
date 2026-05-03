"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

import { useAuth } from "@/components/providers/auth-provider";
import { socketURL } from "@/lib/consts";
import { useNotificationListener } from "@/services/socket/listenners/notification.listener";

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
  useNotificationListener(socket);
  return null;
}

export function useSocket() {
  return useContext(SocketContext);
}
