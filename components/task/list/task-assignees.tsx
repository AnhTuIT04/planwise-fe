"use client";

import { IBasicUser } from "@/types/user.type";
import { Avatar, AvatarFallback, AvatarGroup, AvatarImage } from "@/components/ui/avatar";

interface TaskAssigneesProps {
  assignees: IBasicUser[];
  max?: number;
}

function getInitial(user: IBasicUser) {
  const source = user.fullname || user.email || "";
  return source.charAt(0).toUpperCase() || "?";
}

export default function TaskAssignees({ assignees, max = 3 }: TaskAssigneesProps) {
  if (assignees.length === 0) {
    return <span className="text-[12px] text-[#b4b4b4]">—</span>;
  }

  const visible = assignees.slice(0, max);
  const overflow = assignees.length - visible.length;

  return (
    <AvatarGroup>
      {visible.map((user) => (
        <Avatar key={user.id} size="sm" title={user.fullname || user.email}>
          <AvatarImage src={user.avatarUrl || undefined} alt={user.fullname || user.email} />
          <AvatarFallback className="bg-blue-100 text-[10px] font-semibold text-blue-700">
            {getInitial(user)}
          </AvatarFallback>
        </Avatar>
      ))}
      {overflow > 0 && (
        <div
          data-slot="avatar"
          className="relative flex size-6 shrink-0 items-center justify-center rounded-full bg-[#f0f0f0] text-[10px] font-semibold text-[#787878] ring-2 ring-background"
        >
          +{overflow}
        </div>
      )}
    </AvatarGroup>
  );
}
