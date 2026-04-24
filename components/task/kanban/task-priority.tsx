"use client";

import { useState } from "react";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { ITaskPriority } from "@/types/task.type";
import { Popover, PopoverArrow, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const PRIORITIES: ITaskPriority[] = ["LOW", "NORMAL", "HIGH", "URGENT"];

interface TaskPriorityProps {
  priority: ITaskPriority;
  onChangePriority: (newPriority: ITaskPriority) => Promise<void>;
  className?: string;
}

export default function TaskPriority({ priority, onChangePriority, className }: TaskPriorityProps) {
  const [open, setOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const getPriorityColor = (priority: ITaskPriority) => {
    switch (priority) {
      case "LOW":
        return "bg-green-200 text-green-800";
      case "NORMAL":
        return "bg-blue-200 text-blue-800";
      case "HIGH":
        return "bg-yellow-200 text-yellow-800";
      case "URGENT":
        return "bg-red-200 text-red-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  const handlePriorityChange = async (newPriority: ITaskPriority) => {
    setIsUpdating(true);
    await onChangePriority(newPriority);
    setIsUpdating(false);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <span
          data-stop-task-open="true"
          onPointerDown={(event) => event.stopPropagation()}
          onClick={(event) => event.stopPropagation()}
          className={cn(
            "inline-flex cursor-pointer items-center rounded-[5px] px-2 py-1.75 text-[10px] leading-none font-semibold transition-opacity hover:opacity-80",
            getPriorityColor(priority),
            className,
          )}
        >
          {priority}
        </span>
      </PopoverTrigger>
      <PopoverContent
        data-stop-task-open="true"
        className="relative w-42 rounded-[5px] px-0! py-2.5! shadow-[0_6px_12px_#0003]!"
        align="start"
        onPointerDown={(event) => event.stopPropagation()}
        onClick={(event) => event.stopPropagation()}
      >
        <PopoverArrow stroke="2" />

        <div className="mb-2 px-4 text-xs font-normal text-[#787878]">Select priority</div>
        {PRIORITIES.map((priorityOption) => (
          <button
            key={priorityOption}
            onClick={() => handlePriorityChange(priorityOption)}
            disabled={isUpdating}
            className="flex w-full cursor-pointer items-center justify-between px-4 py-1.5 text-left text-xs transition-colors hover:bg-gray-100 focus:ring-0 focus:outline-none disabled:opacity-50"
          >
            <span className="inline-flex items-center text-[12px] font-medium text-[#413f39]">{priorityOption}</span>
            {priorityOption === priority && <Check className="h-4 w-4 text-[#413f39]" />}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
}
