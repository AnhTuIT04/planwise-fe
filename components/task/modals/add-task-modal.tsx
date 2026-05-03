import { cn } from "@/lib/utils";
import { useTaskModalStore } from "@/stores/task-modal.store";
import { useTaskMutations } from "@/hooks/use-task";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import TaskModalHeader from "./modal-header";
import TaskModalContent from "./modal-content";

export default function AddTaskModal() {
  const mode = useTaskModalStore((s) => s.mode);
  const open = useTaskModalStore((s) => s.open);
  const setOpen = useTaskModalStore((s) => s.setOpen);
  const clear = useTaskModalStore((s) => s.clear);

  const sectionId = useTaskModalStore((s) => s.task.sectionId);
  const title = useTaskModalStore((s) => s.task.title).trim();
  const description = useTaskModalStore((s) => s.task.description);
  const status = useTaskModalStore((s) => s.task.status);
  const priority = useTaskModalStore((s) => s.task.priority);
  const estimate = useTaskModalStore((s) => s.task.estimate);
  const deadline = useTaskModalStore((s) => s.task.deadline);
  const insertAt = useTaskModalStore((s) => s.task.position);
  const supervisor = useTaskModalStore((s) => s.task.supervisor);
  const assignees = useTaskModalStore((s) => s.task.assignees);
  const subtasks = useTaskModalStore((s) => s.task.subtasks);

  const { createTaskMutation } = useTaskMutations();

  return (
    <Dialog
      open={mode === "add" && open}
      onOpenChange={async (nextOpen) => {
        try {
          if (mode === "add" && open && !nextOpen) {
            const activeElement = document.activeElement as HTMLElement | null;
            activeElement?.blur();

            if (title !== "") {
              await createTaskMutation.mutateAsync({
                sectionId,
                title,
                description: description || undefined,
                status,
                priority,
                estimate,
                deadline: deadline || undefined,
                insertAt,
                supervisorId: supervisor?.id || undefined,
                assigneeIds: assignees.map((a) => a.id),
                subtasks: subtasks
                  .filter((subtask) => subtask.title.trim() !== "")
                  .map((subtask) => ({
                    title: subtask.title.trim(),
                    estimate: subtask.estimate,
                    assigneeIds: subtask.assignees.map((a) => a.id),
                  })),
              });
            }
          }

          setOpen(nextOpen);

          if (!nextOpen) {
            clear();
          }
        } catch (error) {
          console.log("Failed to submit task data:", error);
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
          <DialogTitle>Add new task</DialogTitle>
          <DialogDescription>Fill in the details to create a new task.</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center">
          <TaskModalHeader />
          <TaskModalContent />
        </div>
      </DialogContent>
    </Dialog>
  );
}
