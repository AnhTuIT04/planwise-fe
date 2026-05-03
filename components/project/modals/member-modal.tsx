import { cn } from "@/lib/utils";
import { useMemberModalStore } from "@/stores/member-modal.store";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import MemberModalContent from "./member-modal-content";
import { inviteMemberEmailProjectApi } from "@/services/apis/project/invite-member-email.api";
import { toast } from "sonner";
import { useParams } from "next/navigation";

export default function MemberModal() {
  const mode = useMemberModalStore((s) => s.mode);
  const open = useMemberModalStore((s) => s.open);
  const setOpen = useMemberModalStore((s) => s.setOpen);
  const closeModal = useMemberModalStore((s) => s.closeModal);
  const member = useMemberModalStore((s) => s.member);

  const params = useParams();
  const projectId = params?.projectId as string;

  return (
    <Dialog
      open={open}
      onOpenChange={async (nextOpen) => {
        try {
          if (mode === "add" && open && !nextOpen) {
            const activeElement = document.activeElement as HTMLElement | null;
            activeElement?.blur();

            if (member.email.trim() !== "" && projectId) {
              // Usually roles need to be fetched, default to something or send empty
              // Assuming there is a default role or it will be picked up by the backend
              // A real implementation would have a role dropdown. For now we invite directly.
              try {
                await inviteMemberEmailProjectApi(projectId, {
                  email: member.email.trim(),
                  roleId: member.roleId,
                  projectName: "Project", // Backend should preferably infer this
                  inviterName: "Inviter",
                });
                toast.success("Invitation sent successfully");
              } catch(e) {
                toast.error("Failed to send invitation");
              }
            }
          }

          setOpen(nextOpen);

          if (!nextOpen) {
            closeModal();
          }
        } catch (error) {
          console.log("Failed to submit member data:", error);
        }
      }}
    >
      <DialogContent
        className={cn(
          "w-170! max-w-full! flex-1 rounded-none! p-8! md:my-9! md:rounded-[10px]!",
          "[&>button]:top-8.25 [&>button]:right-6 [&>button]:size-7.5 [&>button]:cursor-pointer [&>button]:rounded-[5px] [&>button]:p-2",
          "[&>button]:bg-transparent [&>button]:text-[#b4b4b4] [&>button]:hover:bg-[#f7f8fa] [&>button]:hover:text-[#413f39] [&>button]:hover:opacity-80",
        )}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>{mode === "add" ? "Invite member" : "Update member"}</DialogTitle>
          <DialogDescription>
            {mode === "add" ? "Invite a new member to the project." : "Update member details."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center">
          <MemberModalContent />
        </div>
      </DialogContent>
    </Dialog>
  );
}
