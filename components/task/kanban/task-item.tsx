import Link from "next/link";
import { type MouseEvent } from "react";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";

import { cn } from "@/lib/utils";
import { ITask, ITaskStatus } from "@/types/task.type";
import { useTaskModalStore } from "@/stores/task-modal.store";
import { useTaskMutations } from "@/hooks/use-task";
import { useSubtaskMutations } from "@/hooks/use-subtask";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import TaskPriority from "./task-priority";
import TaskEstimateTime from "./task-estimate-time";
import TaskStatusIcon from "./task-status-icon";

interface TaskItemProps {
  position: number;
  task: ITask;
  projectId: string;
  sectionId: string;
  isPersonal: boolean;
}

export default function TaskItem({ position, task, projectId, sectionId, isPersonal }: TaskItemProps) {
  const { updateTaskMutation, updateTaskStatusMutation } = useTaskMutations();
  const { updateSubtaskStatusMutation } = useSubtaskMutations();
  const { openModal: openUpdateTaskModal } = useTaskModalStore();

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: {
      type: "task",
      data: {
        ...task,
        position,
        sectionId,
      },
    },
  });

  const handleChangeField = async (field: string, value: any) => {
    try {
      await updateTaskMutation.mutateAsync({
        taskId: task.id,
        sectionId,
        [field]: value,
      });
    } catch (error) {
      console.log(`Failed to change task ${field}:`, error);
    }
  };

  const handleChangeStatus = async (newStatus: ITaskStatus) => {
    try {
      await updateTaskStatusMutation.mutateAsync({
        taskId: task.id,
        sectionId,
        status: newStatus,
      });
    } catch (error) {
      console.log("Failed to change task status:", error);
    }
  };

  const handleChangeSubtaskStatus = async (subtaskId: string, newStatus: ITaskStatus) => {
    try {
      await updateSubtaskStatusMutation.mutateAsync({
        sectionId,
        parentTaskId: task.id,
        subtaskId,
        status: newStatus,
      });
    } catch (error) {
      console.log("Failed to change subtask status:", error);
    }
  };

  const handleOpenModal = (event: MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (target.closest('[data-stop-task-open="true"]')) {
      return;
    }

    openUpdateTaskModal({
      mode: "update",
      projectId,
      sectionId,
      ...task,
    });
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Translate.toString(transform),
        transition,
      }}
      {...attributes}
      {...listeners}
      className={cn(
        "dnd-item mr-0.5 cursor-pointer rounded border bg-white p-3 shadow-[0_1px_1px_#0000001a] transition-shadow hover:border-[#dcdcdc] hover:shadow-[0_3px_6px_#0000001a]",
        isDragging && "will-change-transform",
      )}
      onClick={handleOpenModal}
    >
      <div className="mb-1 flex items-start justify-between">
        <TaskPriority
          priority={task.priority}
          onChangePriority={async (priority) => handleChangeField("priority", priority)}
        />

        <TaskEstimateTime
          estimate={task.estimate}
          spent={task.spent ? task.spent : undefined}
          lastStarted={task.lastStarted ? task.lastStarted : undefined}
          status={task.status}
          onChangeEstimateTime={async (estimate) => handleChangeField("estimate", estimate)}
          changeable={task.subtasks.length === 0}
        />
      </div>

      <span
        dangerouslySetInnerHTML={{ __html: task.title }}
        className="text-[14px] font-normal wrap-anywhere whitespace-pre-wrap text-[#413f39]"
      />

      {task.subtasks.length > 0 && (
        <div className="my-2 space-y-1">
          {task.subtasks.map((subtask) => {
            if (subtask.title === "" || subtask.title === "<p></p>") return null;

            return (
              <div key={subtask.id} className="flex items-center gap-2 text-[14px] font-normal text-[#413f39]">
                <div className="mt-0.5 self-start">
                  <TaskStatusIcon
                    status={subtask.status}
                    onChangeStatus={(newStatus) => handleChangeSubtaskStatus(subtask.id, newStatus)}
                  />
                </div>
                <span
                  dangerouslySetInnerHTML={{ __html: subtask.title }}
                  className="wrap-anywhere whitespace-pre-wrap"
                />
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-2 flex items-center gap-4">
        <TaskStatusIcon
          status={task.status}
          className="translate-x-px scale-110 transform"
          onChangeStatus={handleChangeStatus}
        />

        {/* Show originalProject if exists */}
        {task.originalProject && task.originalProject.id !== projectId && (
          <TooltipProvider delayDuration={500}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href={`/projects/${task.originalProject.id}`} onClick={(e) => e.stopPropagation()}>
                  <Avatar className="size-4 scale-110">
                    <AvatarImage src={task.originalProject.logoUrl || undefined} alt={task.originalProject.name} />
                    <AvatarFallback className="bg-blue-100 text-[8px] font-semibold text-blue-600">
                      {task.originalProject.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="bottom">{task.originalProject.name}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </div>
  );
}
