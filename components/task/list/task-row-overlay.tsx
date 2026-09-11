import { cn, formatTimeLabel } from "@/lib/utils";
import { ITask } from "@/types/task.type";
import TaskDeadline from "./task-deadline";
import TaskAssignees from "./task-assignees";

export default function TaskRowOverlay({ task }: { projectId: string; task: ITask }) {
  const isRunning = task.status === "RUNNING";
  const offset = task.lastStarted && !isRunning ? new Date(task.lastStarted).getTime() : 0;
  const liveSpent = (task.spent ?? 0) + (isRunning ? 0 : offset);

  const compactEstimate = formatTimeLabel(task.estimate);
  const compactSpent = liveSpent > 0 ? formatTimeLabel(liveSpent) : null;
  const timeLabel = compactSpent ? `${compactSpent} / ${compactEstimate}` : compactEstimate;

  return (
    <div className="grid h-full w-full grid-cols-[24px_1fr_88px_104px_120px_96px_24px] items-center gap-3 border-b border-[#dcdcdc] bg-white py-2 pr-3 pl-3 text-[14px] text-[#413f39] shadow-[0_3px_8px_#00000024]">
      <span />

      <div className="flex min-w-0 items-center gap-1">
        <span className="w-4" />
        <span
          dangerouslySetInnerHTML={{ __html: task.title }}
          className="truncate font-normal wrap-anywhere whitespace-pre-wrap"
        />
      </div>

      <span
        className={cn(
          "inline-flex w-fit items-center rounded-[5px] px-2 py-1.75 text-[10px] leading-none font-semibold",
          task.priority === "LOW" && "bg-green-200 text-green-800",
          task.priority === "NORMAL" && "bg-blue-200 text-blue-800",
          task.priority === "HIGH" && "bg-yellow-200 text-yellow-800",
          task.priority === "URGENT" && "bg-red-200 text-red-800",
        )}
      >
        {task.priority}
      </span>

      <span
        className={cn(
          "inline-flex w-fit items-center rounded-[5px] px-2 py-1.25 text-[10px] leading-none font-semibold whitespace-nowrap text-[#787878]",
          isRunning ? "bg-[#4dcd7d] text-white" : "bg-[#f0f0f0]",
        )}
      >
        {timeLabel}
      </span>

      <TaskDeadline deadline={task.deadline} />
      <TaskAssignees assignees={task.assignees} />
      <span />
    </div>
  );
}
