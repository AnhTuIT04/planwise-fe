import React from "react";
import { DragOverlay, useDndMonitor } from "@dnd-kit/core";
import { SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable";
import { Loader2 } from "lucide-react";

import { useTaskQueryStore } from "@/stores/task-query.store";
import { useSection } from "@/hooks/use-section";
import { useTaskDnd } from "@/hooks/use-task-dnd";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import SectionKanban from "@/components/section/kanban";
import AddSectionButton from "@/components/section/kanban/add-section-button";
import SectionKanbanOverlay from "@/components/section/kanban/overlay";
import TaskItemOverlay from "@/components/task/kanban/overlay";
import ProjectKanbanSkeleton from "./skeleton";
import ProjectHeader from "../header";
import { ProjectContentSkeleton } from "../skeleton";

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

  useDndMonitor({
    onDragStart: handleDragStart,
    onDragOver: handleDragOver,
    onDragEnd: handleDragEnd,
  });

  const loadMoreRef = useInfiniteScroll<HTMLDivElement>({
    enabled: !!sectionsQuery.hasNextPage,
    isLoading: sectionsQuery.isFetchingNextPage,
    onLoadMore: () => sectionsQuery.fetchNextPage(),
  });

  if (sectionsQuery.isLoading) {
    return <ProjectContentSkeleton />;
  }

  return (
    <React.Fragment>
      <SortableContext items={sectionsQuery.data.map((section) => section.id)} strategy={horizontalListSortingStrategy}>
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

      {sectionsQuery.hasNextPage && (
        <div ref={loadMoreRef} className="flex w-64 min-w-64 items-center justify-center">
          {sectionsQuery.isFetchingNextPage ? <Loader2 className="h-5 w-5 animate-spin text-gray-400" /> : null}
        </div>
      )}

      <AddSectionButton projectId={projectId} />

      {activeItem && (
        <DragOverlay dropAnimation={null}>
          {activeItem.type === "section" && <SectionKanbanOverlay section={activeItem.data} />}
          {activeItem.type === "task" && <TaskItemOverlay projectId={projectId} task={activeItem.data} />}
        </DragOverlay>
      )}
    </React.Fragment>
  );
}
