"use client";

import { useState } from "react";
import { useDndMonitor } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { useTaskQueryStore } from "@/stores/task-query.store";
import { useTask } from "@/hooks/use-task";
import { useTaskModalStore } from "@/stores/task-modal.store";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { IBasicSection } from "@/types/section.type";
import AddTaskButton from "@/components/task/kanban/add-task-button";
import TaskRow from "@/components/task/list/task-row";
import SectionListHeader from "./header";

interface SectionListProps {
  position: number;
  section: IBasicSection;
  projectId: string;
  isPersonal: boolean;
}

export default function SectionList({ position, section, projectId, isPersonal }: SectionListProps) {
  const [expanded, setExpanded] = useState(true);

  const deadlineFrom = useTaskQueryStore((state) => state.getQuery(projectId).deadlineFrom);
  const deadlineTo = useTaskQueryStore((state) => state.getQuery(projectId).deadlineTo);

  const tasksQuery = useTask(projectId, section.id, {
    deadlineFrom,
    deadlineTo,
  });
  const { openModal: openAddTaskModal } = useTaskModalStore();

  const taskLoadMoreRef = useInfiniteScroll<HTMLDivElement>({
    enabled: !!tasksQuery.hasNextPage,
    isLoading: tasksQuery.isFetchingNextPage,
    onLoadMore: () => tasksQuery.fetchNextPage(),
  });

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: section.id,
    data: {
      type: "section",
      data: {
        ...section,
        position,
      },
    },
  });

  useDndMonitor({
    onDragEnd: (event) => {
      if (
        event.active.data.current?.type === "task" &&
        event.over?.id === section.id &&
        !expanded
      ) {
        setExpanded(true);
      }
    },
  });

  const handleAddTaskBtnClick = () => {
    openAddTaskModal({
      mode: "add",
      projectId,
      sectionId: section.id,
      position: tasksQuery.data.length,
    });
  };

  return (
    <section
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={cn(
        "dnd-item flex flex-col border-b border-[#e8e8e8] select-none",
        isDragging && "will-change-transform opacity-60",
      )}
    >
      <SectionListHeader
        isDragging={isDragging}
        expanded={expanded}
        onToggleExpand={() => setExpanded((prev) => !prev)}
        projectId={projectId}
        section={section}
        dragHandleAttributes={attributes}
        dragHandleListeners={listeners}
      />

      {expanded && (
        <div className="bg-white">
          <div className="grid grid-cols-[24px_1fr_88px_104px_120px_96px_24px] items-center gap-3 border-b border-[#f0f0f0] bg-[#fafafa] px-3 py-1.5 text-[11px] font-medium tracking-wide text-[#787878] uppercase">
            <span />
            <span>Task</span>
            <span>Priority</span>
            <span>Time</span>
            <span>Due date</span>
            <span>Assignees</span>
            <span />
          </div>

          {tasksQuery.data.length === 0 ? (
            <div className="px-3 py-3 text-[12px] text-[#b4b4b4]">No tasks</div>
          ) : (
            <SortableContext
              items={tasksQuery.data.map((task) => task.id)}
              strategy={verticalListSortingStrategy}
            >
              {tasksQuery.data.map((task, idx) => (
                <TaskRow
                  key={task.id}
                  position={idx}
                  task={task}
                  projectId={projectId}
                  sectionId={section.id}
                  isPersonal={isPersonal}
                />
              ))}
            </SortableContext>
          )}

          {tasksQuery.hasNextPage && (
            <div ref={taskLoadMoreRef} className="flex justify-center py-2">
              {tasksQuery.isFetchingNextPage ? (
                <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
              ) : null}
            </div>
          )}

          <div className="px-3 py-2">
            <AddTaskButton type="always_show" onClick={handleAddTaskBtnClick} />
          </div>
        </div>
      )}
    </section>
  );
}
