import { cn } from "@/lib/utils";
import { useMemberModalStore } from "@/stores/member-modal.store";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import MemberModalContent from "./member-modal-content";
import { inviteMemberProjectApi } from "@/services/apis/project/invite-member-project.api";
import { toast } from "react-toastify";
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
              const [, err] = await inviteMemberProjectApi(projectId, {
                email: member.email.trim(),
                roleId: member.roleId,
              });
              if (err) {
                toast.error(err.message || "Failed to send invitation");
              } else {
                toast.success("Invitation sent successfully");
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
