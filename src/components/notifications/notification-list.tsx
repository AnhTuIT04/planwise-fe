import React from "react";
import { INotification } from "@/types/notification.type";
import NotificationSection from "./notification-section";
import NotificationCard from "./notification-card";

interface NotificationListProps {
  notifications: INotification[];
  filter: "all" | "overdue" | "invitations" | "updates";
  onAccept: (invitationId: string) => void;
  onDecline: (invitationId: string) => void;
  onViewTask: (taskId: string) => void;
}

const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
  filter,
  onAccept,
  onDecline,
  onViewTask,
}) => {
  const urgentItems = notifications.filter(
    (n) =>
      n.type === "TASK_OVERDUE" ||
      (n.type === "PROJECT_INVITATION" && isExpiringSoon(n.createdAt))
  );

  const projectInvitations = notifications.filter(
    (n) => n.type === "PROJECT_INVITATION"
  );
  const projectUpdates = notifications.filter((n) => n.type === "PROJECT_UPDATE");

  const getFilteredNotifications = () => {
    switch (filter) {
      case "overdue":
        return urgentItems;
      case "invitations":
        return projectInvitations;
      case "updates":
        return projectUpdates;
      default:
        return notifications;
    }
  };

  // If filtering by specific type, show simple list
  if (filter !== "all") {
    const filtered = getFilteredNotifications();
    return (
      <div className="space-y-3">
        {filtered.map((notification) => (
          <NotificationCard
            key={notification.id}
            notification={notification}
            onAccept={onAccept}
            onDecline={onDecline}
            onViewTask={onViewTask}
          />
        ))}
      </div>
    );
  }

  // Show all sections when filter is "all"
  return (
    <div className="space-y-6 max-h-[calc(100vh-160px)] overflow-y-auto">
      {/* Urgent Items Section */}
      <NotificationSection
        title="Today's Urgent Items"
        icon="🔥"
        notifications={urgentItems}
        onAccept={onAccept}
        onDecline={onDecline}
        onViewTask={onViewTask}
      />

      {/* Project Invitations Section */}
      <NotificationSection
        title="Project Invitations"
        icon="👥"
        notifications={projectInvitations}
        onAccept={onAccept}
        onDecline={onDecline}
        onViewTask={onViewTask}
      />

      {/* Project Updates Section */}
      <NotificationSection
        title="Project Updates"
        icon="🔔"
        notifications={projectUpdates}
        onAccept={onAccept}
        onDecline={onDecline}
        onViewTask={onViewTask}
        className="mb-8"
      />
    </div>
  );
};

// Helper function to check if invitation is expiring soon
const isExpiringSoon = (createdAt: string): boolean => {
  const created = new Date(createdAt);
  const now = new Date();
  const diffInHours = (now.getTime() - created.getTime()) / (1000 * 60 * 60);
  return diffInHours > 23; // Consider expiring if created more than 23 hours ago
};

export default NotificationList;