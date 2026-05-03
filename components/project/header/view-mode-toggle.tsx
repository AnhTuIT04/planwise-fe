"use client";

import { LayoutGrid, List } from "lucide-react";

import { cn } from "@/lib/utils";
import { ProjectViewMode, useProjectViewStore } from "@/stores/project-view.store";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ViewModeToggleProps {
  projectId: string;
}

const OPTIONS: { mode: ProjectViewMode; label: string; Icon: typeof LayoutGrid }[] = [
  { mode: "kanban", label: "Board view", Icon: LayoutGrid },
  { mode: "list", label: "List view", Icon: List },
];

export default function ViewModeToggle({ projectId }: ViewModeToggleProps) {
  const hasHydrated = useProjectViewStore((state) => state.hasHydrated);
  const mode = useProjectViewStore((state) => state.getMode(projectId));
  const setMode = useProjectViewStore((state) => state.setMode);

  if (!hasHydrated) {
    return (
      <div className="inline-flex items-center gap-0.5 rounded border border-[#dcdcdc] bg-white p-0.5">
        {OPTIONS.map(({ mode: optMode, label, Icon }) => (
          <div
            key={optMode}
            className="flex h-7 w-7 animate-pulse items-center justify-center rounded bg-[#f0f0f0]/50 text-[#787878]" // Placeholder style
            aria-label={label}
          >
            <Icon className="invisible h-4 w-4" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <TooltipProvider delayDuration={500}>
      <div className="inline-flex items-center gap-0.5 rounded border border-[#dcdcdc] bg-white p-0.5">
        {OPTIONS.map(({ mode: optMode, label, Icon }) => {
          const active = mode === optMode;
          return (
            <Tooltip key={optMode}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  aria-label={label}
                  aria-pressed={active}
                  onClick={() => setMode(projectId, optMode)}
                  className={cn(
                    "flex h-7 w-7 cursor-pointer items-center justify-center rounded text-[#787878] transition-colors",
                    "hover:bg-[#f8f8f9] hover:text-[#413f39]",
                    "focus-visible:ring-2 focus-visible:ring-[#2caefd] focus-visible:outline-none",
                    active && "bg-[#f0f0f0] text-[#413f39]",
                  )}
                >
                  <Icon className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom">{label}</TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
}
