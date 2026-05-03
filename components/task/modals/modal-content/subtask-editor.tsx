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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserPlus } from "lucide-react";
import { useAssignTaskModalStore } from "@/stores/assign-task-modal.store";
import { IBasicUser } from "@/types/user.type";
import { useMembers } from "@/hooks/use-members-management";
import { useAuth } from "@/hooks/use-auth";

export default function SubtaskEditor({ subtask }: { subtask: ISubtask }) {
  const { user: currentUser } = useAuth();
  const mode = useTaskModalStore((s) => s.mode);
  const sectionId = useTaskModalStore((s) => s.task.sectionId);
  const taskId = useTaskModalStore((s) => s.task.id);
  const setModalData = useTaskModalStore((s) => s.setModalData);
  const deleteSubtask = useTaskModalStore((s) => s.deleteSubtask);
  const setSubtaskField = useTaskModalStore((s) => s.setSubtaskField);
  const setSubtaskStatus = useTaskModalStore((s) => s.setSubtaskStatus);
  const projectId = useTaskModalStore((s) => s.task.projectId);
  const openAssignModal = useAssignTaskModalStore((s) => s.openModal);
  const isTempSubtask = subtask.id.startsWith("temp-");
  const [isDeleting, setIsDeleting] = useState(false);
  const {members} = useMembers(projectId, "", 1, 10);

  const { updateSubtaskMutation, updateSubtaskStatusMutation, deleteSubtaskMutation, createSubtaskMutation } = useSubtaskMutations();

  const isMyTasksPage = projectId === currentUser?.workspaceId;
  const canEditAssignees = !isMyTasksPage;

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

  const handleOpenAssignModal = () => {
    if (!canEditAssignees) return;

    openAssignModal({
      task: subtask as any,
      projectId,
      member: members || [],
      isSubtask: true,
      previousTask: useTaskModalStore.getState().task,
    });
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={cn(
        "dnd-item group/task grid w-full grid-cols-[16px_32px_minmax(0,1fr)_80px_260px_32px] items-center py-1 pr-2 pl-4 hover:bg-[#f7f8fa]",
        isDragging && "bg-[#f7f8fa] will-change-transform",
      )}
    >
      {/* Column 1: Drag handle */}
      <button
        {...attributes}
        {...listeners}
        className={cn(
          "flex w-8 cursor-pointer justify-center border-none outline-none",
          isTempSubtask && "invisible",
        )}
      >
        <GripVertical
          className={cn("invisible size-3.5 text-[#787878]", !isTempSubtask && "group-hover/task:visible")}
        />
      </button>

      {/* Column 2: Status Icon */}
      <div
        className={cn(
          isTempSubtask && "invisible",
          "flex size-8 cursor-pointer items-center justify-start rounded-full transition-all",
        )}
        onClick={() => handleToggleSubtaskStatus("TODO_DONE")}
      >
        {subtask.status !== "DONE" ? <DONEIcon className="size-5" /> : <TODOIcon className="size-5" />}
      </div>

      {/* Column 3: Title */}
      <div className="min-w-0">
        <TitleEditor
          title={subtask.title}
          setTitle={handleChangeTitle}
          placeholder="Subtask"
          className="w-full min-w-0 text-[14px] leading-5 font-medium text-[#413f39] text-start "
        />
      </div>

      {/* Column 4: Assignees */}
      <div className="flex justify-center px-2">
        {(!isMyTasksPage || (subtask.assignees && subtask.assignees.length > 0)) && (
          <TooltipProvider>
            <div className="flex -space-x-1.5">
              {subtask.assignees && subtask.assignees.length > 0 && (
                <>
                  {subtask.assignees.slice(0, 2).map((user: IBasicUser) => (
                    <Tooltip key={user.id}>
                      <TooltipTrigger asChild>
                        <Avatar
                          className={cn(
                            "h-6 w-6 border border-white transition-transform hover:z-10 hover:scale-110",
                            canEditAssignees && "cursor-pointer"
                          )}
                          onClick={canEditAssignees ? handleOpenAssignModal : undefined}
                        >
                          <AvatarImage src={user.avatarUrl || undefined} alt={user.fullname} />
                          <AvatarFallback className="bg-blue-500 text-[10px] text-white">
                            {user.fullname.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">{user.fullname}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                  {subtask.assignees.length > 2 && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Avatar
                          className={cn(
                            "h-6 w-6 border border-white transition-transform hover:z-10 hover:scale-110",
                            canEditAssignees && "cursor-pointer"
                          )}
                          onClick={canEditAssignees ? handleOpenAssignModal : undefined}
                        >
                          <AvatarFallback className="bg-gray-500 text-[10px] text-white">
                            +{subtask.assignees.length - 2}
                          </AvatarFallback>
                        </Avatar>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">{subtask.assignees.length - 2} more</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </>
              )}
              
              {canEditAssignees && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={handleOpenAssignModal}
                      className="ml-2 flex h-6 w-6 items-center justify-center rounded-full border border-dashed border-gray-300 transition-colors hover:border-gray-400 hover:bg-gray-50"
                    >
                      <UserPlus className="size-3 text-gray-400" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Assign members</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </TooltipProvider>
        )}
      </div>

      {/* Column 5: Time Controls */}
      <div className="grid grid-cols-3 items-center px-2">
        <div
          className={cn(
            "invisible flex justify-center",
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

      {/* Column 6: Delete Action */}
      <button
        type="button"
        className="flex w-8 cursor-pointer justify-center border-none outline-none"
        onMouseDown={() => setIsDeleting(true)}
        onClick={handleDeleteSubtask}
      >
        <X className="invisible size-3.5 text-[#787878] group-hover/task:visible" />
      </button>
    </div>
  );
}
