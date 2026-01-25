import React from "react";
import { INotification } from "@/types/notification.type";
import InvitationSection from "./invitation-section";
import InvitationCard from "./invitation-card";
import { IInvitation } from "@/types/invitation.type";
interface InvitationListProps {
  invitations: IInvitation[];
  onAccept: (invitationId: string) => void;
  onDecline: (invitationId: string) => void;
}

const InvitationList: React.FC<InvitationListProps> = ({
  invitations,
  onAccept,
  onDecline,
}) => {

  // const projectInvitations = notifications.filter(
  //   (n) => n.type === "PROJECT_INVITATION"
  // );

  // Show all sections when filter is "all"
  return (
    <div className="space-y-6 max-h-[calc(100vh-160px)] overflow-y-auto">

      {/* Project Invitations Section */}
      <InvitationSection
        title="Project Invitations"
        icon="👥"
        invitations={invitations}
        onAccept={onAccept}
        onDecline={onDecline}
      />
    </div>
  );
};


export default InvitationList;