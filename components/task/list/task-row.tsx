"use client";

import Link from "next/link";
import { type MouseEvent, useState } from "react";
import { ChevronRight } from "lucide-react";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";

import { cn } from "@/lib/utils";
import { ITask, ITaskStatus } from "@/types/task.type";
import { useTaskModalStore } from "@/stores/task-modal.store";
import { useTaskMutations } from "@/hooks/use-task";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import TaskPriority from "@/components/task/kanban/task-priority";
import TaskStatusIcon from "@/components/task/kanban/task-status-icon";
import TaskEstimateTime from "@/components/task/kanban/task-estimate-time";
import TaskDeadline from "./task-deadline";
import TaskAssignees from "./task-assignees";
import SubtaskRow from "./subtask-row";

interface TaskRowProps {
  position: number;
  task: ITask;
  projectId: string;
  sectionId: string;
  isPersonal: boolean;
}

export default function TaskRow({ position, task, projectId, sectionId, isPersonal }: TaskRowProps) {
  const [expanded, setExpanded] = useState(false);

  const { updateTaskMutation, updateTaskStatusMutation } = useTaskMutations();
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

  const handleToggleExpand = (event: MouseEvent) => {
    event.stopPropagation();
    if (isDragging) return;
    setExpanded((prev) => !prev);
  };

  const hasSubtasks = task.subtasks.length > 0;
  const showCrossProject =
    isPersonal && task.originalProject && task.originalProject.id !== projectId;

  return (
    <div className="dnd-item">
      <div
        ref={setNodeRef}
        style={{
          transform: CSS.Translate.toString(transform),
          transition,
        }}
        {...attributes}
        {...listeners}
        onClick={handleOpenModal}
        className={cn(
          "grid cursor-pointer grid-cols-[24px_1fr_88px_104px_120px_96px_24px] items-center gap-3 border-b border-[#f0f0f0] bg-white py-2 pr-3 pl-3 text-[14px] text-[#413f39] transition-colors hover:bg-[#fafafa]",
          isDragging && "will-change-transform opacity-60",
        )}
      >
        <div className="flex items-center justify-center">
          <TaskStatusIcon status={task.status} onChangeStatus={handleChangeStatus} />
        </div>

        <div className="flex min-w-0 items-center gap-1">
          {hasSubtasks ? (
            <button
              type="button"
              data-stop-task-open="true"
              onPointerDown={(event) => event.stopPropagation()}
              onClick={handleToggleExpand}
              aria-label={expanded ? "Collapse subtasks" : "Expand subtasks"}
              aria-expanded={expanded}
              className="flex h-4 w-4 cursor-pointer items-center justify-center rounded text-[#787878] hover:bg-[#f0f0f0] hover:text-[#413f39]"
            >
              <ChevronRight
                className={cn("h-3 w-3 transition-transform", expanded && "rotate-90")}
              />
            </button>
          ) : (
            <span className="w-4" />
          )}

          <span
            dangerouslySetInnerHTML={{ __html: task.title }}
            className="truncate font-normal wrap-anywhere whitespace-pre-wrap"
          />

          {hasSubtasks && (
            <span className="ml-1 shrink-0 text-[11px] text-[#b4b4b4]">
              {task.subtasks.filter((st) => st.status === "DONE").length}/{task.subtasks.length}
            </span>
          )}
        </div>

        <div className="flex justify-start">
          <TaskPriority
            priority={task.priority}
            onChangePriority={async (priority) => handleChangeField("priority", priority)}
          />
        </div>

        <div className="flex justify-start">
          <TaskEstimateTime
            className="py-1.5"
            estimate={task.estimate}
            spent={task.spent ? task.spent : undefined}
            lastStarted={task.lastStarted ? task.lastStarted : undefined}
            status={task.status}
            onChangeEstimateTime={async (estimate) => handleChangeField("estimate", estimate)}
            changeable={task.subtasks.length === 0}
          />
        </div>

        <TaskDeadline deadline={task.deadline} />

        <TaskAssignees assignees={task.assignees} />

        <div className="flex items-center justify-center">
          {showCrossProject && task.originalProject && (
            <TooltipProvider delayDuration={500}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    data-stop-task-open="true"
                    href={`/projects/${task.originalProject.id}`}
                    onClick={(event) => event.stopPropagation()}
                    onPointerDown={(event) => event.stopPropagation()}
                  >
                    <Avatar className="size-4">
                      <AvatarImage
                        src={task.originalProject.logoUrl || undefined}
                        alt={task.originalProject.name}
                      />
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

      {expanded && hasSubtasks && (
        <div className="bg-[#fdfdfd]">
          {task.subtasks.map((subtask) => (
            <SubtaskRow
              key={subtask.id}
              subtask={subtask}
              parentTaskId={task.id}
              sectionId={sectionId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
