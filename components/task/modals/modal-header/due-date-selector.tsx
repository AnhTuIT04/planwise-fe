import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";

import { useTaskMutations } from "@/hooks/use-task";
import { useTaskModalStore } from "@/stores/task-modal.store";
import { Popover, PopoverArrow, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

export default function DueDateSelector() {
  const mode = useTaskModalStore((s) => s.mode);
  const projectId = useTaskModalStore((s) => s.task.projectId);
  const sectionId = useTaskModalStore((s) => s.task.sectionId);
  const taskId = useTaskModalStore((s) => s.task.id);
  const deadline = useTaskModalStore((s) => s.task.deadline);
  const setModalData = useTaskModalStore((s) => s.setModalData);
  const setField = useTaskModalStore((s) => s.setField);

  const { updateTaskMutation } = useTaskMutations();

  const [open, setOpen] = useState(false);
  const dueDate = deadline ? new Date(deadline) : undefined;

  const handleUpdateDueDate = async (newDeadline: string | null) => {
    try {
      if (newDeadline !== deadline) {
        return await updateTaskMutation.mutateAsync({
          projectId,
          sectionId,
          taskId,
          deadline: newDeadline,
        });
      }
    } catch (error) {
      console.log("Failed to update task deadline:", error);
    }
  };

  const handleClearDueDate = async () => {
    if (mode === "update" && deadline) {
      const data = await handleUpdateDueDate(null);

      if (data) setModalData(data);
      setOpen(false);
      return;
    }

    setField("deadline", null);
    setOpen(false);
  };

  const handleSelectDate = async (date: Date) => {
    const selected = new Date(date);
    selected.setHours(0, 0, 0, 0);
    const selectedISOString = selected.toISOString();

    if (mode === "update") {
      const data = await handleUpdateDueDate(selectedISOString);

      if (data) setModalData(data);
      setOpen(false);
      return;
    }

    setField("deadline", selectedISOString);
    setOpen(false);
  };

  return (
    <div className="relative">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <span className="flex min-w-0 cursor-pointer items-center rounded-[5px] px-2 py-1.5 text-[12px] text-[#b4b4b4] hover:bg-[#f7f8fa] hover:text-[#413f39] hover:opacity-80">
            <CalendarIcon className="mr-1 size-4" />{" "}
            <span className="block truncate whitespace-nowrap">{dueDate ? format(dueDate, "MMM dd") : "Date"}</span>
          </span>
        </PopoverTrigger>
        <PopoverContent className="relative w-auto rounded-[5px] px-0! py-2! shadow-[0_6px_12px_#0003]!" align="center">
          <PopoverArrow stroke="2" />
          {dueDate && (
            <button
              onClick={handleClearDueDate}
              className="mb-2 cursor-pointer px-4 text-xs font-normal text-[#787878]"
            >
              Clear due date
            </button>
          )}

          <Calendar
            mode="single"
            selected={dueDate}
            onSelect={(date) => {
              if (!date) return;
              handleSelectDate(date);
            }}
            disabled={{ before: new Date() }}
            className="py-0"
          />
        </PopoverContent>
      </Popover>

      <span className="absolute -top-2 left-2.25 text-[8px] text-[#413f39]">DUE DAY</span>
    </div>
  );
}
