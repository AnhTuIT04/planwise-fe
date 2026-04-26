"use client";

import { DateRangePicker } from "./date-picker";

interface ProjectHeaderProps {
  projectId: string;
}

export default function ProjectHeader({ projectId }: ProjectHeaderProps) {
  return (
    <div className="flex h-12 items-center justify-between border-b p-2">
      <div>
        <DateRangePicker projectId={projectId} />
      </div>
      <div className="text-sm text-gray-500">Board</div>
    </div>
  );
}
