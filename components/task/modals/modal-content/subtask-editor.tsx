import { useState } from "react";
import { GripVertical, Pause, Play, X } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { cn } from "@/lib/utils";
import { ISubtask } from "@/types/task.type";
import { useTaskModalStore } from "@/stores/task-modal.store";
import { useSubtaskMutations } from "@/hooks/use-subtask";
import { DONEIcon, TODOIcon } from "@/components/task/kanban/task-status-icon";
import TaskEstimateTime from "@/components/task/kanban/task-estimate-time";
import SpentTime from "./spent-time";
import TitleEditor from "./title-editor";

export default function SubtaskEditor({ subtask }: { subtask: ISubtask }) {
  const mode = useTaskModalStore((s) => s.mode);
  const sectionId = useTaskModalStore((s) => s.task.sectionId);
  const taskId = useTaskModalStore((s) => s.task.id);
  const setModalData = useTaskModalStore((s) => s.setModalData);
  const deleteSubtask = useTaskModalStore((s) => s.deleteSubtask);
  const setSubtaskField = useTaskModalStore((s) => s.setSubtaskField);
  const setSubtaskStatus = useTaskModalStore((s) => s.setSubtaskStatus);

  const isTempSubtask = subtask.id.startsWith("temp-");
  const [isDeleting, setIsDeleting] = useState(false);

  const { updateSubtaskMutation, updateSubtaskStatusMutation, deleteSubtaskMutation } = useSubtaskMutations();

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: subtask.id,
    data: {
      data: { ...subtask },
    },
  });

  const handleChangeTitle = async (newTitle: string) => {
    if (mode === "update" && !isDeleting && newTitle !== subtask.title) {
      try {
        const data = await updateSubtaskMutation.mutateAsync({
          sectionId,
          parentTaskId: taskId,
          subtaskId: subtask.id,
          title: newTitle,
        });

        setModalData(data);
      } catch (error) {
        console.log("Failed to update subtask title:", error);
      }

      return;
    }

    setSubtaskField(subtask.id, "title", newTitle);
  };

  const handleToggleSubtaskStatus = async (type: "TODO_DONE" | "TODO_RUNNING") => {
    let newStatus: "TODO" | "RUNNING" | "DONE";
    if (type === "TODO_DONE") {
      newStatus = subtask.status !== "DONE" ? "DONE" : "TODO";
    } else {
      newStatus = subtask.status === "RUNNING" ? "TODO" : "RUNNING";
    }

    if (mode === "update") {
      try {
        const data = await updateSubtaskStatusMutation.mutateAsync({
          sectionId,
          parentTaskId: taskId,
          subtaskId: subtask.id,
          status: newStatus,
        });

        setModalData(data);
      } catch (error) {
        console.log("Failed to update subtask status:", error);
      }

      return;
    }

    setSubtaskStatus(subtask.id, newStatus);
  };

  const handleChangeEstimateTime = async (newEstimateTime: number) => {
    if (mode === "update" && newEstimateTime !== subtask.estimate) {
      try {
        const data = await updateSubtaskMutation.mutateAsync({
          sectionId,
          parentTaskId: taskId,
          subtaskId: subtask.id,
          estimate: newEstimateTime,
        });

        setModalData(data);
      } catch (error) {
        console.log("Failed to update subtask estimate:", error);
      }

      return;
    }

    setSubtaskField(subtask.id, "estimate", newEstimateTime);
  };

  const handleDeleteSubtask = async () => {
    setIsDeleting(true);

    if (mode === "update") {
      try {
        const data = await deleteSubtaskMutation.mutateAsync({
          sectionId,
          parentTaskId: taskId,
          subtaskId: subtask.id,
        });

        setModalData(data);
      } catch (error) {
        console.log("Failed to delete subtask:", error);
      } finally {
        setIsDeleting(false);
      }

      return;
    }

    deleteSubtask(subtask.id);
    setIsDeleting(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={cn(
        "dnd-item group/task grid w-full grid-cols-[minmax(0,3fr)_minmax(0,1fr)_1rem] items-start py-1 pr-2 pl-8 hover:bg-[#f7f8fa]",
        isDragging && "bg-[#f7f8fa] will-change-transform",
      )}
    >
      <div className="flex min-w-0 items-start pr-2">
        <button
          {...attributes}
          {...listeners}
          className={cn(
            "mt-1.5 mr-3 -ml-6 flex w-4 cursor-pointer justify-center border-none outline-none",
            isTempSubtask && "invisible",
          )}
        >
          <GripVertical
            className={cn("invisible size-3.5 text-[#787878]", !isTempSubtask && "group-hover/task:visible")}
          />
        </button>

        <div
          className={cn(
            isTempSubtask && "invisible",
            "mt-0.75 mr-4 flex size-5 cursor-pointer items-center justify-center self-start rounded-full transition-all",
          )}
          onClick={() => handleToggleSubtaskStatus("TODO_DONE")}
        >
          {subtask.status !== "DONE" ? <DONEIcon /> : <TODOIcon />}
        </div>

        <TitleEditor
          title={subtask.title}
          setTitle={handleChangeTitle}
          placeholder="Subtask description..."
          className="w-full max-w-108 min-w-0 pt-0.5 pr-0 pl-0.5 text-[14px] leading-5 font-medium text-[#413f39]"
        />
      </div>

      <div className="mt-0.5 grid min-w-0 grid-cols-3 items-start px-2">
        <div
          className={cn(
            "invisible mt-0.5 -ml-1.25 flex justify-center",
            !isTempSubtask && subtask.status !== "DONE" && "group-hover/task:visible",
          )}
          onClick={() => handleToggleSubtaskStatus("TODO_RUNNING")}
        >
          {subtask.status === "RUNNING" ? (
            <Pause className="size-4 cursor-pointer text-[#b4b4b4] hover:text-[#413f39] hover:opacity-80" />
          ) : (
            <Play className="size-4 cursor-pointer text-[#b4b4b4] hover:text-[#413f39] hover:opacity-80" />
          )}
        </div>

        <div className="flex justify-center">
          <SpentTime
            spentTime={subtask.spent}
            lastStarted={subtask.lastStarted}
            running={subtask.status === "RUNNING"}
          />
        </div>

        <div className="flex justify-center">
          <TaskEstimateTime
            className={cn(
              "inline-flex items-center justify-center overflow-hidden bg-transparent px-2 py-1.5 hover:bg-[#f7f8fa] hover:opacity-80",
            )}
            estimate={subtask.estimate}
            onChangeEstimateTime={handleChangeEstimateTime}
            changeable
          />
        </div>
      </div>

      <button
        type="button"
        className="mt-1.5 flex w-4 cursor-pointer justify-center border-none outline-none"
        onMouseDown={() => setIsDeleting(true)}
        onClick={handleDeleteSubtask}
      >
        <X className="invisible size-3.5 text-[#787878] group-hover/task:visible" />
      </button>
    </div>
  );
}
