import React from "react";
import { INotification } from "@/types/notification.type";
import NotificationCard from "./notification-card";

interface NotificationSectionProps {
  title: string;
  icon: string;
  notifications: INotification[];
  onAccept: (invitationId: string) => void;
  onDecline: (invitationId: string) => void;
  onViewTask: (taskId: string) => void;
  className?: string;
}

const NotificationSection: React.FC<NotificationSectionProps> = ({
  title,
  icon,
  notifications,
  onAccept,
  onDecline,
  onViewTask,
  className = "mb-8",
}) => {
  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      <div className="mb-4 flex items-center gap-2">
        <span className={getIconColor(icon)}>{icon}</span>
        <h2 className="text-foreground text-lg font-medium">{title}</h2>
      </div>
      <div className="space-y-3">
        {notifications.map((notification) => (
          <NotificationCard
            key={notification.id}
            notification={notification}
            onAccept={onAccept}
            onDecline={onDecline}
            onViewTask={onViewTask}
          />
        ))}
      </div>
    </div>
  );
};

const getIconColor = (icon: string) => {
  switch (icon) {
    case "🔥":
      return "text-orange-500";
    case "👥":
      return "text-blue-500";
    case "🔔":
      return "text-green-500";
    default:
      return "text-gray-500";
  }
};

export default NotificationSection;