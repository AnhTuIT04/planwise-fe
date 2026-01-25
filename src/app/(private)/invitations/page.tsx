"use client";

import React, { useState } from "react";
import InvitetationsHeader from "@/components/invitations/invitation-header";
import { InvitationList } from "@/components/invitations";
import { mockNotifications } from "@/components/notifications/mock-data";
import { useAuth } from "@/components/providers/auth-provider";
const InvitationsPage = () => {
  // const [notifications, setNotifications] = useState(mockNotifications);

  const { user, invitation, logout } = useAuth();
  const handleAcceptInvitation = (invitationId: string) => {
    console.log("Accept invitation:", invitationId);
  };

  const handleDeclineInvitation = (invitationId: string) => {
    console.log("Decline invitation:", invitationId);
  };


  return (
    <div className="mx-auto max-w-4xl p-6">
      <InvitetationsHeader />
      <InvitationList
        invitations={invitation}
        onAccept={handleAcceptInvitation}
        onDecline={handleDeclineInvitation}
      />
    </div>
  );
};

export default InvitationsPage;
