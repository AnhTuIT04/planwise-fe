import AddTaskButton from "./AddSectionButton";
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
  onDragStart: (task: ITask, sectionId: string) => void;
  onToggleStatus: (taskId: string) => void;
  onDragOverTask: (sectionId: string, taskId: string) => (e: React.DragEvent) => void;
  onDragEnd: () => void;
}

export default function SectionColumn({
  section,
  tasks,
  isDropTarget,
  onDragOver,
  onDrop,
  onAddTask,
  onTaskClick,
  onDragStart,
  onToggleStatus,
  onDragOverTask,
  onDragEnd
}: SectionColumnProps) {
  return (
    <div
      className={`rounded-lg border bg-white p-4 transition-all ${isDropTarget ? "ring-2 ring-blue-500" : ""}`}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <h2 className="mb-3 font-semibold">{section.name}</h2>
      <AddTaskButton onClick={onAddTask} />
      <div className="space-y-2 mt-3">
        {tasks.map(task => (
          <TaskItem
            key={task.id}
            task={task}
            onClick={(e, task) => {
              e.stopPropagation();
              onTaskClick(task);
            }}
            onDragStart={() => onDragStart(task, section.id)}
            onDragEnd={onDragEnd}
            onToggleStatus={() => onToggleStatus(task.id)}
            onDragOver={onDragOverTask(section.id, task.id)}
          />
        ))}
      </div>
    </div>
  );
}