"use client";

import { type MouseEvent } from "react";

import { cn } from "@/lib/utils";
import { ITask } from "@/types/task.type";
import { useTaskModalStore } from "@/stores/task-modal.store";
import TaskDeadline from "@/components/task/list/task-deadline";

const priorityColor = (priority: ITask["priority"]) => {
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

const statusDotColor = (status: ITask["status"]) => {
  switch (status) {
    case "TODO":
      return "bg-[#b9b9b9]";
    case "RUNNING":
      return "bg-amber-500";
    case "DONE":
      return "bg-green-500";
    case "ARCHIVED":
      return "bg-gray-400";
  }
};

interface SearchResultRowProps {
  task: ITask;
  projectId: string;
  sectionId: string;
  sectionName: string;
  position: number;
}

export default function SearchResultRow({
  task,
  projectId,
  sectionId,
  sectionName,
  position,
}: SearchResultRowProps) {
  const openModal = useTaskModalStore((s) => s.openModal);

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    openModal({
      mode: "update",
      projectId,
      sectionId,
      position,
      ...task,
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="flex w-full flex-col items-start gap-1 rounded-md px-3 py-2 text-left transition-colors hover:bg-[#ececee] focus:bg-[#ececee] focus:outline-none"
    >
      <div className="flex w-full items-start gap-2">
        <span className={cn("mt-1.5 h-2 w-2 shrink-0 rounded-full", statusDotColor(task.status))} />
        <span
          className="flex-1 truncate text-[13px] font-medium text-[#2f2f33]"
          dangerouslySetInnerHTML={{ __html: task.title }}
        />
        <span
          className={cn(
            "shrink-0 rounded-[5px] px-1.5 py-0.5 text-[10px] font-semibold",
            priorityColor(task.priority),
          )}
        >
          {task.priority}
        </span>
      </div>

      <div className="flex w-full items-center gap-2 pl-4 text-[11px] text-[#787878]">
        <span className="truncate">{sectionName}</span>
        <span>·</span>
        <TaskDeadline deadline={task.deadline} className="text-[11px]" />
      </div>
    </button>
  );
}
