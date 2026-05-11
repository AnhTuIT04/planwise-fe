import { Socket } from "socket.io-client";

interface IC2SPayload {
  channelId: string;
  content: string;
  contentType: "TEXT" | "IMAGE" | "VIDEO" | "FILE";
  tempId: string;
}

// This is not a hook, just a helper function
export function createSendMessage(socket: Socket) {
  const sendMessage = (payload: IC2SPayload) => socket.emit("c2s:channel:send-message", payload);
  return { sendMessage };
}
