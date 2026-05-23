import React from "react";
import { DragOverlay, useDndMonitor } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Loader2 } from "lucide-react";

import { useTaskQueryStore } from "@/stores/task-query.store";
import { useSection } from "@/hooks/use-section";
import { useTaskDnd } from "@/hooks/use-task-dnd";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import SectionList from "@/components/section/list";
import AddSectionButton from "@/components/section/kanban/add-section-button";
import SectionListOverlay from "@/components/section/list/overlay";
import TaskRowOverlay from "@/components/task/list/task-row-overlay";
import ProjectHeader from "@/components/project/header";
import ProjectListSkeleton from "./skeleton";

interface ProjectListProps {
  projectId: string;
  isPersonal: boolean;
}

export default function ProjectList({ projectId, isPersonal }: ProjectListProps) {
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

  useDndMonitor({
    onDragStart: handleDragStart,
    onDragOver: handleDragOver,
    onDragEnd: handleDragEnd,
  });

  const sectionLoadMoreRef = useInfiniteScroll<HTMLDivElement>({
    enabled: !!sectionsQuery.hasNextPage,
    isLoading: sectionsQuery.isFetchingNextPage,
    onLoadMore: () => sectionsQuery.fetchNextPage(),
  });

  return (
    <React.Fragment>
      <div className="flex h-full min-h-0 flex-col overflow-hidden">
        <ProjectHeader projectId={projectId} />

        <main className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          {sectionsQuery.isLoading ? (
            <ProjectListSkeleton />
          ) : (
            <React.Fragment>
              <SortableContext
                items={sectionsQuery.data.map((section) => section.id)}
                strategy={verticalListSortingStrategy}
              >
                {sectionsQuery.data.map((section, idx) => (
                  <SectionList
                    key={section.id}
                    position={idx}
                    section={section}
                    projectId={projectId}
                    isPersonal={isPersonal}
                  />
                ))}
              </SortableContext>

              {sectionsQuery.hasNextPage && (
                <div ref={sectionLoadMoreRef} className="flex justify-center py-3">
                  {sectionsQuery.isFetchingNextPage ? (
                    <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                  ) : null}
                </div>
              )}

              <div className="px-3 py-2">
                <AddSectionButton projectId={projectId} />
              </div>
            </React.Fragment>
          )}
        </main>
      </div>

      {activeItem && (
        <DragOverlay dropAnimation={null}>
          {activeItem.type === "section" && <SectionListOverlay section={activeItem.data} />}
          {activeItem.type === "task" && <TaskRowOverlay projectId={projectId} task={activeItem.data} />}
        </DragOverlay>
      )}
    </React.Fragment>
  );
}
