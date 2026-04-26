import { Plus } from "lucide-react";

import { ITaskPriority } from "@/types/task.type";
import { useTaskModalStore } from "@/stores/task-modal.store";
import { useTaskMutations } from "@/hooks/use-task";
import { useSubtaskMutations } from "@/hooks/use-subtask";
import { Button } from "@/components/ui/button";
import TaskPriority from "@/components/task/kanban/task-priority";
import SectionSelector from "./section-selector";
import DueDateSelector from "./due-date-selector";
import MoreActions from "./more-action";

export default function TaskModalHeader() {
  const mode = useTaskModalStore((s) => s.mode);
  const sectionId = useTaskModalStore((s) => s.task.sectionId);
  const taskId = useTaskModalStore((s) => s.task.id);
  const priority = useTaskModalStore((s) => s.task.priority);
  const setModalData = useTaskModalStore((s) => s.setModalData);
  const setField = useTaskModalStore((s) => s.setField);
  const addSubtask = useTaskModalStore((s) => s.addSubtask);

  const { updateTaskMutation } = useTaskMutations();
  const { createSubtaskMutation } = useSubtaskMutations();

  const handleChangeTaskPriority = async (newPriority: ITaskPriority) => {
    if (mode === "update" && newPriority !== priority) {
      try {
        const data = await updateTaskMutation.mutateAsync({
          sectionId,
          taskId,
          priority: newPriority,
        });

        setModalData(data);
      } catch (error) {
        console.log("Failed to update task priority:", error);
      }

      return;
    }

    setField("priority", newPriority);
  };

  const handleAddSubtask = async () => {
    if (mode === "update") {
      try {
        const data = await createSubtaskMutation.mutateAsync({
          sectionId,
          parentTaskId: taskId,
          title: "<p></p>",
          estimate: 20 * 60 * 1000, // default 20 mins in ms
          assigneeIds: [],
        });

        setModalData(data);
      } catch (error) {
        console.log("Failed to add subtask:", error);
      }

      return;
    }

    addSubtask();
  };

  return (
    <div className="flex w-full items-center justify-between select-none">
      {/* Select sections */}
      <SectionSelector />

      {/* Actions buttons */}
      <div className="mr-8 flex items-center justify-end space-x-4">
        <TaskPriority
          priority={priority}
          onChangePriority={handleChangeTaskPriority}
          className="px-2 py-2 text-[#413f39]"
        />

        <DueDateSelector />

        <Button
          onClick={handleAddSubtask}
          variant="ghost"
          className="-ml-2 cursor-pointer rounded-[5px] px-2 py-1.5 text-[12px] text-[#b4b4b4] hover:bg-[#f7f8fa] hover:text-[#413f39] hover:opacity-80 active:translate-y-0!"
          tabIndex={-1}
        >
          <Plus className="size-3.5" />
          <span className="-ml-1">Subtasks</span>
        </Button>

        {mode === "update" && <MoreActions />}
      </div>
    </div>
  );
}
