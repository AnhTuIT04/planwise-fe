"use client";

import { DateRangePicker, DateRangePickerProps } from "@/components/ui/date-picker";
import type { DateRange } from "react-day-picker";

interface ProjectNavProps {
  dateRange?: DateRange;
  onDateRangeChange?: (range: DateRange | undefined) => void;
}

export default function ProjectNav({ dateRange, onDateRangeChange }: ProjectNavProps) {
  return (
    <div className="flex h-12 items-center justify-between border-b p-2">
      <div>
        <DateRangePicker value={dateRange} onChange={onDateRangeChange} />
      </div>
      <div className="text-sm text-gray-500">Board</div>
    </div>
  );
}
