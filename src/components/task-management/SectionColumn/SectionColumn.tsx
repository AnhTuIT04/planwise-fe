// components/task-management/SectionColumn/SectionColumn.tsx (Cập nhật để reorder trong section)
import AddTaskButton from "./AddTaskButton";
import TaskItem from "./TaskItem";
import { ISection } from "@/types/section.type";
import { ITask } from "@/types/task.type";

interface SectionColumnProps {
  section: ISection;
  tasks: ITask[];
  isDropTarget: boolean;
  dropPosition: "before" | "after" | null;
  dropTaskId: string | null | undefined;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onAddTask: () => void;
  onTaskClick: (task: ITask) => void;
  onDragStart: (task: ITask, sectionId: string) => (e: React.DragEvent) => void;
  onDragOverTask: (sectionId: string, taskId: string) => (e: React.DragEvent) => void;
  onDragEnd: () => void;
  onToggleStatus: (taskId: string) => void;
}

export default function SectionColumn({
  section,
  tasks,
  onDragOver,
  onDrop,
  onAddTask,
  onTaskClick,
  onDragStart,
  onDragOverTask,
  onDragEnd,
  onToggleStatus,
  dropTaskId,
  dropPosition,
}: SectionColumnProps) {
  return (
    <div
      className="rounded-lg border bg-white p-4 transition-all"
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <h2 className="mb-3 font-semibold">{section.name}</h2>
      <AddTaskButton onClick={onAddTask} />

      <div className="space-y-2 mt-3">
        {tasks
          .sort((a, b) => {
            const order = section.listOfTask.split(",").filter(Boolean);
            const aIndex = order.indexOf(a.id);
            const bIndex = order.indexOf(b.id);
            return (aIndex === -1 ? Infinity : aIndex) - (bIndex === -1 ? Infinity : bIndex);
          })
          .map(task => {
            const isBefore = dropTaskId === task.id && dropPosition === "before";
            const isAfter = dropTaskId === task.id && dropPosition === "after";

            return (
              <div
                key={task.id}
                className={`relative ${isBefore ? "border-t-4 border-blue-500 pt-2" : ""} ${isAfter ? "border-b-4 border-blue-500 pb-2" : ""}`}
              >
                <TaskItem
                  task={task}
                  onClick={onTaskClick}
                  onDragStart={onDragStart(task, section.id)}
                  onDragEnd={onDragEnd}
                  onToggleStatus={() => onToggleStatus(task.id)}
                  onDragOver={onDragOverTask(section.id, task.id)}
                />
              </div>
            );
          })}
      </div>
    </div>
  );
}