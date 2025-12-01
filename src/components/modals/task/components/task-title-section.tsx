import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Check, Pause, Play, UserPlus } from "lucide-react";
import { IBasicUser } from "@/types/user.type";

type TaskStatus = "TODO" | "RUNNING" | "DONE" | "ARCHIVED";

interface TaskTitleSectionProps {
  isEditMode: boolean;
  isPersonal: boolean;
  title: string;
  description: string;
  taskStatus: TaskStatus;
  parentSpentTime: number;
  parentEstimateTime: number;
  hasSubtasks: boolean;
  initialTask?: any;
  projectId?: string;
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  handleParentStatusChange: (status: TaskStatus) => void;
  setParentEstimateTime: (time: number) => void;
  handleOpenAssignModal: () => void;
  formatTimeDisplay: (seconds: number) => string;
  formatEstimateDisplay: (seconds: number) => string;
  parseTimeInput: (input: string) => number;
}

export function TaskTitleSection({
  isEditMode,
  isPersonal,
  title,
  description,
  taskStatus,
  parentSpentTime,
  parentEstimateTime,
  hasSubtasks,
  initialTask,
  projectId,
  setTitle,
  setDescription,
  handleParentStatusChange,
  setParentEstimateTime,
  handleOpenAssignModal,
  formatTimeDisplay,
  formatEstimateDisplay,
  parseTimeInput,
}: TaskTitleSectionProps) {
  const hasAssignees = initialTask?.assignees && initialTask.assignees.length > 0;
  const shouldShowAssignButton = isEditMode && initialTask && projectId && (!isPersonal || hasAssignees);

  return (
    <div className="flex items-start gap-4 mb-6">
      {/* Status checkbox */}
      <button
        onClick={() => {
          if (taskStatus === "TODO") {
            handleParentStatusChange("DONE");
          } else if (taskStatus === "DONE") {
            handleParentStatusChange("TODO");
          }
        }}
        disabled={taskStatus === "RUNNING"}
        className={`mt-2 w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors
          ${taskStatus === "DONE" 
            ? "bg-green-500 border-green-500" 
            : "border-gray-300 hover:border-gray-500"
          }
          ${taskStatus === "RUNNING" ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        `}
      >
        {taskStatus === "DONE" && (
          <Check className="w-4 h-4 text-white" />
        )}
      </button>

      {/* Title input */}
      <div className="flex-1">
        <Input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title..."
          className="text-2xl font-normal border-none focus-visible:ring-0 p-0 h-auto mb-2"
        />
        {/* <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add a description..."
          className="text-sm text-gray-600 border-none focus-visible:ring-0 p-0 min-h-[60px] resize-none"
        /> */}
      </div>

      {/* Assignee avatars - only show if conditions are met */}
      {shouldShowAssignButton && (
        <div className="flex items-center gap-2">
          <TooltipProvider>
            {hasAssignees ? (
              <div className="flex -space-x-2">
                {initialTask.assignees.slice(0, 3).map((user: IBasicUser) => (
                  <Tooltip key={user.id}>
                    <TooltipTrigger asChild>
                      <Avatar 
                        className="border-2 border-white cursor-pointer hover:z-10 transition-transform hover:scale-110"
                        onClick={handleOpenAssignModal}
                      >
                        <AvatarImage src={user.avatarUrl || undefined} alt={user.fullname} />
                        <AvatarFallback className="bg-blue-500 text-white text-xs">
                          {user.fullname.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{user.fullname}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
                {initialTask.assignees.length > 3 && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Avatar 
                        className="border-2 border-white cursor-pointer hover:z-10 transition-transform hover:scale-110"
                        onClick={handleOpenAssignModal}
                      >
                        <AvatarFallback className="bg-gray-500 text-white text-xs">
                          +{initialTask.assignees.length - 3}
                        </AvatarFallback>
                      </Avatar>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{initialTask.assignees.length - 3} more</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={handleOpenAssignModal}
                    className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-dashed border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-colors"
                  >
                    <UserPlus className="w-4 h-4 text-gray-400" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Assign task</p>
                </TooltipContent>
              </Tooltip>
            )}
          </TooltipProvider>
        </div>
      )}

      {/* Time tracking column */}
      <div className="flex flex-col items-end gap-1 min-w-[180px]">
        {/* Labels for ACTUAL and ESTIMATE */}
        {isEditMode && (
          <div className="flex items-center gap-3 text-[10px] text-gray-400 uppercase tracking-wider font-medium">
            <span className="min-w-[60px] text-right">Actual</span>
            <span className="min-w-[60px] text-right">Estimate</span>
          </div>
        )}

        {/* Time display with Play/Pause button */}
        <div className="flex items-center gap-2">
          {/* Play/Pause button for edit mode */}
          {isEditMode && (
            <button
              onClick={() => {
                if (taskStatus === "TODO") {
                  handleParentStatusChange("RUNNING");
                } else if (taskStatus === "RUNNING") {
                  handleParentStatusChange("TODO");
                }
              }}
              disabled={taskStatus === "DONE"}
              className={`p-1 hover:bg-gray-100 rounded ${taskStatus === "DONE" ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {taskStatus === "RUNNING" ? (
                <Pause className="w-4 h-4 text-gray-700" />
              ) : (
                <Play className="w-4 h-4 text-gray-700" />
              )}
            </button>
          )}

          <div className="flex items-center gap-3 text-sm font-mono">
            {isEditMode ? (
              <>
                {/* Actual time (spent) */}
                <div className="text-green-600 min-w-[60px] text-right">
                  {parentSpentTime > 0 ? formatTimeDisplay(parentSpentTime) : "--:--"}
                </div>
                {/* Estimate time - editable when no subtasks */}
                {!hasSubtasks ? (
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="text-gray-700 hover:text-gray-900 min-w-[60px] text-right hover:bg-gray-100 rounded px-1">
                        {formatEstimateDisplay(parentEstimateTime)}
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-48" align="end">
                      <div className="space-y-2">
                        <Label className="text-sm">Estimate time (MM:SS)</Label>
                        <Input
                          type="text"
                          defaultValue={formatEstimateDisplay(parentEstimateTime)}
                          onChange={(e) => setParentEstimateTime(parseTimeInput(e.target.value))}
                          placeholder="20:00"
                          className="text-sm"
                        />
                        {/* <p className="text-xs text-gray-500">20:00 = 20 min, 00:20 = 20 sec</p> */}
                      </div>
                    </PopoverContent>
                  </Popover>
                ) : (
                  <div className="text-gray-700 min-w-[60px] text-right">
                    {formatEstimateDisplay(parentEstimateTime)}
                  </div>
                )}
              </>
            ) : (
              /* Estimate time input for new task */
              <Popover>
                <PopoverTrigger asChild>
                  <button className="text-gray-700 hover:text-gray-900">
                    {formatEstimateDisplay(parentEstimateTime)}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-48" align="end">
                  <div className="space-y-2">
                    <Label className="text-sm">Estimate time (MM:SS)</Label>
                    <Input
                      type="text"
                      defaultValue={formatEstimateDisplay(parentEstimateTime)}
                      onChange={(e) => setParentEstimateTime(parseTimeInput(e.target.value))}
                      placeholder="20:00"
                      className="text-sm"
                    />
                    <p className="text-xs text-gray-500">20:00 = 20 min, 00:20 = 20 sec</p>
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
