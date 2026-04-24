"use client";

import { DateRangePicker } from "@/components/ui/date-picker";

export default function ProjectHeader() {
  return (
    <div className="flex h-12 items-center justify-between border-b p-2">
      <div>
        <DateRangePicker />
      </div>
      <div className="text-sm text-gray-500">Board</div>
    </div>
  );
}
