"use client";

import { DateRangePicker } from "./date-picker";
import ViewModeToggle from "./view-mode-toggle";

interface ProjectHeaderProps {
  projectId: string;
}

export default function ProjectHeader({ projectId }: ProjectHeaderProps) {
  return (
    <div className="flex h-12 items-center justify-between border-b p-2">
      <div>
        <DateRangePicker projectId={projectId} />
      </div>
      <ViewModeToggle projectId={projectId} />
    </div>
  );
}
