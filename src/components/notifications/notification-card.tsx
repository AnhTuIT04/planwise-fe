import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { INotification } from "@/types/notification.type";

interface NotificationCardProps {
  notification: INotification;
  onAccept: (invitationId: string) => void;
  onDecline: (invitationId: string) => void;
  onViewTask: (taskId: string) => void;
}

const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  onAccept,
  onDecline,
  onViewTask,
}) => {
  const getIcon = (type: string) => {
    switch (type) {
      case "TASK_OVERDUE":
        return "⚠️";
      case "PROJECT_INVITATION":
        return "👤";
      case "PROJECT_UPDATE":
        return "✅";
      default:
        return "📢";
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return "just now";
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else {
      return `${Math.floor(diffInHours / 24)} days ago`;
    }
  };

  return (
    <div className="bg-card border-border hover:bg-accent/50 rounded-lg border p-4 transition-colors">
      <div className="flex items-start gap-3">
        {/* Icon or Avatar */}
        {notification.user ? (
          <Avatar className="size-10">
            <AvatarImage src={notification.user.avatarUrl || ""} />
            <AvatarFallback className="bg-primary/10 text-primary text-sm">
              {notification.user.fullname.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        ) : (
          <div className="bg-muted flex size-10 items-center justify-center rounded-full">
            <span className="text-lg">{getIcon(notification.type)}</span>
          </div>
        )}

        <div className="min-w-0 flex-1">
          {/* Header */}
          <div className="mb-2 flex items-start justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-foreground text-sm font-medium">
                {notification.title}
              </h3>
              {notification.type === "TASK_OVERDUE" && (
                <Badge variant="destructive" className="text-xs">
                  Overdue
                </Badge>
              )}
            </div>
            <span className="text-muted-foreground text-xs whitespace-nowrap">
              {formatTime(notification.createdAt)}
            </span>
          </div>

          {/* Message */}
          <p className="text-muted-foreground mb-3 text-sm">
            {notification.message}
          </p>

          {/* Metadata */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {notification.task && (
                <Badge variant="outline" className="text-xs">
                  Due: Today 5:00 PM
                </Badge>
              )}
              {notification.project && (
                <Badge variant="outline" className="text-xs">
                  Project: {notification.project.name}
                </Badge>
              )}
              {notification.metadata?.role && (
                <Badge variant="outline" className="text-xs">
                  {notification.metadata.role}
                </Badge>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {notification.type === "PROJECT_INVITATION" &&
                notification.metadata?.invitationId && (
                  <>
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => onAccept(notification.metadata!.invitationId)}
                      className="px-3 py-1 text-xs bg-green-500 hover:bg-green-600"
                    >
                      Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        onDecline(notification.metadata!.invitationId)
                      }
                      className="px-3 py-1 text-xs"
                    >
                      Decline
                    </Button>
                  </>
                )}
              {notification.type === "TASK_OVERDUE" && notification.task && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onViewTask(notification.task!.id)}
                  className="px-3 py-1 text-xs"
                >
                  View Task
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;