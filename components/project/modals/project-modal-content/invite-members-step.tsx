"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Send } from "lucide-react";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useProjectModalStore } from "@/stores/project-modal.store";
import { useMembers } from "@/hooks/use-members-management";
import { useRolesManagement } from "@/hooks/use-roles-management";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function InviteMembersStep() {
  const router = useRouter();
  const createdProjectId = useProjectModalStore((s) => s.createdProjectId);
  const closeModal = useProjectModalStore((s) => s.closeModal);

  const { roles, isLoading: isLoadingRoles } = useRolesManagement(createdProjectId || "");
  const { inviteMember, isInvitingMember } = useMembers(createdProjectId || "", "", 1, 10);

  const [email, setEmail] = useState("");
  const [roleId, setRoleId] = useState("");
  const [invitedEmails, setInvitedEmails] = useState<string[]>([]);

  const finish = () => {
    if (createdProjectId) {
      router.push(`/projects/${createdProjectId}/overview`);
    }
    closeModal();
  };

  const sendInvite = async (): Promise<boolean> => {
    if (!createdProjectId) return false;
    if (!EMAIL_RE.test(email.trim())) {
      toast.error("Enter a valid email address");
      return false;
    }
    if (!roleId) {
      toast.error("Select a role");
      return false;
    }
    try {
      await inviteMember({ projectId: createdProjectId, payload: { email: email.trim(), roleId } });
      setInvitedEmails((prev) => [...prev, email.trim()]);
      setEmail("");
      return true;
    } catch {
      return false;
    }
  };

  const sendAndAddAnother = async () => {
    await sendInvite();
  };

  const sendAndFinish = async () => {
    const ok = await sendInvite();
    if (ok) finish();
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Invite members</DialogTitle>
        <DialogDescription>Step 4 of 4 — Invite members</DialogDescription>
      </DialogHeader>

      <div className="space-y-5 py-2">
        <p className="text-sm text-gray-600">
          Invite teammates by email. They&apos;ll receive an invitation and can accept to join the project.
        </p>

        <div className="space-y-2">
          <Label htmlFor="wizard-invite-email">Email</Label>
          <Input
            id="wizard-invite-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="teammate@example.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="wizard-invite-role">Role</Label>
          <Select value={roleId} onValueChange={setRoleId}>
            <SelectTrigger id="wizard-invite-role" className="w-full">
              <SelectValue placeholder={isLoadingRoles ? "Loading roles..." : "Select a role"} />
            </SelectTrigger>
            <SelectContent>
              {roles?.map((r) => (
                <SelectItem key={r.id} value={r.id}>
                  {r.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {invitedEmails.length > 0 && (
          <div className="rounded-md border bg-gray-50 p-3 text-sm">
            <p className="mb-1 font-medium text-gray-700">Invited:</p>
            <ul className="space-y-0.5 text-gray-600">
              {invitedEmails.map((e) => (
                <li key={e}>• {e}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <DialogFooter className="flex-col gap-2 sm:flex-row">
        <Button type="button" variant="outline" onClick={finish} disabled={isInvitingMember}>
          Skip & finish
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={sendAndAddAnother}
          disabled={isInvitingMember || !email || !roleId}
        >
          {isInvitingMember ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
          Send & invite another
        </Button>
        <Button
          type="button"
          onClick={sendAndFinish}
          disabled={isInvitingMember || !email || !roleId}
          className="bg-linear-to-r from-[#D60808] to-[#700404] transition-colors duration-500 hover:cursor-pointer hover:bg-linear-to-r hover:from-[#700404] hover:to-[#D60808]"
        >
          {isInvitingMember ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
          Send & finish
        </Button>
      </DialogFooter>
    </>
  );
}
