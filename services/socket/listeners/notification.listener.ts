"use client";

import { useEffect } from "react";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import type { Socket } from "socket.io-client";

import { INotification } from "@/types/notification.type";
import type { IListNotificationsResponse } from "@/services/apis/notification/list-notifications.api";

const NEW_NOTIFICATION_EVENT = "s2c:notification:new";

function buildToastMessage(n: INotification): string {
  switch (n.type) {
    case "TASK_ASSIGNED":
      return `New task assigned: ${n.payload.task?.title ?? ""}`;
    case "TASK_UPDATED":
      return `Task updated: ${n.payload.task?.title ?? ""}`;
    case "TASK_DEADLINE_REMINDER":
      return `Deadline approaching: ${n.payload.task?.title ?? ""}`;
    case "TASK_DEADLINE_MISSED":
      return `Missed deadline: ${n.payload.task?.title ?? ""}`;
    case "PROJECT_INVITATION":
      return `${n.payload.inviter?.fullname ?? "Someone"} invited you to ${n.payload.project?.name ?? "a project"}`;
    case "INVITATION_ACCEPTED":
      return `${n.payload.invitee?.fullname ?? "Someone"} accepted your invitation`;
    case "INVITATION_DECLINED":
      return `${n.payload.invitee?.fullname ?? "Someone"} declined your invitation`;
    case "PROJECT_NEW_MEMBER":
      return `${n.payload.newMember?.fullname ?? "Someone"} joined ${n.payload.project?.name ?? "the project"}`;
    default:
      return "New notification";
  }
}

export function useNotificationListener(socket: Socket | null) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) return;

    const handler = (notification: INotification) => {
      // Prepend to all matching notification list caches
      queryClient.setQueriesData<InfiniteData<IListNotificationsResponse["data"]>>(
        { queryKey: ["notifications", "list"] },
        (old) => {
          if (!old) return old;
          const [first, ...rest] = old.pages;
          if (!first) return old;
          return {
            ...old,
            pages: [{ ...first, items: [notification, ...first.items] }, ...rest],
          };
        },
      );

      // Bump unread count
      queryClient.setQueryData<{ count: number }>(["notifications", "unread-count"], (old) => ({
        count: (old?.count ?? 0) + 1,
      }));

      toast.info(buildToastMessage(notification));
    };

    socket.on(NEW_NOTIFICATION_EVENT, handler);
    return () => {
      socket.off(NEW_NOTIFICATION_EVENT, handler);
    };
  }, [socket, queryClient]);
}
