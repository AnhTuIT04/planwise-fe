import { GripVertical, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { ISubtask } from "@/types/task.type";
import { DONEIcon, TODOIcon } from "@/components/task/kanban/task-status-icon";

export default function SubtaskEditorOverlay({ subtask }: { subtask: ISubtask }) {
  const isTempSubtask = subtask.id.startsWith("temp-");

  return (
    <div className="dnd-item grid w-full grid-cols-[16px_32px_minmax(0,1fr)_80px_260px_32px] items-center bg-[#f7f8fa] py-1 pr-2 pl-4 opacity-90 shadow-[0_3px_8px_#00000024]">
      <button className="flex w-8 cursor-pointer justify-center border-none outline-none">
        <GripVertical className="size-3.5 text-[#787878]" />
      </button>

      <div
        className={cn(
          isTempSubtask && "invisible",
          "flex size-8 items-center justify-start rounded-full",
        )}
      >
        {subtask.status === "DONE" ? <TODOIcon className="size-5" /> : <DONEIcon className="size-5" />}
      </div>

      <div className="min-w-0">
        <span
          dangerouslySetInnerHTML={{ __html: subtask.title }}
          className="block w-full min-w-0 truncate text-start text-[14px] leading-5 font-medium text-[#413f39]"
        />
      </div>

      <div />

      <div />

      <button className="flex w-8 cursor-pointer justify-center border-none outline-none">
        <X className="invisible size-3.5 text-[#787878]" />
      </button>
    </div>
  );
}
