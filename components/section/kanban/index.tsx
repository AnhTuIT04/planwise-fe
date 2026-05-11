import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { cn } from "@/lib/utils";
import { useTaskQueryStore } from "@/stores/task-query.store";
import { useTask, useTaskMutations } from "@/hooks/use-task";
import { useTaskModalStore } from "@/stores/task-modal.store";
import { IBasicSection } from "@/types/section.type";
import AddTaskButton from "@/components/task/kanban/add-task-button";
import TaskItem from "@/components/task/kanban/task-item";
import { useNotionIntegration } from "@/hooks/use-notion";
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
  const { importTask } = useNotionIntegration();
  const { createTaskMutation } = useTaskMutations();

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
  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const notionPageId = e.dataTransfer.getData("notionPageId") || e.dataTransfer.getData("text/plain");
    const gmailPayloadStr = e.dataTransfer.getData("application/x-planwise-gmail-message");
    const calendarPayloadStr = e.dataTransfer.getData("application/x-planwise-calendar-event");

    if (gmailPayloadStr) {
      try {
        const payload = JSON.parse(gmailPayloadStr);
        await createTaskMutation.mutateAsync({
          sectionId: section.id,
          title: payload.title,
          description: payload.description,
          gmailMessageId: payload.id,
          gmailBodyHtml: payload.bodyHtml,
          assigneeIds: [],
          subtasks: [],
        });
      } catch (err) {
        console.error("Failed to create task from Gmail:", err);
      }
      return;
    }

    if (calendarPayloadStr) {
      try {
        const payload = JSON.parse(calendarPayloadStr);

        let fullDescription = payload.description || "";
        if (payload.location) {
          fullDescription += `<p><strong>Location:</strong> ${payload.location}</p>`;
        }
        if (payload.attendees && payload.attendees.length > 0) {
          fullDescription += `<p><strong>Attendees:</strong> ${payload.attendees.join(", ")}</p>`;
        }

        await createTaskMutation.mutateAsync({
          sectionId: section.id,
          title: payload.title,
          description: fullDescription,
          calendarEventId: payload.id,
          deadline: payload.end,
          assigneeIds: [],
          subtasks: [],
        });
      } catch (err) {
        console.error("Failed to create task from Calendar:", err);
      }
      return;
    }

    if (notionPageId && notionPageId.length > 20 && projectId) {
      try {
        await importTask({
          notionPageId,
          projectId,
          sectionId: section.id,
        });
      } catch (error) {
        console.error("Failed to import task from Notion:", error);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
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
      onDrop={handleDrop}
      onDragOver={handleDragOver}
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
