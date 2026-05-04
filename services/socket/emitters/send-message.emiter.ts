import { Socket } from "socket.io-client";

interface IC2SPayload {
  channelId: string;
  content: string;
  contentType: "TEXT" | "IMAGE" | "VIDEO" | "FILE";
  tempId: string;
}

export function sendMessageEmitter(socket: Socket) {
  return (payload: IC2SPayload) => socket.emit("c2s:channel:send-message", payload);
}
