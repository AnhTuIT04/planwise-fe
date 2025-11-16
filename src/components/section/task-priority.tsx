"use client";

import { useState } from "react";
import { Check } from "lucide-react";

import { ITask } from "@/types/task.type";
import { Popover, PopoverArrow, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const PRIORITIES: ITask["priority"][] = ["LOW", "NORMAL", "HIGH", "URGENT"];

export default function TaskPriority({ taskId, priority }: { taskId: string; priority: ITask["priority"] }) {
  const [open, setOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const getPriorityColor = (priority: ITask["priority"]) => {
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

  const handlePriorityChange = async (newPriority: ITask["priority"]) => {
    setIsUpdating(true);
    console.log("Saving priority time:", newPriority, "for task", taskId);
    await new Promise((r) => setTimeout(r, 500));
    setIsUpdating(false);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <span
          className={`inline-flex cursor-pointer items-center rounded-[5px] px-2 py-[3px] text-[10px] font-semibold transition-opacity hover:opacity-80 ${getPriorityColor(
            priority,
          )}`}
        >
          {priority}
        </span>
      </PopoverTrigger>
      <PopoverContent className="relative w-42 rounded-[5px] px-0! py-2.5! shadow-[0_6px_12px_#0003]!" align="start">
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
