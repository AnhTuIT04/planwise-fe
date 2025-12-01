import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Check, Pause, Play, UserPlus, X, Plus } from "lucide-react";
import { IBasicUser } from "@/types/user.type";

type TaskStatus = "TODO" | "RUNNING" | "DONE" | "ARCHIVED";

export interface Subtask {
  id: string;
  text: string;
  status: TaskStatus;
  isNew?: boolean;
  estimate: number;
  spent: number;
  lastStarted: Date | null;
  parentTaskId?: string;
  assignees?: IBasicUser[];
}

interface SubtasksListProps {
  subtasks: Subtask[];
  isEditMode: boolean;
  setSubtasks: (updater: (prev: Subtask[]) => Subtask[]) => void;
  handleSubtaskStatusChange: (id: string, status: TaskStatus) => void;
  handleUpdateSubTaskTitle: (id: string, text: string, subtask: Subtask) => void;
  handleOpenSubtaskAssignModal: (subtask: Subtask) => void;
  updateSubtaskEstimate: (id: string, seconds: number) => void;
  removeSubtask: (id: string) => void;
  addSubtask: () => void;
  formatTimeDisplay: (seconds: number) => string;
  formatEstimateDisplay: (seconds: number) => string;
  parseTimeInput: (input: string) => number;
}

