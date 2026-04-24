import { Pause } from "lucide-react";

import { cn, formatTimeLabel } from "@/lib/utils";
import { ITask } from "@/types/task.type";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DONEIcon, TODOIcon } from "@/components/task/kanban/task-status-icon";

export default function TaskItemOverlay({ projectId, task }: { projectId: string; task: ITask }) {
  return (
    <div key={task.id} className="mr-0.5 cursor-pointer rounded border bg-white p-3 opacity-50">
      <div className="mb-1 flex items-start justify-between">
        <span
          className={cn(
            "inline-flex cursor-pointer items-center rounded-[5px] px-2 py-1.75 text-[10px] leading-none font-semibold transition-opacity hover:opacity-80",
            task.priority === "LOW" && "bg-green-200 text-green-800",
            task.priority === "NORMAL" && "bg-blue-200 text-blue-800",
            task.priority === "HIGH" && "bg-yellow-200 text-yellow-800",
            task.priority === "URGENT" && "bg-red-200 text-red-800",
          )}
        >
          {task.priority}
        </span>

        <TaskEstimateTimeOverlay task={task} />
      </div>

      <span
        dangerouslySetInnerHTML={{ __html: task.title }}
        className="text-[14px] font-normal wrap-anywhere whitespace-pre-wrap text-[#413f39]"
      />

      {task.subtasks.length > 0 && (
        <div className="my-2 space-y-1">
          {task.subtasks.map((subtask) => (
            <div key={subtask.id} className="flex items-center gap-2 text-[14px] font-normal text-[#413f39]">
              <div className="mt-0.5 self-start">
                <div className="group flex h-4 w-4 cursor-pointer items-center justify-center rounded-full transition-all">
                  {subtask.status === "DONE" ? (
                    <TODOIcon />
                  ) : subtask.status === "RUNNING" ? (
                    <Pause className="h-6 w-6 text-[#b9b9b9]" />
                  ) : (
                    <DONEIcon />
                  )}
                </div>
              </div>
              <span dangerouslySetInnerHTML={{ __html: subtask.title }} className="wrap-anywhere whitespace-pre-wrap" />
            </div>
          ))}
        </div>
      )}

      <div className="mt-2 flex items-center gap-4">
        <div className="group flex h-4 w-4 translate-x-px scale-110 transform cursor-pointer items-center justify-center rounded-full transition-all">
          {task.status === "DONE" ? (
            <TODOIcon />
          ) : task.status === "RUNNING" ? (
            <Pause className="h-6 w-6 text-[#b9b9b9]" />
          ) : (
            <DONEIcon />
          )}
        </div>

        {/* Show originalProject if exists */}
        {task.originalProject && task.originalProject.id !== projectId && (
          <Avatar className="size-4 scale-110">
            <AvatarImage src={task.originalProject.logoUrl || undefined} alt={task.originalProject.name} />
            <AvatarFallback className="bg-blue-100 text-[8px] font-semibold text-blue-600">
              {task.originalProject.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    </div>
  );
}

function TaskEstimateTimeOverlay({ task }: { task: ITask }) {
  const isRunning = task.status === "RUNNING";

  const compactEstimateTimeString = formatTimeLabel(task.estimate);
  let compactSpentTimeString = null;

  if (!isRunning) {
    const offset = task.lastStarted ? new Date(task.lastStarted).getTime() : 0;
    const actualSpent = (task.spent ?? 0) + offset;
    compactSpentTimeString = formatTimeLabel(actualSpent);
  }

  const displayLabel = !compactSpentTimeString
    ? compactEstimateTimeString
    : `${compactSpentTimeString} / ${compactEstimateTimeString}`;

  return (
    <span
      className={cn(
        "inline-flex max-w-full min-w-0 cursor-pointer items-center overflow-hidden rounded-[5px] px-2 py-1.25 text-[10px] leading-none font-semibold text-ellipsis whitespace-nowrap text-[#787878]",
        isRunning ? "bg-[#4dcd7d] text-white" : "bg-[#f0f0f0]",
      )}
    >
      {displayLabel}
    </span>
  );
}
