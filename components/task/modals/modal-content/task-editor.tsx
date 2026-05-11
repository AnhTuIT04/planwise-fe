import { Pause, Play } from "lucide-react";

import { cn } from "@/lib/utils";
import { useTaskMutations } from "@/hooks/use-task";
import { useTaskModalStore } from "@/stores/task-modal.store";
import { DONEIcon, TODOIcon } from "@/components/task/kanban/task-status-icon";
import TaskEstimateTime from "@/components/task/kanban/task-estimate-time";
import SpentTime from "./spent-time";
import TitleEditor from "./title-editor";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";  
import { useAssignTaskModalStore } from "@/stores/assign-task-modal.store";
import { IBasicUser } from "@/types/user.type";
import { useMembers } from "@/hooks/use-members-management";
import { useAuth } from "@/hooks/use-auth";

export default function TaskEditor() {
  const { user: currentUser } = useAuth();
  const mode = useTaskModalStore((s) => s.mode);
  const sectionId = useTaskModalStore((s) => s.task.sectionId);
  const taskId = useTaskModalStore((s) => s.task.id);
  const title = useTaskModalStore((s) => s.task.title);
  const status = useTaskModalStore((s) => s.task.status);
  const spent = useTaskModalStore((s) => s.task.spent);
  const lastStarted = useTaskModalStore((s) => s.task.lastStarted);
  const estimate = useTaskModalStore((s) => s.task.estimate);
  const assignees = useTaskModalStore((s) => s.task.assignees);
  const projectId = useTaskModalStore((s) => s.task.projectId);
  // const isPersonal = useTaskModalStore((s) => s.task.isPersonal);
  const subtasks = useTaskModalStore((s) => s.task.subtasks);
  const setModalData = useTaskModalStore((s) => s.setModalData);
  const setField = useTaskModalStore((s) => s.setField);
  const setStatus = useTaskModalStore((s) => s.setStatus);
  const openAssignModal = useAssignTaskModalStore((s) => s.openModal);
  const {members} = useMembers(projectId, "", 1, 10);

  const { updateTaskMutation, updateTaskStatusMutation } = useTaskMutations();

  const isMyTasksPage = projectId === currentUser?.workspaceId;
  const hasSubtasks = subtasks && subtasks.length > 0;
  const canEditAssignees = !isMyTasksPage && !hasSubtasks;

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

  const handleOpenAssignModal = () => {
    if (!canEditAssignees) return;
    
    openAssignModal({
      task: useTaskModalStore.getState().task,
      projectId,
      // isPersonal,
      member: members || [],
      isSubtask: false,
    });

};

  return (
    <div
      className={cn(
        "mt-13 grid w-[calc(100%+4rem)] grid-cols-[16px_32px_minmax(0,1fr)_80px_260px_32px] items-center pr-2 pl-4",
      )}
    >
      {/* Column 1: Drag handle placeholder */}
      <div className="w-8" />

      {/* Column 2: Status Icon */}
      <div
        className="flex size-10 cursor-pointer items-center justify-start rounded-full transition-all"
        onClick={() => handleToggleStatus("TODO_DONE")}
      >
        {status !== "DONE" ? <DONEIcon className="size-8" /> : <TODOIcon className="size-8" />}
      </div>

      {/* Column 3: Title */}
      <div className="min-w-0">
        <TitleEditor
          title={title}
          setTitle={handleChangeTitle}
          placeholder="Task title..."
          className="w-full min-w-0 text-[24px] leading-7 font-semibold text-[#413f39]"
        />
      </div>

      {/* Column 4: Assignees */}
      <div className="flex justify-center px-2">
        {(!isMyTasksPage || (assignees && assignees.length > 0)) && (
          <TooltipProvider>
            <div className="flex -space-x-1.5">
              {assignees && assignees.length > 0 && (
                <>
                  {assignees.slice(0, 2).map((user: IBasicUser) => (
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
                  {assignees.length > 2 && (
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
                            +{assignees.length - 2}
                          </AvatarFallback>
                        </Avatar>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">{assignees.length - 2} more</p>
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
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[8px] text-[#787878]">ACTUAL</span>
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
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[8px] text-[#787878]">ESTIMATE</span>
        </div>
      </div>

      {/* Column 6: Action placeholder */}
      <div className="w-8" />
    </div>
  );
}
