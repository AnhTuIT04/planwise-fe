import { useState } from "react";
import { Loader2 } from "lucide-react";

import { ITask } from "@/types/task.type";
import TaskPriority from "./task-priority";
import TaskEstimateTime from "./task-estimate-time";

interface TaskItemProps {
  task: ITask;
  // onClick: (task: ITask) => void;
  // onDragStart: (e: React.DragEvent) => void;
  // onDragEnd: () => void;
  // onToggleStatus: () => void;
  // onDragOver: (e: React.DragEvent) => void;
}

export default function TaskItem({ task }: TaskItemProps) {
  const [taskEditing, setTaskEditing] = useState(false);

  const handleToggleTaskStatus = async () => {
    setTaskEditing(true);
    await new Promise((r) => setTimeout(r, 500));
    setTaskEditing(false);
  };

  return (
    <div
      className="cursor-pointer rounded border bg-white p-3 shadow-[0_1px_1px_#0000001a] transition-shadow hover:border-[#dcdcdc] hover:shadow-[0_3px_6px_#0000001a]"
      draggable
    >
      <div className="mb-1 flex items-start justify-between">
        <TaskPriority taskId={task.id} priority={task.priority} />
        <TaskEstimateTime taskId={task.id} timeEstimate={task.timeEstimate} timeSpent={task.timeSpent} />
      </div>

      <span className="text-[14px] font-normal text-[#413f39]">{task.title}</span>

      {task.subTask?.length > 0 && (
        <div className="my-2 ml-px space-y-1">
          {task.subTask.map((st) => (
            <SubTask key={st.id} subTask={st} />
          ))}
        </div>
      )}

      <div className="mt-2 flex items-center justify-between">
        {taskEditing ? (
          <Loader2 className="h-4.5 w-4.5 animate-spin text-[#2ca7ff]" />
        ) : (
          <button
            onClick={handleToggleTaskStatus}
            className={`group flex h-4.5 w-4.5 items-center justify-center rounded-full border-2 transition-colors ${
              task.status === "DONE"
                ? "border-green-500 bg-green-500"
                : "border-[#b9b9b9] bg-white hover:border-green-500"
            }`}
          >
            <svg
              className={`h-3.5 w-3.5 ${task.status === "DONE" ? "text-white" : "text-[#b9b9b9] group-hover:text-green-500"}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

function SubTask({ subTask }: { subTask: ITask }) {
  const [subTaskEditing, setSubTaskEditing] = useState(false);

  const handleToggleSubTaskStatus = async () => {
    setSubTaskEditing(true);
    await new Promise((r) => setTimeout(r, 500));
    setSubTaskEditing(false);
  };

  return (
    <button className="flex items-center gap-2 text-xs">
      {subTaskEditing ? (
        <Loader2 className="h-4 w-4 animate-spin text-[#2ca7ff]" />
      ) : (
        <div
          className={`group flex h-4 w-4 cursor-pointer items-center justify-center rounded-full border-2 transition-all ${
            subTask.status === "DONE"
              ? "border-green-500 bg-green-500"
              : "border-[#b9b9b9] bg-white hover:border-green-500"
          }`}
          onClick={handleToggleSubTaskStatus}
        >
          <svg
            className={`h-2.5 w-2.5 ${subTask.status === "DONE" ? "text-white" : "text-[#b9b9b9] group-hover:text-green-500"}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
      <span>{subTask.title}</span>
    </button>
  );
}
