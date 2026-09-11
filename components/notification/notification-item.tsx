"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AlertCircle, Check, CheckCircle2, Clock, Mail, PenSquare, UserPlus, XCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTaskModalStore } from "@/stores/task-modal.store";
import { useNotificationMutations } from "@/hooks/use-notifications";
import { responseInviteProjectApi } from "@/services/apis/project/response-invite.api";
import { INotification } from "@/types/notification.type";
import { useAuth } from "../providers/auth-provider";

function timeAgo(iso: string): string {
  const seconds = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

function initials(name?: string | null): string {
  if (!name) return "?";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function typeIcon(type: INotification["type"]) {
  switch (type) {
    case "TASK_ASSIGNED":
      return <UserPlus className="h-4 w-4 text-blue-600" />;
    case "TASK_UPDATED":
      return <PenSquare className="h-4 w-4 text-amber-600" />;
    case "TASK_DEADLINE_REMINDER":
      return <Clock className="h-4 w-4 text-orange-600" />;
    case "TASK_DEADLINE_MISSED":
      return <AlertCircle className="h-4 w-4 text-red-600" />;
    case "PROJECT_INVITATION":
      return <Mail className="h-4 w-4 text-violet-600" />;
    case "INVITATION_ACCEPTED":
      return <CheckCircle2 className="h-4 w-4 text-emerald-600" />;
    case "INVITATION_DECLINED":
      return <XCircle className="h-4 w-4 text-rose-600" />;
    case "PROJECT_NEW_MEMBER":
      return <UserPlus className="h-4 w-4 text-emerald-600" />;
  }
}

function notificationLabel(n: INotification): React.ReactNode {
  const { type, payload } = n;
  switch (type) {
    case "TASK_ASSIGNED":
      return (
        <>
          <strong>{payload.actor?.fullname ?? "Someone"}</strong> assigned you to <strong>{payload.task?.title}</strong>{" "}
          in <em>{payload.project?.name}</em>
        </>
      );
    case "TASK_UPDATED": {
      const fields = payload.changes?.length ? payload.changes.join(", ") : "";
      return (
        <>
          <strong>{payload.actor?.fullname ?? "Someone"}</strong> updated <strong>{payload.task?.title}</strong>
          {fields ? <> ({fields})</> : null} in <em>{payload.project?.name}</em>
        </>
      );
    }
    case "TASK_DEADLINE_REMINDER":
      return (
        <>
          Deadline approaching for <strong>{payload.task?.title}</strong>{" "}
          {payload.task?.deadline ? <>· due {new Date(payload.task.deadline).toLocaleString()}</> : null}
        </>
      );
    case "TASK_DEADLINE_MISSED":
      return (
        <>
          Missed deadline on <strong>{payload.task?.title}</strong>{" "}
          {payload.task?.deadline ? <>· was due {new Date(payload.task.deadline).toLocaleString()}</> : null}
        </>
      );
    case "PROJECT_INVITATION":
      return (
        <>
          <strong>{payload.inviter?.fullname ?? "Someone"}</strong> invited you to join{" "}
          <strong>{payload.project?.name}</strong>
        </>
      );
    case "INVITATION_ACCEPTED":
      return (
        <>
          <strong>{payload.invitee?.fullname ?? "Someone"}</strong> accepted your invitation to{" "}
          <strong>{payload.project?.name}</strong>
        </>
      );
    case "INVITATION_DECLINED":
      return (
        <>
          <strong>{payload.invitee?.fullname ?? "Someone"}</strong> declined your invitation to{" "}
          <strong>{payload.project?.name}</strong>
        </>
      );
    case "PROJECT_NEW_MEMBER":
      return (
        <>
          <strong>{payload.newMember?.fullname ?? "Someone"}</strong> joined <strong>{payload.project?.name}</strong>
        </>
      );
  }
}

export function NotificationItem({ notification }: { notification: INotification }) {
  const router = useRouter();
  const { markRead } = useNotificationMutations();
  const queryClient = useQueryClient();

  const { user } = useAuth();

  const [respondedAs, setRespondedAs] = useState<"ACCEPTED" | "DECLINED" | null>(null);

  const respond = useMutation({
    mutationFn: async (decision: "ACCEPTED" | "DECLINED") => {
      const [, err, msg] = await responseInviteProjectApi(notification.payload.project!.id, { response: decision });
      if (err) throw err;
      return msg;
    },
    onSuccess: () => {
      markRead.mutate(notification.id);
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: () => {
      setRespondedAs(null);
    },
  });

  const isInvitation = notification.type === "PROJECT_INVITATION";
  const isReminder = notification.type === "TASK_DEADLINE_REMINDER" || notification.type === "TASK_DEADLINE_MISSED";

  const avatar = useMemo(() => {
    const actor =
      notification.payload.actor ??
      notification.payload.inviter ??
      notification.payload.invitee ??
      notification.payload.newMember;
    return actor;
  }, [notification.payload]);

  const setPendingOpen = useTaskModalStore((s) => s.setPendingOpen);

  const handleCardClick = () => {
    if (isInvitation) return;

    if (!notification.isRead) markRead.mutate(notification.id);

    const task = notification.payload.task;
    const project = notification.payload.project;
    if (!task || !project) return;

    setPendingOpen({
      taskId: task.id,
      projectId: project.id,
      sectionId: task.sectionId,
    });

    const target = isReminder && project.id === user?.workspaceId ? "/my-tasks" : `/projects/${project.id}/workspace`;
    router.push(target);
  };

  return (
    <div
      role={isInvitation ? undefined : "button"}
      tabIndex={isInvitation ? -1 : 0}
      onClick={handleCardClick}
      onKeyDown={(e) => {
        if (isInvitation) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleCardClick();
        }
      }}
      className={cn(
        "flex gap-3 rounded-lg border border-transparent px-4 py-3 transition",
        notification.isRead ? "bg-white hover:bg-[#f5f6f8]" : "bg-blue-50/70 hover:bg-blue-100/70",
        !isInvitation && "cursor-pointer",
      )}
    >
      <div className="relative">
        <Avatar size="default">
          {avatar?.avatarUrl ? <AvatarImage src={avatar.avatarUrl} alt={avatar.fullname} /> : null}
          <AvatarFallback>{initials(avatar?.fullname)}</AvatarFallback>
        </Avatar>
        <span className="absolute -right-1 -bottom-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-sm">
          {typeIcon(notification.type)}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-1">
        {isReminder && notification.payload.project ? (
          <div className="mb-0.5 flex items-center gap-1.5">
            <Avatar className="h-4 w-4">
              {notification.payload.project.logoUrl ? (
                <AvatarImage src={notification.payload.project.logoUrl} alt={notification.payload.project.name} />
              ) : null}
              <AvatarFallback className="text-[9px]">{initials(notification.payload.project.name)}</AvatarFallback>
            </Avatar>
            <span className="text-xs font-medium text-gray-600">{notification.payload.project.name}</span>
          </div>
        ) : null}

        <p className="text-sm leading-snug text-gray-800">{notificationLabel(notification)}</p>

        {isInvitation && notification.payload.role ? (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Role:</span>
            <Badge variant="secondary">{notification.payload.role.name}</Badge>
          </div>
        ) : null}

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">{timeAgo(notification.createdAt)}</span>
          {!notification.isRead ? <span className="h-2 w-2 rounded-full bg-blue-500" /> : null}
        </div>

        {isInvitation ? (
          <div className="mt-2 flex gap-2">
            {respondedAs === null ? (
              <>
                <Button
                  size="sm"
                  className="bg-emerald-600 text-white hover:bg-emerald-700"
                  disabled={respond.isPending}
                  onClick={(e) => {
                    e.stopPropagation();
                    setRespondedAs("ACCEPTED");
                    respond.mutate("ACCEPTED");
                  }}
                >
                  Accept
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={respond.isPending}
                  onClick={(e) => {
                    e.stopPropagation();
                    setRespondedAs("DECLINED");
                    respond.mutate("DECLINED");
                  }}
                >
                  Decline
                </Button>
              </>
            ) : respondedAs === "ACCEPTED" ? (
              <span className="inline-flex items-center gap-1 rounded-md bg-emerald-600 px-3 py-1 text-xs font-medium text-white">
                <Check className="h-3.5 w-3.5" />
                Accepted
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-md bg-rose-600 px-3 py-1 text-xs font-medium text-white">
                <XCircle className="h-3.5 w-3.5" />
                Declined
              </span>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
