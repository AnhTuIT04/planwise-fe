import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { DragEndEvent, DragOverlay, DragStartEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

import { useTaskModalStore } from "@/stores/task-modal.store";
import { useSubtaskMutations } from "@/hooks/use-subtask";
import { ISubtask } from "@/types/task.type";
import DndProvider from "@/components/providers/dnd-provider";
import { Button } from "@/components/ui/button";
import TaskEditor from "./task-editor";
import SubtaskEditor from "./subtask-editor";
import TaskDescription from "./task-description";
import SubtaskEditorOverlay from "./subtask-editor-overlay";
import { NotionTaskProperties } from "./notion-task-properties";
import { GmailTaskProperties } from "./gmail-task-properties";
import CommentSection from "./comment-section";

export default function TaskModalContent() {
  const mode = useTaskModalStore((s) => s.mode);
  const sectionId = useTaskModalStore((s) => s.task.sectionId);
  const taskId = useTaskModalStore((s) => s.task.id);
  const subtasks = useTaskModalStore((state) => state.task.subtasks);
  const setModalData = useTaskModalStore((s) => s.setModalData);
  const addSubtask = useTaskModalStore((s) => s.addSubtask);
  const notionPageId = useTaskModalStore((s) => s.task.notionPageId);
  const gmailMessageId = useTaskModalStore((s) => s.task.gmailMessageId);
  const gmailBodyHtml = useTaskModalStore((s) => s.task.gmailBodyHtml);

  const { createSubtaskMutation, moveSubtaskMutation } = useSubtaskMutations();

  const [activeSubtask, setActiveSubtask] = useState<ISubtask | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveSubtask(active.data.current ? { ...active.data.current.data } : null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveSubtask(null);
      return;
    }

    if (active.id !== over.id) {
      const moveTo = subtasks.findIndex((subtask) => subtask.id === over.id);
      if (moveTo !== -1) {
        moveSubtaskMutation.mutate(
          {
            sectionId,
            parentTaskId: taskId,
            subtaskId: active.id as string,
            moveTo,
          },
          {
            onSuccess(data) {
              setModalData(data);
            },
            onError: (error) => {
              console.log("Failed to move section:", error);
            },
          },
        );
      }
    }

    setActiveSubtask(null);
  };

  const handleAddSubtask = () => {
    // Optimistic insert: a "temp-…" placeholder shows up in the modal
    // immediately so the click feels instant. The mutation still runs because
    // the server may flip the parent's status (DONE → TODO); when it returns
    // we swap the full task in via setModalData.
    addSubtask();

    if (mode === "update") {
      createSubtaskMutation.mutate(
        {
          sectionId,
          parentTaskId: taskId,
          title: "<p></p>",
          estimate: 20 * 60 * 1000, // default 20 mins in ms
          assigneeIds: [],
        },
        {
          onSuccess: (data) => setModalData(data),
          onError: (error) => console.log("Failed to add subtask:", error),
        },
      );
    }
  };

  return (
    <DndProvider onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex w-full flex-col items-center">
        <TaskEditor />
        <div className="mb-1.5 w-[calc(100%+4rem)] border-b border-[#f0f0f0] pt-2.5 pb-3">
          {subtasks.length > 0 && (
            <div className="mb-0">
              <SortableContext items={subtasks.map((subtask) => subtask.id)} strategy={verticalListSortingStrategy}>
                {subtasks.map((subtask) => (
                  <SubtaskEditor key={subtask.id} subtask={subtask} />
                ))}
              </SortableContext>
            </div>
          )}
          <Button
            variant="secondary"
            className="w-full justify-start rounded-none bg-transparent pl-4 text-[#b9b9b9] hover:bg-transparent hover:text-[#2ca7ff] active:translate-y-0!"
            onClick={handleAddSubtask}
          >
            <div className="w-2" /> {/* Spacer to align with status icons */}
            <PlusCircle className="mr-3 size-5.5" strokeWidth={1.5} />
            Add subtask
          </Button>
        </div>
        {notionPageId && <NotionTaskProperties pageId={notionPageId} />}
        {gmailMessageId && gmailBodyHtml && <GmailTaskProperties messageId={gmailMessageId} bodyHtml={gmailBodyHtml} />}
        {!notionPageId && (!gmailMessageId || !gmailBodyHtml) && <TaskDescription />}
        {taskId && mode === "update" && <CommentSection taskId={taskId} />}
      </div>

      {activeSubtask && (
        <DragOverlay dropAnimation={null}>
          <SubtaskEditorOverlay subtask={activeSubtask} />
        </DragOverlay>
      )}
    </DndProvider>
  );
}
