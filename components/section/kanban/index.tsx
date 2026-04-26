import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { cn } from "@/lib/utils";
import { useTaskQueryStore } from "@/stores/task-query.store";
import { useTask } from "@/hooks/use-task";
import { useTaskModalStore } from "@/stores/task-modal.store";
import { IBasicSection } from "@/types/section.type";
import AddTaskButton from "@/components/task/kanban/add-task-button";
import TaskItem from "@/components/task/kanban/task-item";
import SectionKanbanHeader from "./header";

interface SectionKanbanProps {
  position: number;
  section: IBasicSection;
  projectId: string;
  isPersonal: boolean;
}

export default function SectionKanban({ position, section, projectId, isPersonal }: SectionKanbanProps) {
  const deadlineFrom = useTaskQueryStore((state) => state.getQuery(projectId).deadlineFrom);
  const deadlineTo = useTaskQueryStore((state) => state.getQuery(projectId).deadlineTo);

  const tasksQuery = useTask(projectId, section.id, {
    deadlineFrom,
    deadlineTo,
  });
  const { openModal: openAddTaskModal } = useTaskModalStore();

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

  const handleAddTaskBtnClick = (position?: number) => {
    openAddTaskModal({
      mode: "add",
      projectId,
      sectionId: section.id,
      position: position || 0,
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
        "dnd-item flex h-full min-h-0 w-64 min-w-64 flex-col select-none",
        isDragging && "will-change-transform",
      )}
    >
      <SectionKanbanHeader
        isDragging={isDragging}
        projectId={projectId}
        section={section}
        dragHandleAttributes={attributes}
        dragHandleListeners={listeners}
      />

      <div className="flex min-h-0 flex-1 flex-col p-2">
        <AddTaskButton type="always_show" onClick={() => handleAddTaskBtnClick()} />

        <div className="min-h-0 overflow-y-auto">
          <SortableContext items={tasksQuery.data.map((task) => task.id)} strategy={verticalListSortingStrategy}>
            {tasksQuery.data.map((task, idx) => (
              <div key={task.id}>
                <TaskItem
                  position={idx}
                  task={task}
                  projectId={projectId}
                  sectionId={section.id}
                  isPersonal={isPersonal}
                />
                <AddTaskButton type="hover_show" onClick={() => handleAddTaskBtnClick(idx + 1)} />
              </div>
            ))}
          </SortableContext>
        </div>
      </div>
    </section>
  );
}
