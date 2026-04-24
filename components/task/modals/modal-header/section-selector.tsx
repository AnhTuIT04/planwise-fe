import { useState } from "react";
import { Check } from "lucide-react";

import { useSection } from "@/hooks/use-section";
import { useTaskMutations } from "@/hooks/use-task";
import { useTaskModalStore } from "@/stores/task-modal.store";
import { Popover, PopoverArrow, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export default function SectionSelector() {
  const mode = useTaskModalStore((s) => s.mode);
  const projectId = useTaskModalStore((s) => s.task.projectId);
  const sectionId = useTaskModalStore((s) => s.task.sectionId);
  const taskId = useTaskModalStore((s) => s.task.id);
  const setModalData = useTaskModalStore((s) => s.setModalData);
  const setField = useTaskModalStore((s) => s.setField);

  const [open, setOpen] = useState(false);

  const { data: sections } = useSection(projectId);
  const currentSection = sections.find((s) => s.id === sectionId);
  const sectionName = currentSection ? currentSection.name : "Select section";

  const { moveTaskMutation } = useTaskMutations();

  const handleSelectSection = async (selectedSectionId: string) => {
    if (mode === "update" && selectedSectionId !== sectionId) {
      try {
        const data = await moveTaskMutation.mutateAsync({
          taskId,
          fromSectionId: sectionId,
          toSectionId: selectedSectionId,
          insertAt: 0,
        });

        setModalData(data);
      } catch (error) {
        console.log("Failed to move task to new section:", error);
      }
    }

    setField("sectionId", selectedSectionId);
    setOpen(false);
  };

  return (
    <div className="relative">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <span
            className="-ml-2 inline-flex max-w-30 min-w-0 cursor-pointer items-center rounded-[5px] px-2 py-1.5 text-[12px] transition-opacity hover:bg-[#f7f8fa] hover:opacity-80"
            title={sectionName}
          >
            <b className="mr-1.5 inline-flex items-center text-[14px] text-[#ffb74d]">#</b>
            <span className="block truncate whitespace-nowrap">{sectionName}</span>
          </span>
        </PopoverTrigger>
        <PopoverContent className="relative w-45 rounded-[5px] px-0! py-2.5! shadow-[0_6px_12px_#0003]!" align="start">
          <PopoverArrow stroke="2" />

          <div className="mb-2 px-4 text-xs font-normal text-[#787878]">Select section</div>
          {sections.map((section) => (
            <button
              key={section.id}
              title={section.name}
              onClick={() => handleSelectSection(section.id)}
              className="flex w-full min-w-0 cursor-pointer items-center justify-between px-4 py-1.5 text-left text-xs transition-colors hover:bg-gray-100 focus:ring-0 focus:outline-none disabled:opacity-50"
            >
              <span className="flex min-w-0 items-center justify-start">
                <b className="mr-1.5 inline-flex items-center text-[#ffb74d]">#</b>
                <span className="block max-w-27 truncate text-[12px] whitespace-nowrap">{section.name}</span>
              </span>
              {section.id === sectionId && <Check className="h-4 w-4 text-[#413f39]" />}
            </button>
          ))}
        </PopoverContent>
      </Popover>

      <span className="absolute -top-2 left-0 text-[8px] text-[#787878]">SECTION</span>
    </div>
  );
}
