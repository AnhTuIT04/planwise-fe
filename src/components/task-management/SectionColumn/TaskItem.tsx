// components/task-management/SectionColumn/TaskItem.tsx
import { ITask } from "@/types/task.type";
import { format } from "date-fns";

interface TaskItemProps {
  task: ITask;
  onClick: (task: ITask) => void;
  onDragStart: (e: React.DragEvent) => void;
  onDragEnd: () => void;
  onToggleStatus: () => void;
  onDragOver: (e: React.DragEvent) => void;
}

export default function TaskItem({
  task,
  onClick,
  onDragStart,
  onDragEnd,
  onToggleStatus,
  onDragOver,
}: TaskItemProps) {
  return (
    <div
      className="task-item cursor-move rounded border bg-white p-3 hover:shadow-sm transition-shadow"
      draggable
      onClick={() => onClick(task)}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
    >
      <div className="flex justify-between items-start">
        <span className="font-medium text-sm">{task.title}</span>
        {task.startDate && (
          <span className="text-xs text-gray-500">
            {format(new Date(task.startDate), "HH:mm")}
          </span>
        )}
      </div>

      {task.subTask?.length > 0 && (
        <div className="mt-2 space-y-1">
          {task.subTask.map(st => (
            <div key={st.id} className="flex items-center gap-2 text-xs">
              <div
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                  st.status === "DONE" ? "bg-green-500 border-green-500" : "border-gray-400 bg-white"
                }`}
              >
                {st.status === "DONE" && (
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className={st.status === "DONE" ? "line-through text-gray-500" : ""}>
                {st.title}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="mt-2 flex justify-between items-center">
        <span className="text-xs px-2 py-1 bg-gray-100 rounded">{task.priority}</span>
        <button
          onClick={e => {
            e.stopPropagation();
            onToggleStatus();
          }}
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
            task.status === "DONE" ? "bg-green-500 border-green-500" : "border-gray-400"
          }`}
        >
          {task.status === "DONE" && (
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}