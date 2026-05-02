"use client";

import { useState } from "react";
import { ChevronDown, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { ITaskPriority } from "@/types/task.type";
import { useTaskQueryStore } from "@/stores/task-query.store";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverArrow, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const PRIORITY_OPTIONS: ITaskPriority[] = ["LOW", "NORMAL", "HIGH", "URGENT"];

const EMPTY_PRIORITIES: ITaskPriority[] = [];

const priorityColor = (priority: ITaskPriority) => {
  switch (priority) {
    case "LOW":
      return "bg-green-200 text-green-800";
    case "NORMAL":
      return "bg-blue-200 text-blue-800";
    case "HIGH":
      return "bg-yellow-200 text-yellow-800";
    case "URGENT":
      return "bg-red-200 text-red-800";
  }
};

interface PriorityFilterProps {
  projectId: string;
}

export default function PriorityFilter({ projectId }: PriorityFilterProps) {
  const [open, setOpen] = useState(false);
  const priorities = useTaskQueryStore((s) => s.queries[projectId]?.priorities ?? EMPTY_PRIORITIES);
  const setField = useTaskQueryStore((s) => s.setField);

  const togglePriority = (priority: ITaskPriority, checked: boolean) => {
    const next = checked ? [...priorities, priority] : priorities.filter((p) => p !== priority);
    setField(projectId, "priorities", next);
  };

  const clear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setField(projectId, "priorities", []);
  };

  const hasSelection = priorities.length > 0;
  const label = hasSelection ? `Priority (${priorities.length})` : "Priority";

  return (
    <div className="relative inline-flex items-center">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={`text-muted-foreground relative h-7 w-auto cursor-pointer justify-start gap-2 px-2! ${
              hasSelection ? "pr-8!" : ""
            } rounded-[6px] text-[12px] font-semibold`}
          >
            <span>{label}</span>
            <ChevronDown className="h-3 w-3" />
          </Button>
        </PopoverTrigger>

        <PopoverContent align="start" sideOffset={4} className="relative w-44 px-0! py-2!">
          <PopoverArrow stroke="2" />
          <div className="mb-1 px-3 text-xs text-[#787878]">Filter by priority</div>
          {PRIORITY_OPTIONS.map((priority) => {
            const checked = priorities.includes(priority);
            return (
              <label
                key={priority}
                className="flex w-full cursor-pointer items-center gap-2 px-3 py-1.5 text-[12px] font-medium text-[#413f39] hover:bg-gray-100"
              >
                <Checkbox
                  checked={checked}
                  onCheckedChange={(value) => togglePriority(priority, value === true)}
                />
                <span
                  className={cn(
                    "inline-flex items-center rounded-[5px] px-2 py-0.5 text-[10px] font-semibold",
                    priorityColor(priority),
                  )}
                >
                  {priority}
                </span>
              </label>
            );
          })}
        </PopoverContent>
      </Popover>

      {hasSelection && (
        <button
          onClick={clear}
          className="text-muted-foreground hover:text-foreground absolute right-2 cursor-pointer"
          aria-label="Clear priority filter"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
