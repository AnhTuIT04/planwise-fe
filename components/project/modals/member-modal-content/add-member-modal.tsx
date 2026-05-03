"use client";

import { useState } from "react";
import { Mail, Send, Users, Calendar } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { usePermission } from "@/hooks/use-permission";
import { useMemberModalStore } from "@/stores/member-modal.store";
import { useMembers } from "@/hooks/use-members-management";
import { useRolesManagement } from "@/hooks/use-roles-management";

export default function AddMemberModal() {
  const isOpen = useMemberModalStore((s) => s.open);
  const closeModal = useMemberModalStore((s) => s.closeModal);
  const mode = useMemberModalStore((s) => s.mode);
  const project = useMemberModalStore((s) => s.project);

  const { roleProject: rolePer } = usePermission(project?.id || "");
  const { inviteMember, isInvitingMember } = useMembers(project?.id || "", "", 1, 10);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const { user } = useAuth();
  const { roles } = useRolesManagement(project?.id || "");
  const handleSendInvitation = async () => {
    if (!project) return;
    console.log("invitation: ");
    await inviteMember({ projectId: project.id, payload: { email, roleId: role } });
    closeModal();
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (!project || mode !== "add") return null;

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="rounded-[5px] px-6 py-5 sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Add Team Member</DialogTitle>
        </DialogHeader>

        {/* Project Info Card */}
        <div className="rounded-lg bg-blue-50 p-4">
          <div className="flex items-start gap-4">
            {/* Project Logo */}
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg">
              {project.logoUrl ? (
                <img src={project.logoUrl} alt={project.name} className="h-full w-full rounded-lg object-contain" />
              ) : (
                <svg className="h-full w-full text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13 9V3h8v6h-8zM3 13V3h8v10H3zm10 8V11h8v10h-8zM3 21v-6h8v6H3z" />
                </svg>
              )}
            </div>

            {/* Project Details */}
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
              <p className="mt-1 text-sm text-gray-600">
                {project.description ||
                  "A comprehensive project management solution designed to streamline team collaboration and boost productivity across all departments."}
              </p>

              {/* Project Owner */}
              <div className="mt-3">
                <p className="text-xs font-medium text-gray-500">Project Owner</p>
                <div className="mt-1 flex items-center gap-2">
                  <Avatar className="size-8">
                    <AvatarImage src={project.owner.avatarUrl || undefined} />
                    <AvatarFallback className="bg-primary/10 text-primary text-sm">
                      {getInitials(project.owner.fullname)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900">{project.owner.fullname}</span>
                    <span className="text-xs text-gray-500">{project.owner.email}</span>
                  </div>
                </div>
              </div>

              {/* Project Stats */}
              <div className="mt-3 flex gap-6">
                <div className="flex items-center gap-2 rounded-lg bg-white px-3 py-2">
                  <Users className="h-4 w-4 text-blue-500" />
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500">Team Members</span>
                    <span className="text-lg font-semibold text-gray-900">{project.memberCount}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-white px-3 py-2">
                  <Calendar className="h-4 w-4 text-green-500" />
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500">Created</span>
                    <span className="text-lg font-semibold text-gray-900">
                      {format(new Date(project.createdAt), "MMM dd, yyyy")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Invite New Member Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-blue-600">
            <Mail className="h-5 w-5" />
            <h4 className="font-semibold">Invite New Member</h4>
          </div>

          {/* Email Input */}
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Enter team member's email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-10"
            />
            <p className="text-xs text-gray-500">An invitation link will be sent to this email address</p>
          </div>

          {/* Role Select */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-purple-500" />
              <label className="text-sm font-semibold">Member Role</label>
            </div>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {roles?.map((r: any) => (
                  <SelectItem key={r.id} value={r.id}>
                    {r.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Footer Buttons */}
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={closeModal}
            disabled={isInvitingMember}
            className="cursor-pointer border text-gray-600 hover:border-gray-400 hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSendInvitation}
            disabled={isInvitingMember || !email || !role}
            className="cursor-pointer bg-linear-to-r from-[#D60808] to-[#700404] transition-colors duration-500 hover:bg-linear-to-r hover:from-[#700404] hover:to-[#D60808]"
          >
            <Send className="mr-2 h-4 w-4" />
            {isInvitingMember ? "Sending..." : "Send Invitation"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
