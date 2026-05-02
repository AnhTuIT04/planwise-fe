"use client";

import { useState } from "react";
import { ChevronDown, X } from "lucide-react";

import { ITaskStatus } from "@/types/task.type";
import { useTaskQueryStore } from "@/stores/task-query.store";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverArrow, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const STATUS_OPTIONS: { value: ITaskStatus; label: string }[] = [
  { value: "TODO", label: "To do" },
  { value: "RUNNING", label: "Running" },
  { value: "DONE", label: "Done" },
  { value: "ARCHIVED", label: "Archived" },
];

const EMPTY_STATUSES: ITaskStatus[] = [];

interface StatusFilterProps {
  projectId: string;
}

export default function StatusFilter({ projectId }: StatusFilterProps) {
  const [open, setOpen] = useState(false);
  const statuses = useTaskQueryStore((s) => s.queries[projectId]?.statuses ?? EMPTY_STATUSES);
  const setField = useTaskQueryStore((s) => s.setField);

  const toggleStatus = (status: ITaskStatus, checked: boolean) => {
    const next = checked ? [...statuses, status] : statuses.filter((s) => s !== status);
    setField(projectId, "statuses", next);
  };

  const clear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setField(projectId, "statuses", []);
  };

  const hasSelection = statuses.length > 0;
  const label = hasSelection ? `Status (${statuses.length})` : "Status";

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
          <div className="mb-1 px-3 text-xs text-[#787878]">Filter by status</div>
          {STATUS_OPTIONS.map((opt) => {
            const checked = statuses.includes(opt.value);
            return (
              <label
                key={opt.value}
                className="flex w-full cursor-pointer items-center gap-2 px-3 py-1.5 text-[12px] font-medium text-[#413f39] hover:bg-gray-100"
              >
                <Checkbox
                  checked={checked}
                  onCheckedChange={(value) => toggleStatus(opt.value, value === true)}
                />
                {opt.label}
              </label>
            );
          })}
        </PopoverContent>
      </Popover>

      {hasSelection && (
        <button
          onClick={clear}
          className="text-muted-foreground hover:text-foreground absolute right-2 cursor-pointer"
          aria-label="Clear status filter"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
