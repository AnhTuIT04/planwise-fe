"use client";

import { DateRangePicker } from "./date-picker";
import SectionFilter from "./section-filter";
import ViewModeToggle from "./view-mode-toggle";

interface ProjectHeaderProps {
  projectId: string;
}

export default function ProjectHeader({ projectId }: ProjectHeaderProps) {
  return (
    <div className="flex h-12 items-center justify-between border-b p-2">
      <div className="flex items-center gap-2">
        <DateRangePicker projectId={projectId} />
        <SectionFilter projectId={projectId} />
      </div>
      <ViewModeToggle projectId={projectId} />
    </div>
  );
}
