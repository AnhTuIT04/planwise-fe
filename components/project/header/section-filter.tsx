"use client";

import { useState } from "react";
import { ChevronDown, X } from "lucide-react";

import { useSection } from "@/hooks/use-section";
import { useTaskQueryStore } from "@/stores/task-query.store";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverArrow, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const EMPTY_SECTIONS: string[] = [];

interface SectionFilterProps {
  projectId: string;
}

export default function SectionFilter({ projectId }: SectionFilterProps) {
  const [open, setOpen] = useState(false);
  const selectedSections = useTaskQueryStore((s) => s.queries[projectId]?.sections ?? EMPTY_SECTIONS);
  const setField = useTaskQueryStore((s) => s.setField);

  // Fetch unfiltered section list so the dropdown always shows every section,
  // independent of the active filters.
  const { data: sections, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useSection(projectId, {});

  const toggleSection = (sectionId: string, checked: boolean) => {
    const next = checked ? [...selectedSections, sectionId] : selectedSections.filter((id) => id !== sectionId);
    setField(projectId, "sections", next);
  };

  const clear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setField(projectId, "sections", []);
  };

  const hasSelection = selectedSections.length > 0;
  const label = hasSelection ? `Section (${selectedSections.length})` : "Section";

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

        <PopoverContent align="start" sideOffset={4} className="relative w-56 px-0! py-2!">
          <PopoverArrow stroke="2" />
          <div className="mb-1 px-3 text-xs text-[#787878]">Filter by section</div>
          {isLoading ? (
            <div className="px-3 py-1.5 text-[12px] text-[#9b9ba1]">Loading…</div>
          ) : sections.length === 0 ? (
            <div className="px-3 py-1.5 text-[12px] text-[#9b9ba1]">No sections</div>
          ) : (
            <>
              {sections.map((section) => {
                const checked = selectedSections.includes(section.id);
                return (
                  <label
                    key={section.id}
                    className="flex w-full cursor-pointer items-center gap-2 px-3 py-1.5 text-[12px] font-medium text-[#413f39] hover:bg-gray-100"
                  >
                    <Checkbox
                      checked={checked}
                      onCheckedChange={(value) => toggleSection(section.id, value === true)}
                    />
                    <span className="truncate">{section.name}</span>
                  </label>
                );
              })}

              {hasNextPage && (
                <div className="flex justify-center pt-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                    className="text-[12px] text-[#787878]"
                  >
                    {isFetchingNextPage ? "Loading…" : "Load more"}
                  </Button>
                </div>
              )}
            </>
          )}
        </PopoverContent>
      </Popover>

      {hasSelection && (
        <button
          onClick={clear}
          className="text-muted-foreground hover:text-foreground absolute right-2 cursor-pointer"
          aria-label="Clear section filter"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
