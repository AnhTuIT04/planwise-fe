import { useState } from "react";
import { MoreHorizontal } from "lucide-react";

import { useTaskModalStore } from "@/stores/task-modal.store";
import { useTaskMutations } from "@/hooks/use-task";
import { Popover, PopoverArrow, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useProject } from "@/hooks/use-project";
import { useSection } from "@/hooks/use-section";
import { toast } from "react-toastify";
import { useImportTaskModalStore } from "@/stores/import-task-modal.store";

export default function MoreActions() {
  const projectId = useTaskModalStore((s) => s.task.projectId);
  const sectionId = useTaskModalStore((s) => s.task.sectionId);
  const taskId = useTaskModalStore((s) => s.task.id);
  const status = useTaskModalStore((s) => s.task.status);
  const canImport = useTaskModalStore((s) => s.task.canImport);
  const isImported = useTaskModalStore((s) => s.task.isImported);
  const setModalData = useTaskModalStore((s) => s.setModalData);
  const setOpenModal = useTaskModalStore((s) => s.setOpen);

  const [open, setOpen] = useState(false);

  const { deleteTaskMutation, updateTaskStatusMutation, importTaskMutation } = useTaskMutations();
  const openImportModal = useImportTaskModalStore((s) => s.openModal);

  const handleDeleteTask = async () => {
    try {
      await deleteTaskMutation.mutateAsync({
        projectId: projectId,
        sectionId: sectionId,
        taskId,
      });
    } catch (error) {
      console.log("Failed to delete task:", error);
    }

    setOpen(false);
    setOpenModal(false);
  };

  const handleUpdateTaskStatus = async (status: "ARCHIVED" | "TODO") => {
    try {
      const data = await updateTaskStatusMutation.mutateAsync({
        sectionId: sectionId,
        taskId,
        status,
      });

      setModalData(data);
    } catch (error) {
      console.log("Failed to update task status:", error);
    }

    setOpen(false);
  };

  const handleImportTask = () => {
    openImportModal(taskId, projectId);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="cursor-pointer rounded-[5px] px-2 py-1.5 text-[12px] text-[#b4b4b4] hover:bg-[#f7f8fa] hover:text-[#413f39] hover:opacity-80 active:translate-y-0!"
        >
          <MoreHorizontal className="size-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="relative w-32 rounded-[5px] px-0! py-2.5! shadow-[0_6px_12px_#0003]!" align="end">
        <PopoverArrow stroke="2" />

        <div className="mb-2 px-4 text-xs font-normal text-[#787878]">Other actions</div>

        <ActionButton label="Delete" onClick={() => handleDeleteTask()} />
        {(status === "TODO" || status === "DONE") && (
          <ActionButton label="Archive" onClick={() => handleUpdateTaskStatus("ARCHIVED")} />
        )}
        {canImport && !isImported && <ActionButton label="Import task" onClick={handleImportTask} />}
        {status === "ARCHIVED" && <ActionButton label="Restore" onClick={() => handleUpdateTaskStatus("TODO")} />}
      </PopoverContent>
    </Popover>
  );
}

const ActionButton = ({ label, onClick }: { label: string; onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex w-full cursor-pointer items-center justify-between px-4 py-1.5 text-left text-xs transition-colors hover:bg-gray-100 focus:ring-0 focus:outline-none disabled:opacity-50"
  >
    <span className="inline-flex max-w-27 items-center truncate text-[12px]">{label}</span>
  </button>
);
