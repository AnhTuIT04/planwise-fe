import { useState } from "react";
import { AlertTriangle, Loader2, Pause } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import { ITask } from "@/types/task.type";
import TaskPriority from "./task-priority";
import TaskEstimateTime from "./task-estimate-time";
import { useTask } from "@/hooks/useTask";

interface TaskItemProps {
  task: ITask;
  sectionId: string;
  isPersonal?: boolean;
  onClick: (task: ITask) => void;
}

export default function TaskItem({ task, sectionId, isPersonal = false, onClick }: TaskItemProps) {
  const { updateTaskStatus, isUpdatingTask } = useTask({ taskId: task.id });
  const [taskEditing, setTaskEditing] = useState(false);
  const [isPausing, setIsPausing] = useState(false);

  // Check if task is overdue or overspent
  const isOverdue = task.deadline && new Date(task.deadline) < new Date() && task.status !== "DONE";
  const isOverspent = task.estimate > 0 && task.spent > task.estimate ; // estimate in minutes, timeSpent in seconds
  const hasWarning = isOverdue || isOverspent;

  const handleToggleTaskStatus = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setTaskEditing(true);
    await updateTaskStatus({
      id: task.id,
      payload: {
        status: task.status === "DONE" ? "TODO" : "DONE",
        sectionId: sectionId,
      },
    });
    setTaskEditing(false);
  };

  const handlePauseTask = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPausing(true);
    await updateTaskStatus({
      id: task.id,
      payload: {
        status: "TODO",
        sectionId: sectionId,
      },
    });
    setIsPausing(false);
  };

  return (
    <div
      className={`cursor-pointer rounded border bg-white p-3 shadow-[0_1px_1px_#0000001a] transition-shadow hover:border-[#dcdcdc] hover:shadow-[0_3px_6px_#0000001a] ${
        hasWarning ? "border-l-4 border-l-red-500 bg-red-50" : ""
      }`}
      draggable
      onClick={() => onClick(task)}
    >
      <div className="mb-1 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <TaskPriority taskId={task.id} priority={task.priority} />
          {hasWarning && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                </TooltipTrigger>
                <TooltipContent>
                  {isOverdue && <p>Task quá hạn deadline</p>}
                  {isOverspent && <p>Thời gian đã dùng vượt quá estimate</p>}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <TaskEstimateTime taskId={task.id} estimate={task.estimate} spent={task.spent} />
      </div>

      <span className="text-[14px] font-normal text-[#413f39]">{task.title}</span>

      {task.subtasks?.length > 0 && (
        <div className="my-2 ml-px space-y-1">
          {task.subtasks.map((st) => (
            <SubTask key={st.id} subTask={st} sectionId={sectionId} />
          ))}
        </div>
      )}

      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {taskEditing ? (
            <Loader2 className="h-4.5 w-4.5 animate-spin text-[#2ca7ff]" />
          ) : (
            <button
              onClick={handleToggleTaskStatus}
              className={`group flex h-4.5 w-4.5 items-center justify-center rounded-full border-2 transition-colors ${
                task.status === "DONE"
                  ? "border-green-500 bg-green-500"
                  : "border-[#b9b9b9] bg-white hover:border-green-500"
              }`}
            >
              <svg
                className={`h-3.5 w-3.5 ${task.status === "DONE" ? "text-white" : "text-[#b9b9b9] group-hover:text-green-500"}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </button>
          )}
          
          {/* Show original project logo for personal tasks */}
          {isPersonal && task.originalProject && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center">
                    {task.originalProject.logoUrl ? (
                      <img
                        src={task.originalProject.logoUrl}
                        alt={task.originalProject.name}
                        className="h-5 w-5 rounded object-cover"
                      />
                    ) : (
                      <div className="flex h-5 w-5 items-center justify-center rounded bg-blue-100 text-[10px] font-semibold text-blue-600">
                        {task.originalProject.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Từ project: {task.originalProject.name}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          {/* Pause button for running tasks */}
          {task.status === "RUNNING" && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={handlePauseTask}
                    disabled={isPausing}
                    className="flex h-4.5 w-4.5 items-center justify-center rounded-full border-2 border-orange-400 bg-orange-100 transition-colors hover:bg-orange-200"
                  >
                    {isPausing ? (
                      <Loader2 className="h-3 w-3 animate-spin text-orange-500" />
                    ) : (
                      <Pause className="h-3 w-3 text-orange-500" />
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Tạm dừng task</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          
        </div>
      </div>
    </div>
  );
}

interface SubTaskProps {
  subTask: ITask;
  sectionId: string;
}

function SubTask({ subTask, sectionId }: SubTaskProps) {
  const { updateTaskStatus } = useTask({ taskId: subTask.id });
  const [subTaskEditing, setSubTaskEditing] = useState(false);

  const handleToggleSubTaskStatus = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setSubTaskEditing(true);
    await updateTaskStatus({
      id: subTask.id,
      payload: {
        status: subTask.status === "DONE" ? "TODO" : "DONE",
        sectionId: sectionId,
      },
    });
    setSubTaskEditing(false);
  };

  return (
    <button className="flex items-center gap-2 text-xs" onClick={(e) => e.stopPropagation()}>
      {subTaskEditing ? (
        <Loader2 className="h-4 w-4 animate-spin text-[#2ca7ff]" />
      ) : (
        <div
          className={`group flex h-4 w-4 cursor-pointer items-center justify-center rounded-full border-2 transition-all ${
            subTask.status === "DONE"
              ? "border-green-500 bg-green-500"
              : "border-[#b9b9b9] bg-white hover:border-green-500"
          }`}
          onClick={handleToggleSubTaskStatus}
        >
          <svg
            className={`h-2.5 w-2.5 ${subTask.status === "DONE" ? "text-white" : "text-[#b9b9b9] group-hover:text-green-500"}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
      <span className={subTask.status === "DONE" ? "line-through text-gray-400" : ""}>{subTask.title}</span>
    </button>
  );
}
