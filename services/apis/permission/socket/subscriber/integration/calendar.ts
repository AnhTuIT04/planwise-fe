import { QueryClient } from "@tanstack/react-query";
import { Socket } from "socket.io-client";

export function handleNewCalendarEvent(socket : Socket, queryClient : QueryClient) {
    const handler = () => {
        queryClient.invalidateQueries({ queryKey: ["events", "GOOGLE_CALENDAR"] });
    };
    socket.on("integration:calendar", handler);

    return () => {
        socket.off("integration:calendar", handler);
    }
}