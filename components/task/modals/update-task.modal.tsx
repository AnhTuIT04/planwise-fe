import { cn } from "@/lib/utils";
import { useTaskModalStore } from "@/stores/task-modal.store";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import TaskModalHeader from "./modal-header";
import TaskModalContent from "./modal-content";

export default function UpdateTaskModal() {
  const mode = useTaskModalStore((s) => s.mode);
  const open = useTaskModalStore((s) => s.open);
  const setOpen = useTaskModalStore((s) => s.setOpen);
  const clear = useTaskModalStore((s) => s.clear);

  return (
    <Dialog
      open={mode === "update" && open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          clear();
        }
        setOpen(nextOpen);
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
          <DialogTitle>Update your task</DialogTitle>
          <DialogDescription>Update the details of your task and save the changes.</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center">
          <TaskModalHeader />
          <TaskModalContent />
        </div>
      </DialogContent>
    </Dialog>
  );
}
