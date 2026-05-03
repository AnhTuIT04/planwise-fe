"use client";

import { useState } from "react";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import useModal from "@/hooks/use-modal";
import { useMembers } from "@/hooks/use-members-management";
import { useMemberModalStore } from "@/stores/member-modal.store";

export default function EditMemberModal() {
  const isOpen = useMemberModalStore((s) => s.open);
  const closeModal = useMemberModalStore((s) => s.closeModal);
  const mode = useMemberModalStore((s) => s.mode);
  const member = useMemberModalStore((s) => s.member);
  const roles = useMemberModalStore((s) => s.roles);
  const projectId = useMemberModalStore((s) => s.projectId);

  const [selectedRoleId, setSelectedRoleId] = useState(member?.role?.id || "");
  
  const { updateMemberRole, isUpdatingMemberRole } = useMembers(projectId || "", "", 1, 10);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSave = async () => {
    if (selectedRoleId && selectedRoleId !== member?.role?.id && member) {
      await updateMemberRole({ memberId: member.id, roleId: selectedRoleId });
      closeModal();
    } else {
      closeModal();
    }
  };

  if (!member || !roles || mode !== "update") return null;

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="rounded-[5px] px-6 py-5 sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Edit Member Role</DialogTitle>
        </DialogHeader>

        {/* Member Info */}
        <div className="rounded-lg bg-gray-50 p-4">
          <div className="flex items-center gap-4">
            <Avatar className="size-14">
              <AvatarImage src={member.avatarUrl || undefined} />
              <AvatarFallback className="bg-primary/10 text-primary text-lg">
                {getInitials(member.fullname)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">{member.fullname}</h3>
              <p className="text-sm text-gray-600">{member.email}</p>
            </div>
          </div>
        </div>

        {/* Role Selection */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-blue-600">
            <Users className="h-5 w-5" />
            <h4 className="font-semibold">Change Role</h4>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Select Role</label>
            <Select value={selectedRoleId} onValueChange={setSelectedRoleId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.id} value={role.id}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={closeModal}
            disabled={isUpdatingMemberRole}
            className="cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={isUpdatingMemberRole || !selectedRoleId}
            className="cursor-pointer bg-linear-to-r from-[#D60808] to-[#700404] transition-colors duration-500 hover:bg-linear-to-r hover:from-[#700404] hover:to-[#D60808]"
          >
            {isUpdatingMemberRole ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
