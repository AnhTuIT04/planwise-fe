import { GripVertical } from "lucide-react";

import { cn } from "@/lib/utils";
import { ISubtask } from "@/types/task.type";
import { DONEIcon, TODOIcon } from "@/components/task/kanban/task-status-icon";

export default function SubtaskEditorOverlay({ subtask }: { subtask: ISubtask }) {
  const isTempSubtask = subtask.id.startsWith("temp-");

  return (
    <div className="dnd-item group/task grid w-full grid-cols-[minmax(0,3fr)_minmax(0,1fr)_1rem] items-start py-1 pr-2 pl-8 opacity-50 hover:bg-[#f7f8fa]">
      <button className="mt-1.5 mr-3 flex w-4 cursor-pointer justify-center border-none outline-none">
        <GripVertical className="invisible size-3.5 text-[#787878] group-hover/task:visible" />
      </button>

      <div className="flex min-w-0 items-start pr-2">
        <div
          className={cn(
            isTempSubtask && "invisible",
            "mt-0.75 mr-4 flex size-5 cursor-pointer items-center justify-center self-start rounded-full transition-all",
          )}
        >
          {subtask.status !== "DONE" ? <DONEIcon /> : <TODOIcon />}
        </div>

        <span
          dangerouslySetInnerHTML={{ __html: subtask.title }}
          className="w-full max-w-108 min-w-0 pt-0.5 pr-0 pl-0.5 text-[14px] leading-5 font-medium text-[#413f39]"
        />
      </div>

      <div className="mt-0.5 grid min-w-0 grid-cols-3 items-start px-2" />

      <div className="mt-1.5 flex w-4 cursor-pointer justify-center">
        <i className="invisible size-3.5 text-[#787878]" />
      </div>
    </div>
  );
}