export function SubtasksList({
  subtasks,
  isEditMode,
  setSubtasks,
  handleSubtaskStatusChange,
  handleUpdateSubTaskTitle,
  handleOpenSubtaskAssignModal,
  updateSubtaskEstimate,
  removeSubtask,
  addSubtask,
  formatTimeDisplay,
  formatEstimateDisplay,
  parseTimeInput,
}: SubtasksListProps) {
  if (subtasks.length === 0) {
    return (
      <div className="ml-10 mb-6">
        <button
          type="button"
          onClick={addSubtask}
          className="flex items-center gap-2 text-gray-400 hover:text-gray-600 text-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add subtask</span>
        </button>
      </div>
    );
  }

  return (
    <div className="ml-10 space-y-2 mb-6">
      {subtasks.map((subtask) => (
        <div key={subtask.id} className="flex items-center gap-3 group">
          {/* Status checkbox */}
          <button
            onClick={() => {
              if (subtask.status === "TODO") {
                handleSubtaskStatusChange(subtask.id, "DONE");
              } else if (subtask.status === "DONE") {
                handleSubtaskStatusChange(subtask.id, "TODO");
              }
            }}
            disabled={subtask.status === "RUNNING"}
            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0
              ${subtask.status === "DONE"
                ? "bg-green-500 border-green-500"
                : "border-gray-300 hover:border-gray-500"
              }
              ${subtask.status === "RUNNING" ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
            `}
          >
            {subtask.status === "DONE" && (
              <Check className="w-3 h-3 text-white" />
            )}
          </button>

          {/* Subtask title */}
          <Input
            value={subtask.text}
            onBlur={(e) => handleUpdateSubTaskTitle(subtask.id, e.target.value, subtask)}
            onChange={(e) => {
              const newText = e.target.value;
              setSubtasks((prev) =>
                prev.map((st) =>
                  st.id === subtask.id ? { ...st, text: newText } : st
                )
              );
            }}
            placeholder="Subtask..."
            className="flex-1 border-none focus-visible:ring-0 text-sm text-gray-700 h-8 px-0"
          />

          {/* Subtask Assignee avatars - only in edit mode */}
          {isEditMode && !subtask.isNew && (
            <div className="flex items-center gap-1">
              <TooltipProvider>
                {subtask.assignees && subtask.assignees.length > 0 ? (
                  <div className="flex -space-x-1">
                    {subtask.assignees.slice(0, 2).map((user: IBasicUser) => (
                      <Tooltip key={user.id}>
                        <TooltipTrigger asChild>
                          <Avatar 
                            className="border border-white cursor-pointer hover:z-10 transition-transform hover:scale-110 w-6 h-6"
                            onClick={() => handleOpenSubtaskAssignModal(subtask)}
                          >
                            <AvatarImage src={user.avatarUrl || undefined} alt={user.fullname} />
                            <AvatarFallback className="bg-blue-500 text-white text-[10px]">
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
                            className="border border-white cursor-pointer hover:z-10 transition-transform hover:scale-110 w-6 h-6"
                            onClick={() => handleOpenSubtaskAssignModal(subtask)}
                          >
                            <AvatarFallback className="bg-gray-500 text-white text-[10px]">
                              +{subtask.assignees.length - 2}
                            </AvatarFallback>
                          </Avatar>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">{subtask.assignees.length - 2} more</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                ) : (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => handleOpenSubtaskAssignModal(subtask)}
                        className="flex items-center justify-center w-6 h-6 rounded-full border border-dashed border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-colors"
                      >
                        <UserPlus className="w-3 h-3 text-gray-400" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">Assign members</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </TooltipProvider>
            </div>
          )}

          {/* Time tracking column */}
          <div className="flex items-center gap-2 min-w-[180px] justify-end">
            {/* Play/Pause button for edit mode */}
            {isEditMode && (
              <button
                onClick={() => {
                  if (subtask.status === "TODO") {
                    handleSubtaskStatusChange(subtask.id, "RUNNING");
                  } else if (subtask.status === "RUNNING") {
                    handleSubtaskStatusChange(subtask.id, "TODO");
                  }
                }}
                disabled={subtask.status === "DONE"}
                className={`p-1 hover:bg-gray-100 rounded ${subtask.status === "DONE" ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {subtask.status === "RUNNING" ? (
                  <Pause className="w-3 h-3 text-gray-700" />
                ) : (
                  <Play className="w-3 h-3 text-gray-700" />
                )}
              </button>
            )}

            {/* Time display */}
            <div className="flex items-center gap-3 text-xs font-mono">
              {isEditMode ? (
                <>
                  {/* Actual/Spent time */}
                  <span className="text-green-600 min-w-[60px] text-right">
                    {subtask.spent > 0 ? formatTimeDisplay(subtask.spent) : "--:--"}
                  </span>
                  {/* Estimate time */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="text-gray-700 hover:text-gray-900 min-w-[60px] text-right hover:bg-gray-100 rounded px-1">
                        {formatEstimateDisplay(subtask.estimate)}
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-48" align="end">
                      <div className="space-y-2">
                        <Label className="text-xs">Estimate (MM:SS)</Label>
                        <Input
                          type="text"
                          defaultValue={formatEstimateDisplay(subtask.estimate)}
                          onChange={(e) => updateSubtaskEstimate(subtask.id, parseTimeInput(e.target.value))}
                          placeholder="20:00"
                          className="text-sm"
                        />
                        <p className="text-xs text-gray-500">20:00 = 20 min, 00:20 = 20 sec</p>
                      </div>
                    </PopoverContent>
                  </Popover>
                </>
              ) : (
                /* Estimate time for new subtask */
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="text-gray-700 hover:text-gray-900">
                      {formatEstimateDisplay(subtask.estimate)}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-48" align="end">
                    <div className="space-y-2">
                      <Label className="text-xs">Estimate (MM:SS)</Label>
                      <Input
                        type="text"
                        defaultValue={formatEstimateDisplay(subtask.estimate)}
                        onChange={(e) => updateSubtaskEstimate(subtask.id, parseTimeInput(e.target.value))}
                        placeholder="20:00"
                        className="text-sm"
                      />
                      <p className="text-xs text-gray-500">20:00 = 20 min, 00:20 = 20 sec</p>
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            </div>

            {/* Delete button */}
            <button
              type="button"
              onClick={() => removeSubtask(subtask.id)}
              className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-600 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addSubtask}
        className="flex items-center gap-2 text-gray-400 hover:text-gray-600 text-sm"
      >
        <Plus className="w-4 h-4" />
        <span>Add subtask</span>
      </button>
    </div>
  );
}
