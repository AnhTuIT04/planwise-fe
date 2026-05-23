import Link from "next/link";
import { type MouseEvent } from "react";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { GripVertical } from "lucide-react";
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
      draggable
      onDragStart={(e) => {
        const payload = {
          id: task.id,
          title: task.title,
          description: task.description || "",
        };
        e.dataTransfer.setData("application/x-planwise-task", JSON.stringify(payload));
        e.dataTransfer.effectAllowed = "copy";
      }}
      className={cn(
        "dnd-item group mr-0.5 cursor-pointer rounded border bg-white p-3 shadow-[0_1px_1px_#0000001a] transition-shadow hover:border-[#dcdcdc] hover:shadow-[0_3px_6px_#0000001a]",
        isDragging && "will-change-transform opacity-50",
      )}
      onClick={handleOpenModal}
    >
      <div className="mb-1 flex items-start justify-between">
        <div className="flex items-center gap-1">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab text-gray-400 hover:text-gray-600"
          >
            <GripVertical className="size-4" />
          </div>
          <TaskPriority
            priority={task.priority}
            onChangePriority={async (priority) => handleChangeField("priority", priority)}
          />
        </div>

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

        {/* Notion icon if imported from Notion */}
        {task.notionPageId && (
          <TooltipProvider delayDuration={500}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  data-stop-task-open="true"
                  className="flex h-5 w-5 cursor-pointer items-center justify-center rounded border border-gray-100 bg-gray-50 p-0.5 shadow-sm transition-opacity hover:opacity-80"
                  onClick={(e) => {
                    e.stopPropagation();
                    const url = `https://www.notion.so/${task.notionPageId!.replace(/-/g, "")}`;
                    window.open(url, "_blank");
                  }}
                >
                  <img src="/notion-logo.svg" alt="Notion" className="size-3.5" />
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">Mở trong Notion</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        {/* Gmail icon if imported from Gmail */}
        {task.gmailMessageId && (
          <TooltipProvider delayDuration={500}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  data-stop-task-open="true"
                  className="flex h-5 w-5 cursor-pointer items-center justify-center rounded border border-gray-100 bg-gray-50 p-0.5 shadow-sm transition-opacity hover:opacity-80"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="52 42 88 66" className="size-3.5">
                    <path fill="#4285f4" d="M58 108h14V74L52 59v43c0 3.32 2.69 6 6 6" />
                    <path fill="#34a853" d="M120 108h14c3.32 0 6-2.69 6-6V59l-20 15" />
                    <path fill="#fbbc04" d="M120 48v26l20-15v-8c0-7.42-8.47-11.65-14.4-7.2" />
                    <path fill="#ea4335" d="M72 74V48l24 18 24-18v26L96 92" />
                    <path fill="#c5221f" d="M52 51v8l20 15V48l-5.6-4.2c-5.94-4.45-14.4-.22-14.4 7.2" />
                  </svg>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">Imported from Gmail</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        {/* Calendar icon if imported from Calendar */}
        {task.calendarEventId && (
          <TooltipProvider delayDuration={500}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  data-stop-task-open="true"
                  className="flex h-5 w-5 cursor-pointer items-center justify-center rounded border border-gray-100 bg-gray-50 p-0.5 shadow-sm transition-opacity hover:opacity-80"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="size-3.5">
                    <rect width="18" height="18" x="3" y="4" fill="#fff" rx="2" ry="2" />
                    <path fill="#4285F4" d="M21 9h-3V6h3v3zm-4 0h-4V6h4v3zm-5 0H8V6h4v3zM7 9H3V6h4v3zm14 4h-3v-3h3v3zm-4 0h-4v-3h4v3zm-5 0H8v-3h4v3zM7 13H3v-3h4v3zm14 4h-3v-3h3v3zm-4 0h-4v-3h4v3zm-5 0H8v-3h4v3zM7 17H3v-3h4v3zm14 4h-3v-3h3v3zm-4 0h-4v-3h4v3zm-5 0H8v-3h4v3zM7 21H3v-3h4v3z" />
                    <path fill="#4285F4" d="M18 2h-2v3h-8V2H6v3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2h-3V2zM21 21H3V9h18v12z" />
                  </svg>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">Imported from Google Calendar</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </div>
  );
}
