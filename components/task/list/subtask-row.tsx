"use client";

import { ISubtask, ITaskStatus } from "@/types/task.type";
import { useSubtaskMutations } from "@/hooks/use-subtask";
import TaskStatusIcon from "@/components/task/kanban/task-status-icon";
import TaskEstimateTime from "@/components/task/kanban/task-estimate-time";
import TaskAssignees from "./task-assignees";

interface SubtaskRowProps {
  subtask: ISubtask;
  parentTaskId: string;
  sectionId: string;
}

export default function SubtaskRow({ subtask, parentTaskId, sectionId }: SubtaskRowProps) {
  const { updateSubtaskStatusMutation, updateSubtaskMutation } = useSubtaskMutations();

  if (subtask.title === "" || subtask.title === "<p></p>") return null;

  const handleChangeStatus = async (newStatus: ITaskStatus) => {
    try {
      await updateSubtaskStatusMutation.mutateAsync({
        sectionId,
        parentTaskId,
        subtaskId: subtask.id,
        status: newStatus,
      });
    } catch (error) {
      console.log("Failed to change subtask status:", error);
    }
  };

  const handleChangeEstimate = async (newEstimate: number) => {
    try {
      await updateSubtaskMutation.mutateAsync({
        sectionId,
        parentTaskId,
        subtaskId: subtask.id,
        estimate: newEstimate,
      });
    } catch (error) {
      console.log("Failed to change subtask estimate:", error);
    }
  };

  return (
    <div className="grid grid-cols-[24px_1fr_88px_104px_120px_96px_24px] items-center gap-3 py-1.5 pr-3 pl-12 text-[13px] text-[#413f39] hover:bg-[#fafafa]">
      <div className="flex items-center justify-center">
        <TaskStatusIcon status={subtask.status} onChangeStatus={handleChangeStatus} />
      </div>

      <span
        dangerouslySetInnerHTML={{ __html: subtask.title }}
        className="truncate text-[#787878] wrap-anywhere whitespace-pre-wrap"
      />

      <span />

      <div className="flex justify-start">
        <TaskEstimateTime
          estimate={subtask.estimate}
          spent={subtask.spent ? subtask.spent : undefined}
          lastStarted={subtask.lastStarted ? subtask.lastStarted : undefined}
          status={subtask.status}
          onChangeEstimateTime={handleChangeEstimate}
          changeable
        />
      </div>

      <span />

      <TaskAssignees assignees={subtask.assignees} />

      <span />
    </div>
  );
}
