"use client";

import { differenceInCalendarDays, format, isSameYear } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface TaskDeadlineProps {
  deadline: string | null;
  className?: string;
}

function formatDeadline(date: Date) {
  const now = new Date();
  const days = differenceInCalendarDays(date, now);

  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  if (days === -1) return "Yesterday";

  return isSameYear(date, now) ? format(date, "MMM d") : format(date, "MMM d, yyyy");
}

export default function TaskDeadline({ deadline, className }: TaskDeadlineProps) {
  if (!deadline) {
    return <span className={cn("text-[12px] text-[#b4b4b4]", className)}>—</span>;
  }

  const date = new Date(deadline);
  const days = differenceInCalendarDays(date, new Date());
  const overdue = days < 0;
  const dueSoon = days === 0 || days === 1;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-[12px] text-[#787878]",
        overdue && "text-red-600",
        dueSoon && !overdue && "text-amber-600",
        className,
      )}
    >
      <CalendarIcon className="h-3 w-3" />
      {formatDeadline(date)}
    </span>
  );
}
