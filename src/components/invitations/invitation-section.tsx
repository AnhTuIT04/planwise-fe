import React from "react";
import { IInvitation } from "@/types/invitation.type";
import InvitationCard from "./invitation-card";

interface InvitationSectionProps {
  title: string;
  icon: string;
  invitations: IInvitation[];
  onAccept: (invitationId: string) => void;
  onDecline: (invitationId: string) => void;
  className?: string;
}

const InvitationSection: React.FC<InvitationSectionProps> = ({
  title,
  icon,
  invitations,
  onAccept,
  onDecline,
  className = "mb-8",
}) => {
  if (invitations.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      <div className="mb-4 flex items-center gap-2">
        <span className={getIconColor(icon)}>{icon}</span>
        <h2 className="text-foreground text-lg font-medium">{title}</h2>
      </div>
      <div className="space-y-3">
        {invitations.map((invitation) => (
          <InvitationCard
            key={`${invitation.inviteeId}-${invitation.inviterId}`}
            invitation={invitation}
            onAccept={onAccept}
            onDecline={onDecline}
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

export default InvitationSection;