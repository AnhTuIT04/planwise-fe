import { useState } from "react";
import { Loader2, Pause } from "lucide-react";

import { cn } from "@/lib/utils";
import { ITaskStatus } from "@/types/task.type";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface TaskStatusIconProps {
  status: ITaskStatus;
  onChangeStatus: (newStatus: ITaskStatus) => Promise<void>;
  className?: string;
}

export function TODOIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={cn("h-6 w-6 text-green-500", className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g transform="translate(-1.8, -1.8) scale(0.575)">
        <path
          d="M24 4C35.0457 4 44 12.9543 44 24C44 35.0457 35.0457 44 24 44C12.9543 44 4 35.0457 4 24C4 12.9543 12.9543 4 24 4ZM32.6339 17.6161C32.1783 17.1605 31.4585 17.1301 30.9676 17.525L30.8661 17.6161L20.75 27.7322L17.1339 24.1161C16.6457 23.628 15.8543 23.628 15.3661 24.1161C14.9105 24.5717 14.8801 25.2915 15.275 25.7824L15.3661 25.8839L19.8661 30.3839C20.3217 30.8395 21.0415 30.8699 21.5324 30.475L21.6339 30.3839L32.6339 19.3839C33.122 18.8957 33.122 18.1043 32.6339 17.6161Z"
          fill="currentColor"
        />
      </g>
    </svg>
  );
}

export function DONEIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={cn("h-6 w-6 text-[#b9b9b9] group-hover:text-green-500", className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g transform="translate(-5.1875, -5.1875) scale(1.375)">
        <path
          d="M9.5 12.1316L11.7414 14.5L16 10M20.5 12.5C20.5 16.9183 16.9183 20.5 12.5 20.5C8.08172 20.5 4.5 16.9183 4.5 12.5C4.5 8.08172 8.08172 4.5 12.5 4.5C16.9183 4.5 20.5 8.08172 20.5 12.5Z"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

export default function TaskStatusIcon({ status, onChangeStatus, className }: TaskStatusIconProps) {
  const [taskStatusEditing, setTaskStatusEditing] = useState(false);

  const handleToggleSubTaskStatus = async () => {
    setTaskStatusEditing(true);

    switch (status) {
      case "TODO":
        await onChangeStatus("DONE");
        break;
      case "RUNNING":
        await onChangeStatus("TODO");
        break;
      case "DONE":
        await onChangeStatus("TODO");
        break;
    }

    setTaskStatusEditing(false);
  };

  return (
    <div
      data-stop-task-open="true"
      className={cn(
        "group flex h-4 w-4 cursor-pointer items-center justify-center rounded-full transition-all",
        className,
      )}
      onPointerDown={(event) => event.stopPropagation()}
      onClick={handleToggleSubTaskStatus}
    >
      <TooltipProvider delayDuration={1000}>
        {taskStatusEditing ? (
          <Loader2 className="scale-115 animate-spin text-[#2ca7ff]" />
        ) : status === "DONE" ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <TODOIcon />
            </TooltipTrigger>
            <TooltipContent side="bottom">Mark as to-do</TooltipContent>
          </Tooltip>
        ) : status === "RUNNING" ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Pause className="h-6 w-6 text-[#b9b9b9]" />
            </TooltipTrigger>
            <TooltipContent side="bottom">Mark as to-do</TooltipContent>
          </Tooltip>
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <DONEIcon />
            </TooltipTrigger>
            <TooltipContent side="bottom">Mark as done</TooltipContent>
          </Tooltip>
        )}
      </TooltipProvider>
    </div>
  );
}
