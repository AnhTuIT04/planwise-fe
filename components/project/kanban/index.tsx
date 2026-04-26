import React, { useRef, useState } from "react";
import { DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent } from "@dnd-kit/core";
import { SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable";

import { IBasicSection } from "@/types/section.type";
import { ITask } from "@/types/task.type";
import { useTaskQueryStore } from "@/stores/task-query.store";
import { useSection, useSectionMutations } from "@/hooks/use-section";
import { useTaskMutations } from "@/hooks/use-task";
import DndProvider from "@/components/providers/dnd-provider";
import SectionKanban from "@/components/section/kanban";
import AddSectionButton from "@/components/section/kanban/add-section-button";
import SectionKanbanOverlay from "@/components/section/kanban/overlay";
import TaskItemOverlay from "@/components/task/kanban/overlay";
import ProjectHeader from "@/components/project/header";
import ProjectKanbanSkeleton from "./skeleton";

interface ProjectKanbanProps {
  projectId: string;
  isPersonal: boolean;
}

type ActiveSectionData = IBasicSection & { position: number };
type ActiveTaskData = ITask & { position: number; sectionId: string };
type ActiveItem = { type: "section"; data: ActiveSectionData } | { type: "task"; data: ActiveTaskData };

export default function ProjectKanban({ projectId, isPersonal }: ProjectKanbanProps) {
  const deadlineFrom = useTaskQueryStore((state) => state.getQuery(projectId).deadlineFrom);
  const deadlineTo = useTaskQueryStore((state) => state.getQuery(projectId).deadlineTo);

  const sectionsQuery = useSection(projectId, {
    deadlineFrom,
    deadlineTo,
  });

  const { moveSectionMutation } = useSectionMutations();
  const { moveTaskMutation, moveTaskOptimistic } = useTaskMutations();

  const [activeItem, setActiveItem] = useState<ActiveItem | null>(null);
  const crossSectionMoveFrameRef = useRef<number | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;

    if (crossSectionMoveFrameRef.current !== null) {
      cancelAnimationFrame(crossSectionMoveFrameRef.current);
      crossSectionMoveFrameRef.current = null;
    }

    setActiveItem(
      active.data.current
        ? {
            type: active.data.current.type,
            data: active.data.current.data,
          }
        : null,
    );
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) return;

    if (active.id !== over.id) {
      if (active.data.current?.type === "task") {
        const activeTask = active.data.current.data as ActiveTaskData;

        let toSectionId: string | null = null;
        let toPosition: number | null = null;

        if (over.data.current?.type === "task") {
          const overTask = over.data.current.data as ActiveTaskData;
          toSectionId = overTask.sectionId;

          if (activeTask.sectionId === toSectionId) return;

          const isBelowOverItem =
            active.rect.current.translated && active.rect.current.translated.top > over.rect.top + over.rect.height;
          const modifier = isBelowOverItem ? 1 : 0;

          toPosition = overTask.position >= 0 ? overTask.position + modifier : 0;
        } else if (over.data.current?.type === "section") {
          toSectionId = over.data.current.data.id;
          toPosition = 0;
        }

        if (crossSectionMoveFrameRef.current !== null || toSectionId === null || toPosition === null) return;

        const didMove = moveTaskOptimistic(activeTask.id, activeTask.sectionId, toSectionId, toPosition);
        if (!didMove) return;

        crossSectionMoveFrameRef.current = requestAnimationFrame(() => {
          crossSectionMoveFrameRef.current = null;
        });
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (crossSectionMoveFrameRef.current !== null) {
      cancelAnimationFrame(crossSectionMoveFrameRef.current);
      crossSectionMoveFrameRef.current = null;
    }

    if (!over) {
      if (active.data.current?.type === "task") {
        if (activeItem?.type === "task") {
          moveTaskOptimistic(
            active.id as string,
            active.data.current.data.sectionId,
            activeItem.data.sectionId,
            activeItem.data.position,
          );
        }
      }

      setActiveItem(null);
      return;
    }

    if (active.data.current?.type === "section" && over.data.current?.type === "section") {
      if (active.id !== over.id) {
        const oldIndex = sectionsQuery.data.findIndex((section) => section.id === active.id);
        const newIndex = sectionsQuery.data.findIndex((section) => section.id === over.id);

        if (oldIndex !== -1 && newIndex !== -1) {
          moveSectionMutation.mutate(
            {
              projectId,
              moveTo: newIndex,
              sectionId: active.id as string,
            },
            {
              onError: (error) => {
                console.log("Failed to move section:", error);
              },
            },
          );
        }
      }
    } else if (active.data.current?.type === "task" && over.data.current?.type === "task") {
      if (activeItem?.type === "task") {
        moveTaskMutation.mutate(
          {
            taskId: active.id as string,
            fromSectionId: activeItem.data.sectionId,
            toSectionId: over.data.current.data.sectionId,
            insertAt: over.data.current.data.position,
          },
          {
            onError: (error) => {
              console.log("Failed to move task:", error);
            },
          },
        );
      }
    }

    setActiveItem(null);
  };

  return (
    <DndProvider onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
      <div className="flex h-full min-h-0 flex-col overflow-hidden">
        <ProjectHeader projectId={projectId} />

        <main className="flex min-h-0 flex-1 overflow-x-auto overflow-y-hidden">
          {sectionsQuery.isLoading ? (
            <ProjectKanbanSkeleton />
          ) : (
            <React.Fragment>
              <SortableContext
                items={sectionsQuery.data.map((section) => section.id)}
                strategy={horizontalListSortingStrategy}
              >
                {sectionsQuery.data.map((section, idx) => (
                  <SectionKanban
                    key={section.id}
                    position={idx}
                    section={section}
                    projectId={projectId}
                    isPersonal={isPersonal}
                  />
                ))}
              </SortableContext>

              <AddSectionButton projectId={projectId} />
            </React.Fragment>
          )}
        </main>
      </div>

      {activeItem && (
        <DragOverlay dropAnimation={null}>
          {activeItem.type === "section" && <SectionKanbanOverlay section={activeItem.data} />}
          {activeItem.type === "task" && <TaskItemOverlay projectId={projectId} task={activeItem.data} />}
        </DragOverlay>
      )}
    </DndProvider>
  );
}
