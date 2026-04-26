import { useState, useRef } from "react";
import { Check, Loader2, MoreVertical, Pencil, Trash2, GripVertical } from "lucide-react";
import { toast } from "sonner";

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
import { useTask } from "@/hooks/useTask";
import { ITask } from "@/types/task.type";
import { IBasicUser } from "@/types/user.type";
import { useProject } from "@/hooks/useProject";
import { useMembers } from "@/hooks/useMembersManagement";
import { useAuth } from "@/hooks/useAuth";
import { useNotionIntegration } from "@/hooks/useNotion";

interface SectionKanbanProps {
  section: ISection;
  projectId: string;
  isPersonal: boolean;
  listSections: IListSection[];
  onTaskMove?: () => void;
}

export default function SectionKanban({
  section,
  projectId,
  isPersonal,
  listSections,
  onTaskMove,
}: SectionKanbanProps) {
  const { openModal, closeModal } = useModal<"DELETE" | "ADD_UPDATE_TASK">();
  const [updatingSectionName, setUpdatingSectionName] = useState(false);
  const [sectionNameClicked, setSectionNameClicked] = useState(false);
  const [sectionName, setSectionName] = useState(section.name);
  const [dragOver, setDragOver] = useState(false);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null);

  const formRef = useRef<HTMLFormElement>(null);
  const { members } = useMembers(projectId, "", 1, 100);
  const { user } = useAuth();
  const { sections: sectionsPersonal } = useSection({ projectId: user?.workspaceId || "" });
  const { deleteSection, updateSection, isDeletingSection } = useSection({ projectId });
  const { updateTask, moveTask } = useTask();
  const { importTask } = useNotionIntegration();
  useClickOutside(formRef, () => {
    if (!updatingSectionName) {
      setSectionNameClicked(false);
      setSectionName(section.name);
    }
  });

  const handleSectionNameChange = async () => {
    setUpdatingSectionName(true);
    await updateSection({ id: section.id, projectId, name: sectionName })
      .catch((error) => {
        // console.error("Failed to update section name:", error);
      })
      .finally(() => {
        setUpdatingSectionName(false);
      });
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
        listSectionsPersonal: sectionsPersonal,
        member: members!,
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
        listSectionsPersonal: sectionsPersonal,
        member: members!,
      },
    });
  };

  // Drag & Drop handlers for task items
  const handleDragStart = (task: ITask, index: number) => (e: React.DragEvent) => {
    e.dataTransfer.setData("taskId", task.id);
    e.dataTransfer.setData("text/plain", task.id); // Fallback
    e.dataTransfer.setData("fromSectionId", section.id);
    e.dataTransfer.setData("fromIndex", index.toString());
    e.dataTransfer.effectAllowed = "all";
    setDraggingTaskId(task.id);
  };

  const handleDragEnd = () => {
    setDraggingTaskId(null);
    setDragOverIndex(null);
  };

  // Handler for dropping on a specific task position
  const handleTaskDragOver = (index: number) => (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "copy";
    setDragOverIndex(index);
  };

  const handleTaskDragLeave = (e: React.DragEvent) => {
    // Only reset if we're leaving the task item entirely
    const relatedTarget = e.relatedTarget as HTMLElement;
    if (!relatedTarget || !e.currentTarget.contains(relatedTarget)) {
      setDragOverIndex(null);
    }
  };

  const handleTaskDrop = (targetIndex: number) => async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverIndex(null);
    setDraggingTaskId(null);

    const taskId = e.dataTransfer.getData("taskId") || e.dataTransfer.getData("text/plain");
    const fromSectionId = e.dataTransfer.getData("fromSectionId");
    const fromIndex = parseInt(e.dataTransfer.getData("fromIndex"), 10);
    const notionPageId = e.dataTransfer.getData("notionPageId") || (e.dataTransfer.getData("text/plain").length > 20 ? e.dataTransfer.getData("text/plain") : "");

    if (notionPageId && projectId) {
      await importTask({
        notionPageId,
        projectId: projectId,
        sectionId: section.id,
      });
      return;
    }

    if (!taskId) return;

    // Calculate insertAt (0-indexed for API)
    // If dropping in the same section
    if (fromSectionId === section.id) {
      // If dropping at the same position, do nothing
      if (fromIndex === targetIndex || fromIndex === targetIndex - 1) return;

      // Adjust target index if moving down (account for removed item)
      let insertAt = targetIndex;
      if (fromIndex < targetIndex) {
        insertAt = targetIndex - 1;
      }

      try {
        await moveTask({
          id: taskId,
          payload: {
            fromSectionId: fromSectionId,
            toSectionId: section.id,
            insertAt: insertAt,
          },
        });

        if (onTaskMove) {
          onTaskMove();
        }
      } catch (error) {
        console.error("Failed to reorder task:", error);
      }
    } else {
      // Moving from different section
      try {
        await moveTask({
          id: taskId,
          payload: {
            fromSectionId: fromSectionId,
            toSectionId: section.id,
            insertAt: targetIndex,
          },
        });

        if (onTaskMove) {
          onTaskMove();
        }
      } catch (error) {
        console.error("Failed to move task:", error);
      }
    }
  };

  // Handler for section-level drop (dropping at the end)
  const handleSectionDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    setDragOver(true);
  };

  const handleSectionDragLeave = (e: React.DragEvent) => {
    // Only set dragOver to false if we're leaving the section container
    const relatedTarget = e.relatedTarget as HTMLElement;
    if (!relatedTarget || !e.currentTarget.contains(relatedTarget)) {
      setDragOver(false);
    }
  };

  const handleSectionDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    setDragOverIndex(null);
    setDraggingTaskId(null);

    const taskId = e.dataTransfer.getData("taskId") || e.dataTransfer.getData("text/plain");
    const fromSectionId = e.dataTransfer.getData("fromSectionId");
    const notionPageId = e.dataTransfer.getData("notionPageId") || (e.dataTransfer.getData("text/plain").length > 20 ? e.dataTransfer.getData("text/plain") : "");

    if (notionPageId && projectId) {
      await importTask({
        notionPageId,
        projectId: projectId,
        sectionId: section.id,
      });
      return;
    }

    if (!taskId) return;

    // If dropping in section container (not on a specific task), insert at end
    try {
      await moveTask({
        id: taskId,
        payload: {
          fromSectionId: fromSectionId,
          toSectionId: section.id,
          insertAt: section.tasks.length, // Insert at end
        },
      });

      if (onTaskMove) {
        onTaskMove();
      }
    } catch (error) {
      console.error("Failed to move task:", error);
    }
  };

  return (
    <div
      className={`h-full w-64 min-w-64 transition-all ${dragOver && dragOverIndex === null ? "border-2 border-dashed border-blue-300 bg-blue-50" : ""}`}
      onDragOver={handleSectionDragOver}
      onDragLeave={handleSectionDragLeave}
      onDrop={handleSectionDrop}
    >
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

        {section.tasks.map((task, index) => (
          <div
            key={task.id}
            draggable
            onDragStart={handleDragStart(task, index)}
            onDragEnd={handleDragEnd}
            onDragOver={handleTaskDragOver(index)}
            onDragLeave={handleTaskDragLeave}
            onDrop={handleTaskDrop(index)}
            className={`group/task relative cursor-move transition-all ${
              draggingTaskId === task.id ? "opacity-50" : ""
            } ${dragOverIndex === index ? "mt-8" : ""}`}
          >
            {/* Drop indicator line */}
            {dragOverIndex === index && (
              <div className="absolute -top-2 right-0 left-0 h-0.5 rounded-full bg-blue-500" />
            )}

            <div className="flex items-start gap-1">
              <div className="cursor-grab pt-2 opacity-0 transition-opacity group-hover/task:opacity-100 active:cursor-grabbing">
                <GripVertical className="h-4 w-4 text-gray-400" />
              </div>
              <div className="flex-1">
                <TaskItem
                  task={task}
                  sectionId={section.id}
                  isPersonal={isPersonal}
                  onClick={() => {
                    handleUpdateTask(task);
                  }}
                />
              </div>
            </div>
            <AddTaskButton type="hover_show" onClick={handleAddTask} />
          </div>
        ))}

        {/* Drop zone at the end of the list */}
        {section.tasks.length > 0 && (
          <div
            className={`h-8 transition-all ${dragOverIndex === section.tasks.length ? "rounded border-2 border-dashed border-blue-300 bg-blue-100" : ""}`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOverIndex(section.tasks.length);
            }}
            onDragLeave={() => setDragOverIndex(null)}
            onDrop={handleTaskDrop(section.tasks.length)}
          />
        )}
      </div>
    </div>
  );
}
