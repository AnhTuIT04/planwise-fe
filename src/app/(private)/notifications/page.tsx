"use client";

import React, { useState } from "react";
import NotificationsHeader from "@/components/notifications/notifications-header";
import FilterTabs from "@/components/notifications/filter-tabs";
import NotificationList from "@/components/notifications/notification-list";
import { mockNotifications } from "@/components/notifications/mock-data";

const NotificationsPage = () => {
  const [filter, setFilter] = useState<"all" | "overdue" | "invitations" | "updates">("all");
  const [notifications, setNotifications] = useState(mockNotifications);

  const markAllAsRead = () => {
    setNotifications((prev) => 
      prev.map((notification) => ({ ...notification, isRead: true }))
    );
  };

  const handleAcceptInvitation = (invitationId: string) => {
    console.log("Accept invitation:", invitationId);
    // TODO: Implement API call to accept invitation
  };

  const handleDeclineInvitation = (invitationId: string) => {
    console.log("Decline invitation:", invitationId);
    // TODO: Implement API call to decline invitation
  };

  const handleViewTask = (taskId: string) => {
    console.log("View task:", taskId);
    // TODO: Navigate to task detail
  };

  return (
    <div className="mx-auto max-w-4xl p-6">
      <NotificationsHeader
        onMarkAllRead={markAllAsRead}
        filter={filter}
        onFilterChange={(newFilter) => setFilter(newFilter as any)}
      />

      <FilterTabs
        activeFilter={filter}
        onFilterChange={setFilter}
      />

      <NotificationList
        notifications={notifications}
        filter={filter}
        onAccept={handleAcceptInvitation}
        onDecline={handleDeclineInvitation}
        onViewTask={handleViewTask}
      />
    </div>
  );
};

export default NotificationsPage;
