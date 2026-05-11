"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMemberModalStore } from "@/stores/member-modal.store";
interface MembersHeaderProps {
  membersCount: number;
  onAddMember: () => void;
}

export default function MembersHeader({ membersCount, onAddMember }: MembersHeaderProps) {
  return (
    <div className="bg-card border-b px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Team Members</h1>
          <p className="text-muted-foreground text-sm">{membersCount} members in this project</p>
        </div>
        <Button 
          className="gap-2 bg-linear-to-r from-[#D60808] to-[#700404] transition-colors duration-500 hover:bg-linear-to-r hover:from-[#700404] hover:to-[#D60808]" 
          onClick={onAddMember}
        >
          <Plus className="size-4" />
          Add Member
        </Button>
      </div>
    </div>
  );
}