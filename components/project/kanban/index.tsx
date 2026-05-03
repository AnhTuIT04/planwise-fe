import React from "react";
import { DragOverlay } from "@dnd-kit/core";
import { SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable";

import { useTaskQueryStore } from "@/stores/task-query.store";
import { useSection } from "@/hooks/use-section";
import { useTaskDnd } from "@/hooks/use-task-dnd";
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

export default function ProjectKanban({ projectId, isPersonal }: ProjectKanbanProps) {
  const query = useTaskQueryStore((s) => (projectId ? s.queries[projectId] : undefined));

  const sectionsQuery = useSection(projectId, {
    deadlineFrom: query?.deadlineFrom,
    deadlineTo: query?.deadlineTo,
    sections: query?.sections?.sort() ?? [],
  });

  const { activeItem, handleDragStart, handleDragOver, handleDragEnd } = useTaskDnd({
    projectId,
    sections: sectionsQuery.data,
  });

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
