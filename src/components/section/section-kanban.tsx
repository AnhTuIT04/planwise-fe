import { useState, useRef } from "react";
import { Check, Loader2, MoreVertical, Pencil, Trash2 } from "lucide-react";

import { ISection } from "@/types/section.type";
import { IListSection } from "@/types/list-section.type";
import useModal from "@/hooks/useModal";
import { useClickOutside } from "@/hooks/useClickOutside";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverArrow, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import TaskItem from "./task-item";
import AddTaskButton from "./add-task-button";
import { useSection } from "@/hooks/useSection";
import { ITask } from "@/types/task.type";

interface SectionKanbanProps {
  section: ISection;
  projectId: string;
  isPersonal: boolean;
  listSections: IListSection[];
}

export default function SectionKanban({ section, projectId, isPersonal, listSections }: SectionKanbanProps) {
  const { openModal, closeModal } = useModal<"DELETE" | "ADD_UPDATE_TASK">();
  const [updatingSectionName, setUpdatingSectionName] = useState(false);
  const [sectionNameClicked, setSectionNameClicked] = useState(false);
  const [sectionName, setSectionName] = useState(section.name);

  const formRef = useRef<HTMLFormElement>(null);
  // const handleDeleteSection = useSection().handleDeleteSection;
  const { deleteSection,updateSection, isDeletingSection } = useSection({ projectId });
  useClickOutside(formRef, () => {
    if (!updatingSectionName) {
      setSectionNameClicked(false);
      setSectionName(section.name);
    }
  });

  const handleSectionNameChange = async () => {
    setUpdatingSectionName(true);
    await updateSection({ id: section.id, projectId, name: sectionName });
    setSectionNameClicked(false);
    setUpdatingSectionName(false);
    setSectionName(section.name);
  };

  const handleDeleteSection = () => {
    openModal({
      type: "DELETE",
      data: {
        title: "Delete section",
        description: (
          <span>
            Are you sure you want to delete section <b>{section.name}</b>?
          </span>
        ),
        subDescription: "All tasks within this section will also be deleted.",
      },
      onSubmit: async () => {
        try {
          await deleteSection({ id: section.id, projectId });
        } catch (error) {
          console.error("Error during delete execution:", error);
        } finally {
          closeModal();
        }
      },
    });
  };

  const handleAddTask = () => {
    openModal({
      type: "ADD_UPDATE_TASK",
      data: {
        action: "ADD",
        sectionId: section.id,
        sectionName: section.name,
        projectId: projectId,
        isPersonal: isPersonal,
        listSections: listSections,
      },
    });
  };
  const handleUpdateTask = (task: ITask) => {
    openModal({
      type: "ADD_UPDATE_TASK",
      data: {
        action: "UPDATE",
        sectionId: section.id,
        sectionName: section.name,
        projectId: projectId,
        isPersonal: isPersonal,
        task: task,
        listSections: listSections,
      },
    });
  };

  return (
    <div className="h-full w-64 min-w-64 transition-all">
      <div className="group flex items-center justify-between px-5 pt-4 pb-2">
        {!sectionNameClicked ? (
          <h2
            className="h-6 w-fit cursor-pointer border border-transparent border-b-transparent text-[16px] font-semibold text-[#413f39] hover:text-[#2caefd]"
            onClick={() => setSectionNameClicked(true)}
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
            className="flex h-6 items-center justify-between border border-transparent border-b-[#2ca7ff] text-[16px] font-semibold transition-shadow"
          >
            <Input
              autoFocus
              value={sectionName}
              disabled={updatingSectionName}
              onChange={(e) => setSectionName(e.target.value)}
              className="h-6 flex-1 rounded-none border-none p-0 text-[16px]! font-semibold text-[#413f39] shadow-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0 disabled:opacity-50"
            />

            <Button
              id="save-section-name-btn"
              size="sm"
              type="submit"
              tabIndex={0}
              disabled={!sectionName.trim() || updatingSectionName}
              className="h-6 cursor-pointer bg-transparent text-[11px] font-semibold hover:bg-transparent focus-visible:ring-0 focus-visible:outline-none"
            >
              {updatingSectionName ? (
                <Loader2 className="h-4 w-4 animate-spin text-[#2ca7ff]" />
              ) : (
                <Check className="h-4 w-4 text-[#2ca7ff]" />
              )}
            </Button>
          </form>
        )}

        {!sectionNameClicked && (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="pointer-events-none h-6 w-6 cursor-pointer p-0 text-[#787878] opacity-0 transition-opacity group-hover:pointer-events-auto group-hover:opacity-100 hover:bg-[#f0f0f0] data-[state=open]:pointer-events-auto data-[state=open]:opacity-100"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </PopoverTrigger>

            <PopoverContent
              align="end"
              className="relative w-42 rounded-[5px] px-0! py-2.5! shadow-[0_6px_12px_#0003]!"
            >
              <PopoverArrow stroke="2" />

              <div className="mb-2 px-4 text-xs font-normal text-[#787878]">Select an option</div>

              <button
                onClick={() => setSectionNameClicked(true)}
                className="flex w-full cursor-pointer items-center justify-between px-4 py-1.5 text-left text-xs transition-colors hover:bg-gray-100 focus:ring-0 focus:outline-none disabled:opacity-50"
              >
                Edit <Pencil className="w-3" />
              </button>
              <button
                onClick={() => handleDeleteSection()}
                className="flex w-full cursor-pointer items-center justify-between px-4 py-1.5 text-left text-xs transition-colors hover:bg-gray-100 focus:ring-0 focus:outline-none disabled:opacity-50"
              >
                Delete <Trash2 className="w-3" />
              </button>
            </PopoverContent>
          </Popover>
        )}
      </div>

      <div className="p-2">
        <AddTaskButton type="always_show" onClick={handleAddTask} />

        {section.tasks.map((task) => (
          <div key={task.id}>
            <TaskItem task={task} onClick={() => {handleUpdateTask(task)}} />
            <AddTaskButton type="hover_show" onClick={handleAddTask} />
          </div>
        ))}
      </div>
    </div>
  );
}
