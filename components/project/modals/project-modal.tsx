import { cn } from "@/lib/utils";
import { useProjectModalStore } from "@/stores/project-modal.store";
import { useProjectMutations } from "@/hooks/use-project";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ProjectModalContent from "./project-modal-content";

export default function ProjectModal() {
  const mode = useProjectModalStore((s) => s.mode);
  const open = useProjectModalStore((s) => s.open);
  const setOpen = useProjectModalStore((s) => s.setOpen);
  const closeModal = useProjectModalStore((s) => s.closeModal);
  const project = useProjectModalStore((s) => s.project);

  const { createProjectMutation } = useProjectMutations();

  return (
    <Dialog
      open={open}
      onOpenChange={async (nextOpen) => {
        try {
          if (mode === "add" && open && !nextOpen) {
            const activeElement = document.activeElement as HTMLElement | null;
            activeElement?.blur();

            if (project?.name.trim() !== "") {
              await createProjectMutation.mutateAsync({
                name: project?.name.trim() || "Untitled project",
                description: project?.description || "",
                logoUrl: project?.logoUrl || "",
              });
            }
          }

          setOpen(nextOpen);

          if (!nextOpen) {
            closeModal();
          }
        } catch (error) {
          console.log("Failed to submit project data:", error);
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
          <DialogTitle>{mode === "add" ? "Add new project" : "Update project"}</DialogTitle>
          <DialogDescription>
            {mode === "add" ? "Fill in the details to create a new project." : "Update project details."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center">
          <ProjectModalContent />
        </div>
      </DialogContent>
    </Dialog>
  );
}
