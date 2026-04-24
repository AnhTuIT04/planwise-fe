import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { DragEndEvent, DragOverlay, DragStartEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

import { useTaskModalStore } from "@/stores/task-modal.store";
import { ISubtask } from "@/types/task.type";
import DndProvider from "@/components/providers/dnd-provider";
import { Button } from "@/components/ui/button";
import TaskEditor from "./task-editor";
import SubtaskEditor from "./subtask-editor";
import TaskDescription from "./task-description";
import SubtaskEditorOverlay from "./subtask-editor-overlay";
import { useSubtaskMutations } from "@/hooks/use-subtask";

export default function TaskModalContent() {
  const sectionId = useTaskModalStore((s) => s.task.sectionId);
  const taskId = useTaskModalStore((s) => s.task.id);
  const subtasks = useTaskModalStore((state) => state.task.subtasks);
  const setModalData = useTaskModalStore((s) => s.setModalData);
  const addSubtask = useTaskModalStore((state) => state.addSubtask);

  const { moveSubtaskMutation } = useSubtaskMutations(sectionId, taskId);

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

  return (
    <DndProvider onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex w-full flex-col items-center">
        <TaskEditor />

        {subtasks.length > 0 && (
          <div className="mb-1.5 w-[calc(100%+4rem)] border-b border-[#f0f0f0] pt-2.5 pb-3">
            <SortableContext items={subtasks.map((subtask) => subtask.id)} strategy={verticalListSortingStrategy}>
              {subtasks.map((subtask) => (
                <SubtaskEditor key={subtask.id} subtask={subtask} />
              ))}
            </SortableContext>

            <Button
              variant="secondary"
              className="w-full justify-start rounded-none bg-transparent pl-8.25 text-[#b9b9b9] hover:bg-transparent hover:text-[#2ca7ff] active:translate-y-0!"
              onClick={() => addSubtask()}
            >
              <PlusCircle className="mr-2.75 size-5.5" strokeWidth={1.5} />
              Add subtask
            </Button>
          </div>
        )}

        <TaskDescription />
      </div>

      {activeSubtask && (
        <DragOverlay dropAnimation={null}>
          <SubtaskEditorOverlay subtask={activeSubtask} />
        </DragOverlay>
      )}
    </DndProvider>
  );
}
