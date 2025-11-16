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

export default function TaskItem({ task, onClick, onDragStart, onDragEnd, onToggleStatus, onDragOver }: TaskItemProps) {
  return (
    <div
      className="task-item cursor-move rounded border bg-white p-3 transition-shadow hover:shadow-sm"
      draggable
      onClick={() => onClick(task)}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
    >
      <div className="flex items-start justify-between">
        <span className="text-sm font-medium">{task.title}</span>
        {task.startDate && <span className="text-xs text-gray-500">{format(new Date(task.startDate), "HH:mm")}</span>}
      </div>

      {task.subTask?.length > 0 && (
        <div className="mt-2 space-y-1">
          {task.subTask.map((st) => (
            <div key={st.id} className="flex items-center gap-2 text-xs">
              <div
                className={`flex h-4 w-4 items-center justify-center rounded-full border-2 transition-all ${
                  st.status === "DONE" ? "border-green-500 bg-green-500" : "border-gray-400 bg-white"
                }`}
              >
                {st.status === "DONE" && (
                  <svg className="h-3 w-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className={st.status === "DONE" ? "text-gray-500 line-through" : ""}>{st.title}</span>
            </div>
          ))}
        </div>
      )}

      <div className="mt-2 flex items-center justify-between">
        <span className="rounded bg-gray-100 px-2 py-1 text-xs">{task.priority}</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleStatus();
          }}
          className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors ${
            task.status === "DONE" ? "border-green-500 bg-green-500" : "border-gray-400"
          }`}
        >
          {task.status === "DONE" && (
            <svg className="h-3 w-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
