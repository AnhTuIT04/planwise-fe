import { Pause, Play } from "lucide-react";

import { cn } from "@/lib/utils";
import { useTaskMutations } from "@/hooks/use-task";
import { useTaskModalStore } from "@/stores/task-modal.store";
import { DONEIcon, TODOIcon } from "@/components/task/kanban/task-status-icon";
import TaskEstimateTime from "@/components/task/kanban/task-estimate-time";
import SpentTime from "./spent-time";
import TitleEditor from "./title-editor";

export default function TaskEditor() {
  const mode = useTaskModalStore((s) => s.mode);
  const sectionId = useTaskModalStore((s) => s.task.sectionId);
  const taskId = useTaskModalStore((s) => s.task.id);
  const title = useTaskModalStore((s) => s.task.title);
  const status = useTaskModalStore((s) => s.task.status);
  const spent = useTaskModalStore((s) => s.task.spent);
  const lastStarted = useTaskModalStore((s) => s.task.lastStarted);
  const estimate = useTaskModalStore((s) => s.task.estimate);
  const subtasks = useTaskModalStore((s) => s.task.subtasks);
  const setModalData = useTaskModalStore((s) => s.setModalData);
  const setField = useTaskModalStore((s) => s.setField);
  const setStatus = useTaskModalStore((s) => s.setStatus);

  const { updateTaskMutation, updateTaskStatusMutation } = useTaskMutations();

  const handleChangeTitle = async (newTitle: string) => {
    if (mode === "update" && newTitle !== title) {
      try {
        const data = await updateTaskMutation.mutateAsync({
          taskId,
          sectionId,
          title: newTitle,
        });

        setModalData(data);
      } catch (error) {
        console.log("Failed to change title:", error);
      }

      return;
    }

    setField("title", newTitle);
  };

  const handleToggleStatus = async (type: "TODO_DONE" | "TODO_RUNNING") => {
    let newStatus: "TODO" | "RUNNING" | "DONE";
    if (type === "TODO_DONE") {
      newStatus = status !== "DONE" ? "DONE" : "TODO";
    } else {
      newStatus = status === "RUNNING" ? "TODO" : "RUNNING";
    }

    if (mode === "update") {
      try {
        const data = await updateTaskStatusMutation.mutateAsync({
          taskId,
          sectionId,
          status: newStatus,
        });

        setModalData(data);
      } catch (error) {
        console.log("Failed to change status:", error);
      }

      return;
    }

    setStatus(newStatus);
  };

  const handleChangeEstimateTime = async (newEstimateTime: number) => {
    if (mode === "update" && newEstimateTime !== estimate) {
      try {
        const data = await updateTaskMutation.mutateAsync({
          taskId,
          sectionId,
          estimate: newEstimateTime,
        });

        setModalData(data);
      } catch (error) {
        console.log("Failed to change estimate time:", error);
      }

      return;
    }

    setField("estimate", newEstimateTime);
  };

  return (
    <div
      className={cn(
        "mt-13 grid w-[calc(100%+4rem)] grid-cols-[minmax(0,3fr)_minmax(0,1fr)_1rem] items-start pr-2 pl-8",
      )}
    >
      <div className="flex min-w-0 items-start pr-2">
        <div
          className="mt-1.25 mr-2 flex size-8 cursor-pointer items-center justify-center self-start rounded-full transition-all"
          onClick={() => handleToggleStatus("TODO_DONE")}
        >
          {status !== "DONE" ? <DONEIcon /> : <TODOIcon />}
        </div>

        <TitleEditor
          title={title}
          setTitle={handleChangeTitle}
          placeholder="Task title..."
          className="w-full max-w-108 min-w-0 pt-1.75 pr-0 pl-0.5 text-[24px] leading-7 font-semibold text-[#413f39]"
        />
      </div>

      <div className="mt-3 grid min-w-0 grid-cols-3 items-start px-2">
        <div
          className={cn("flex justify-center", (mode === "add" || status === "DONE") && "invisible")}
          onClick={() => handleToggleStatus("TODO_RUNNING")}
        >
          {status === "RUNNING" ? (
            <Pause className="size-5 cursor-pointer text-[#b4b4b4] hover:text-[#413f39] hover:opacity-80" />
          ) : (
            <Play className="size-5 cursor-pointer text-[#b4b4b4] hover:text-[#413f39] hover:opacity-80" />
          )}
        </div>

        <div className="relative flex justify-center">
          <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[8px] text-[#787878]">ACTUAL</span>
          <SpentTime spentTime={spent} lastStarted={lastStarted} running={status === "RUNNING"} />
        </div>

        <div className="relative flex justify-center">
          <TaskEstimateTime
            className={cn(
              "inline-flex items-center justify-center overflow-hidden bg-transparent px-2 py-1.5 hover:bg-[#f7f8fa] hover:opacity-80",
              subtasks.length !== 0 && "cursor-default hover:bg-transparent hover:opacity-100",
            )}
            estimate={estimate}
            onChangeEstimateTime={handleChangeEstimateTime}
            changeable={subtasks.length === 0}
          />
          <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[8px] text-[#787878]">ESTIMATE</span>
        </div>
      </div>

      <div className="w-4" />
    </div>
  );
}
