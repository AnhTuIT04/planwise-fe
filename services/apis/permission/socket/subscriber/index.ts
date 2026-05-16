import { Socket } from "socket.io-client";
import { QueryClient } from "@tanstack/react-query";

import { handleChannelNewMessage } from "./channel/channel-new-message";
import { handleNewChannel } from "./channel/new-channel";
import { handleNewCalendarEvent } from "./integration/calendar";
import { handleNewGmailEvent } from "./integration/gmail";
import { handleNewNotionEvent } from "./integration/notion";

export function subscribeEvents(socket: Socket, queryClient: QueryClient) {
  const unsubscribers = [
    handleChannelNewMessage(socket, queryClient),
    handleNewChannel(socket, queryClient),
    handleNewCalendarEvent(socket, queryClient),
    handleNewGmailEvent(socket, queryClient),
    handleNewNotionEvent(socket, queryClient),
  ];

  return () => {
    unsubscribers.forEach((unsub) => unsub());
  };
}
