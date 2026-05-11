import { useRef, useState } from "react";
import { Check, Loader2, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { DraggableAttributes } from "@dnd-kit/core";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";

import { cn } from "@/lib/utils";
import { IBasicSection } from "@/types/section.type";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverArrow, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useClickOutside } from "@/hooks/use-click-outside";
import { useSectionMutations } from "@/hooks/use-section";

interface SectionKanbanHeaderProps {
  isDragging: boolean;
  projectId: string;
  section: IBasicSection;
  dragHandleAttributes?: DraggableAttributes;
  dragHandleListeners?: SyntheticListenerMap;
}

export default function SectionKanbanHeader({
  isDragging,
  projectId,
  section,
  dragHandleAttributes,
  dragHandleListeners,
}: SectionKanbanHeaderProps) {
  const [sectionNameClicked, setSectionNameClicked] = useState(false);
  const [sectionName, setSectionName] = useState(section.name);
  const [optionsOpen, setOptionsOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const { updateSectionMutation, deleteSectionMutation } = useSectionMutations();

  useClickOutside(formRef, () => {
    if (!updateSectionMutation.isPending) {
      setSectionNameClicked(false);
      setSectionName(section.name);
    }
  });

  const handleSectionNameChange = async () => {
    try {
      await updateSectionMutation.mutateAsync({ projectId, sectionId: section.id, name: sectionName });
    } catch (error) {
      console.log("Error updating section name:", error);
    }

    setSectionNameClicked(false);
  };

  const handleDeleteSection = async () => {
    if (section.taskCount > 0) return;

    try {
      await deleteSectionMutation.mutateAsync({ projectId, sectionId: section.id });
    } catch (error) {
      console.log("Error deleting section:", error);
    }
  };

  const handleStartEdit = () => {
    setOptionsOpen(false);
    setSectionName(section.name);
    setSectionNameClicked(true);
  };

  return (
    <div
      {...dragHandleAttributes}
      {...dragHandleListeners}
      className="group flex items-center justify-between px-5 pt-4 pb-2"
    >
      {!sectionNameClicked ? (
        <h2
          className={cn(
            "h-6 w-fit cursor-pointer truncate border border-transparent border-b-transparent text-[16px] font-semibold text-[#413f39] hover:text-[#2caefd]",
            isDragging && "pointer-events-none text-[#2caefd]",
          )}
          onClick={handleStartEdit}
        >
          {section.name}
        </h2>
      ) : (
        <form
          ref={formRef}
          onSubmit={(e) => {
            e.preventDefault();
            handleSectionNameChange();
          }}
          className="flex h-6 items-center justify-between border border-transparent border-b-[#2ca7ff] pt-px text-[16px] font-semibold transition-shadow"
        >
          <Input
            autoFocus
            value={sectionName}
            disabled={updateSectionMutation.isPending}
            onChange={(e) => setSectionName(e.target.value)}
            className="h-6 flex-1 rounded-none border-none p-0 text-[16px]! font-semibold text-[#413f39] shadow-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0 disabled:opacity-50"
          />

          <Button
            id="save-section-name-btn"
            size="sm"
            type="submit"
            tabIndex={0}
            disabled={!sectionName.trim() || updateSectionMutation.isPending}
            className="h-6 cursor-pointer bg-transparent text-[11px] font-semibold hover:bg-transparent focus-visible:ring-0 focus-visible:outline-none"
          >
            {updateSectionMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin text-[#2ca7ff]" />
            ) : (
              <Check className="h-4 w-4 text-[#2ca7ff]" />
            )}
          </Button>
        </form>
      )}

      {!sectionNameClicked && (
        <Popover open={optionsOpen} onOpenChange={setOptionsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 cursor-pointer p-0 text-[#787878] opacity-0 transition-opacity group-hover:opacity-100 hover:bg-[#f0f0f0] data-[state=open]:opacity-100"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </PopoverTrigger>

          <PopoverContent align="end" className="relative w-42 rounded-[5px] px-0! py-2.5! shadow-[0_6px_12px_#0003]!">
            <PopoverArrow stroke="2" />

            <div className="mb-2 px-4 text-xs font-normal text-[#787878]">Select an option</div>

            <button
              type="button"
              onMouseDown={(event) => {
                event.preventDefault();
                event.stopPropagation();
                handleStartEdit();
              }}
              className="flex w-full cursor-pointer items-center justify-between px-4 py-0.5 text-left text-xs transition-colors hover:bg-gray-100 focus:ring-0 focus:outline-none disabled:opacity-50"
            >
              Edit <Pencil className="w-3" />
            </button>
            <button
              type="button"
              onClick={() => handleDeleteSection()}
              disabled={section.taskCount > 0}
              className="flex w-full cursor-pointer items-center justify-between px-4 py-0.5 text-left text-xs transition-colors hover:bg-gray-100 focus:ring-0 focus:outline-none disabled:cursor-default disabled:opacity-50 disabled:hover:bg-transparent"
            >
              Delete <Trash2 className="w-3" />
            </button>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
