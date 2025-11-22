import React from "react";
import { Users } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Member } from "@/types/role.type";

interface RoleMembersProps {
  members: Member[];
  maxVisible?: number;
}

export default function RoleMembers({ members, maxVisible = 4 }: RoleMembersProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="border-t pt-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Members:</span>
        </div>
        <span className="text-sm text-gray-500">{members.length} members</span>
      </div>

      {members.length > 0 ? (
        <div className="flex -space-x-2">
          {members.slice(0, maxVisible).map((member) => (
            <Avatar key={member.id} className="h-8 w-8 border-2 border-white">
              <AvatarImage src={member.avatarUrl} alt={member.name} />
              <AvatarFallback className="bg-blue-100 text-xs text-blue-600">{getInitials(member.name)}</AvatarFallback>
            </Avatar>
          ))}
          {members.length > maxVisible && (
            <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gray-100">
              <span className="text-xs text-gray-600">+{members.length - maxVisible}</span>
            </div>
          )}
        </div>
      ) : (
        <p className="text-sm text-gray-500 italic">No members assigned</p>
      )}
    </div>
  );
}
