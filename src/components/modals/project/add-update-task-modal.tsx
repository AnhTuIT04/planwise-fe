"use client";

import { useState, useEffect, useRef } from "react";
import { format, addMinutes } from "date-fns";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
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
import useModal from "@/hooks/useModal";
import { useTask } from "@/hooks/useTask";
import { useProject } from "@/hooks/useProject";
import { ITask } from "@/types/task.type";
import { IBasicUser } from "@/types/user.type";
import { 
  MoreHorizontal, 
  X, 
  Plus, 
  Trash2, 
  Archive,
  Upload,
  Pause,
  Play,
  Check,
  Circle,
  UserPlus
} from "lucide-react";

// === Types ===
type TaskStatus = "TODO" | "RUNNING" | "DONE" | "ARCHIVED";

interface Subtask {
  id: string;
  text: string;
  status: TaskStatus;
  isNew?: boolean;
  estimateTime: number; // in minutes
  spentTime: number; // in seconds
  lastStarted: Date | null;
}

export default function AddUpdateTaskModal() {
  const { data, isOpen, closeModal } = useModal<"ADD_UPDATE_TASK">();
  const { openModal: openAnyModal } = useModal();
  const { title: modalTitle, description: modalDescription, action, sectionId: initialSectionId, listSections, sectionName, projectId, isPersonal, task: initialTask } = data || {};
  
  const { createTask, updateTask, deleteTask, isCreatingTask, isUpdatingTask, isDeletingTask } = useTask();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [priority, setPriority] = useState<"LOW" | "HIGH">("LOW");
  const [selectedSection, setSelectedSection] = useState(initialSectionId || "");
  const [taskStatus, setTaskStatus] = useState<TaskStatus>("TODO");
  const [parentEstimateTime, setParentEstimateTime] = useState(20); // minutes
  const [parentSpentTime, setParentSpentTime] = useState(0); // seconds
  const [parentLastStarted, setParentLastStarted] = useState<Date | null>(null);
  const [showSectionSelect, setShowSectionSelect] = useState(false);
  const [editingTimeId, setEditingTimeId] = useState<string | null>(null);
  const [showDueDatePicker, setShowDueDatePicker] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  const isEditMode = !!initialTask;
  // const isEditMode =true;
  // === Khởi tạo dữ liệu ===
  useEffect(() => {
    if (!isOpen) return;

    setSelectedSection(initialSectionId || "");

    if (initialTask) {
      setTitle(initialTask.title);
      setDescription(initialTask.description || "");
      setDueDate(initialTask.deadline ? new Date(initialTask.deadline) : undefined);
      setPriority(
        initialTask.priority === "HIGH" || initialTask.priority === "URGENT"
          ? "HIGH"
          : "LOW"
      );
      setTaskStatus(initialTask.status as TaskStatus);
      setParentEstimateTime(initialTask.timeEstimate || 20);
      setParentSpentTime(initialTask.timeSpent || 0);
      setParentLastStarted(initialTask.lastStarted ? new Date(initialTask.lastStarted) : null);
      
      setSubtasks(
        initialTask?.subtasks?.length > 0
          ? initialTask.subtasks.map((st: ITask) => ({
              id: st.id,
              text: st.title || "",
              status: (st.status || "TODO") as TaskStatus,
              isNew: false,
              estimateTime: st.timeEstimate || 0,
              spentTime: st.timeSpent || 0,
              lastStarted: st.lastStarted ? new Date(st.lastStarted) : null,
            }))
          : []
      );
    } else {
      // === Tạo mới: set mặc định ===
      setTitle("");
      setDescription("");
      setDueDate(undefined);
      setPriority("LOW");
      setTaskStatus("TODO");
      setParentEstimateTime(20);
      setParentSpentTime(0);
      setParentLastStarted(null);
      setSubtasks([]);
    }
  }, [initialTask, isOpen, initialSectionId]);

  // === Timer effect for running tasks ===
  useEffect(() => {
    if (taskStatus === "RUNNING" && parentLastStarted) {
      timerRef.current = setInterval(() => {
        setParentSpentTime(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [taskStatus, parentLastStarted]);

  // === Auto-calculate parent estimate time from subtasks ===
  useEffect(() => {
    if (subtasks.length > 0) {
      const totalEstimate = subtasks.reduce((sum, st) => sum + st.estimateTime, 0);
      setParentEstimateTime(totalEstimate);
    }
  }, [subtasks]);

  // === Timer effects for running subtasks ===
  useEffect(() => {
    const intervals: { [key: string]: NodeJS.Timeout } = {};

    subtasks.forEach((subtask) => {
      if (subtask.status === "RUNNING" && subtask.lastStarted) {
        intervals[subtask.id] = setInterval(() => {
          setSubtasks(prev => 
            prev.map(st => 
              st.id === subtask.id 
                ? { ...st, spentTime: st.spentTime + 1 } 
                : st
            )
          );
        }, 1000);
      }
    });

    return () => {
      Object.values(intervals).forEach(interval => clearInterval(interval));
    };
  }, [subtasks.map(s => `${s.id}-${s.status}-${s.lastStarted}`).join(',')]);

  // === Helper functions ===
  const formatTimeDisplay = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return hours > 0 
      ? `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
      : `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const formatEstimateDisplay = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}:${mins.toString().padStart(2, '0')}` : `0:${mins.toString().padStart(2, '0')}`;
  };

  const parseTimeInput = (input: string): number => {
    const parts = input.split(':').map(p => parseInt(p) || 0);
    if (parts.length === 2) {
      return parts[0] * 60 + parts[1]; // hours:minutes -> minutes
    }
    return parseInt(input) || 0;
  };

  // === Subtask handlers ===
  const updateSubtask = (id: string, text: string) => {
    setSubtasks((prev) => prev.map((st) => (st.id === id ? { ...st, text } : st)));
  };

  const updateSubtaskEstimate = (id: string, minutes: number) => {
    setSubtasks((prev) => prev.map((st) => (st.id === id ? { ...st, estimateTime: minutes } : st)));
  };

  const addSubtask = () => {
    setSubtasks((prev) => [
      ...prev,
      { 
        id: crypto.randomUUID(), 
        text: "", 
        status: "TODO", 
        isNew: true,
        estimateTime: 1200,
        spentTime: 0,
        lastStarted: null,
      },
    ]);
  };

  const removeSubtask = async (id: string) => {
    const subtask = subtasks.find((st) => st.id === id);
    if (!subtask) return;

    if (!subtask.isNew && id) {
      try {
        await deleteTask({
          id,
          projectId,
          isPersonal,
        });
      } catch (error) {
        // Error already handled by useTask hook
        console.error("Delete subtask error:", error);
        return;
      }
    }
    setSubtasks((prev) => prev.filter((st) => st.id !== id));
  };

  // === Task status handlers ===
  const handleSubtaskStatusChange = async (subtaskId: string, newStatus: TaskStatus) => {
    const subtask = subtasks.find(st => st.id === subtaskId);
    if (!subtask) return;

    const oldStatus = subtask.status;

    // Validate transitions
    if (oldStatus === "DONE" && newStatus === "RUNNING") {
      toast.error("Cannot change from DONE to RUNNING");
      return;
    }

    if (oldStatus === "ARCHIVED" || newStatus === "ARCHIVED") {
      toast.error("Cannot change archived task status");
      return;
    }

    // Stop any running subtask first
    const runningSubtask = subtasks.find(st => st.status === "RUNNING" && st.id !== subtaskId);
    if (newStatus === "RUNNING" && runningSubtask) {
      // Stop the running subtask
      const spentSeconds = runningSubtask.lastStarted 
        ? Math.floor((Date.now() - runningSubtask.lastStarted.getTime()) / 1000)
        : 0;
      
      setSubtasks(prev => prev.map(st => 
        st.id === runningSubtask.id 
          ? { ...st, status: "TODO", spentTime: st.spentTime + spentSeconds, lastStarted: null }
          : st
      ));
    }

    // Update subtask status
    setSubtasks(prev => prev.map(st => {
      if (st.id !== subtaskId) return st;

      const updates: Partial<Subtask> = { status: newStatus };

      if (newStatus === "RUNNING") {
        // TODO -> RUNNING
        updates.lastStarted = new Date();
        // Start parent if not running
        if (taskStatus !== "RUNNING") {
          setTaskStatus("RUNNING");
          setParentLastStarted(new Date());
        }
      } else if (oldStatus === "RUNNING") {
        // RUNNING -> TODO or DONE
        const spentSeconds = st.lastStarted 
          ? Math.floor((Date.now() - st.lastStarted.getTime()) / 1000)
          : 0;
        updates.spentTime = st.spentTime + spentSeconds;
        updates.lastStarted = null;

        // Update parent spent time
        setParentSpentTime(prev => prev + spentSeconds);

        // Check if should stop parent
        const otherRunning = subtasks.some(s => s.id !== subtaskId && s.status === "RUNNING");
        if (!otherRunning && taskStatus === "RUNNING") {
          setTaskStatus("TODO");
          setParentLastStarted(null);
        }
      }

      return { ...st, ...updates };
    }));

    // TODO: Call API to update status
    // await updateTaskStatusAPI(subtaskId, newStatus);
  };

  const handleParentStatusChange = async (newStatus: TaskStatus) => {
    const oldStatus = taskStatus;

    // Validate transitions
    if (oldStatus === "DONE" && newStatus === "RUNNING") {
      toast.error("Cannot change from DONE to RUNNING");
      return;
    }

    if (oldStatus === "RUNNING" && newStatus === "ARCHIVED") {
      toast.error("Cannot archive running task");
      return;
    }

    if (subtasks.length > 0 && (oldStatus === "TODO" || oldStatus === "DONE") && newStatus === "ARCHIVED") {
      // Prevent archiving parent if has subtasks
      toast.error("Cannot archive parent task with subtasks");
      return;
    }

    if (newStatus === "RUNNING") {
      // Stop any running subtask
      const runningSubtask = subtasks.find(st => st.status === "RUNNING");
      if (runningSubtask) {
        const spentSeconds = runningSubtask.lastStarted 
          ? Math.floor((Date.now() - runningSubtask.lastStarted.getTime()) / 1000)
          : 0;
        
        setSubtasks(prev => prev.map(st => 
          st.id === runningSubtask.id 
            ? { ...st, status: "TODO", spentTime: st.spentTime + spentSeconds, lastStarted: null }
            : st
        ));
      }
      setParentLastStarted(new Date());
    } else if (oldStatus === "RUNNING") {
      // Just stop timer, don't add time again (timer already incremented it)
      setParentLastStarted(null);

      // Stop all running subtasks
      setSubtasks(prev => prev.map(st => {
        if (st.status === "RUNNING" && st.lastStarted) {
          const subSpent = Math.floor((Date.now() - st.lastStarted.getTime()) / 1000);
          return { ...st, status: "TODO", spentTime: st.spentTime + subSpent, lastStarted: null };
        }
        return st;
      }));
    }

    if (newStatus === "DONE" && subtasks.length > 0) {
      // Mark all subtasks as done
      setSubtasks(prev => prev.map(st => ({ ...st, status: "DONE" })));
    }

    if (newStatus === "TODO" && oldStatus === "DONE" && subtasks.length > 0) {
      // Mark all subtasks as todo
      setSubtasks(prev => prev.map(st => ({ ...st, status: "TODO" })));
    }

    setTaskStatus(newStatus);

    // TODO: Call API to update status
    // await updateTaskStatusAPI(initialTask?.id, newStatus);
  };

  // === Save Task ===
  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!initialSectionId) {
      toast.error("Section is required");
      return;
    }

    // Get projectId from current project context or initialTask
    // const projectId = project?.id || initialTask?.id || "";
    if (!projectId) {
      toast.error("Project ID is required");
      return;
    }

    const validSubtasks = subtasks
      .filter((st) => st.text.trim())
      .map((st) => {
        return {
          id: st.isNew ? undefined : st.id,
          title: st.text,
          // status: st.status,
          timeEstimate: st.estimateTime,
          // timeSpent: st.spentTime,
          assigneeIds: initialTask?.assignees.map(a => a.id) || [],
        };
      });
    const assigneeIds = initialTask?.assignees.map(a => a.id) || [];
    const payload = {
      title,
      description: description || undefined,
      dueDate: dueDate ? dueDate.toISOString() : undefined,
      sectionId: selectedSection,
      priority: priority as "LOW" | "MEDIUM" | "HIGH",
      timeEstimate: parentEstimateTime,
      // timeSpent: parentSpentTime,
      // lastStarted: parentLastStarted,
      status: taskStatus,
      projectId,
      subtasks: validSubtasks.length > 0 ? validSubtasks : [],
      assigneeIds: assigneeIds,
    };

    try {
      if (initialTask) {
        await updateTask({
          id: initialTask.id,
          payload,
          isPersonal,
        });
      } else {
        await createTask(payload);
      }
      
      closeModal();
    } catch (error: any) {
      // Error already handled by useTask hook
      console.error("Save task error:", error);
    }
  };

  // === Format time ===
  const formatTime = (dateStr: string) => {
    if (!dateStr) return "";
    return format(new Date(dateStr), "HH:mm");
  };

  // === Action handlers ===
  const handleDeleteTask = async () => {
    if (!initialTask?.id) return;
    
    try {
      await deleteTask({
        id: initialTask.id,
        projectId,
        isPersonal,
      });
      closeModal();
    } catch (error: any) {
      // Error already handled by useTask hook
      console.error("Delete task error:", error);
    }
  };

  const handleArchiveTask = async () => {
    if (taskStatus === "RUNNING") {
      toast.error("Cannot archive running task");
      return;
    }
    await handleParentStatusChange("ARCHIVED");
    toast.success("Task archived");
    closeModal();
  };

  const handleImportTask = async () => {
    // TODO: Implement import task logic
    toast.success("Task imported");
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="w-full max-w-3xl max-h-[90vh] overflow-y-auto p-0 gap-0">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div className="flex items-center gap-4 flex-1">
            {/* Section selector */}
            <DropdownMenu open={showSectionSelect} onOpenChange={setShowSectionSelect}>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 text-amber-600 font-medium hover:bg-amber-50 px-2 py-1 rounded">
                  <span className="text-lg">#</span>
                  <span>{listSections.find(s => s.id === selectedSection)?.name || sectionName || "work"}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                {listSections.map((section) => (
                  <DropdownMenuItem
                    key={section.id}
                    onClick={() => {
                      setSelectedSection(section.id);
                      setShowSectionSelect(false);
                    }}
                    className="cursor-pointer"
                  >
                    <span className="text-amber-600 mr-2">#</span>
                    {section.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Start/Due dates */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="font-medium">Start:</span>
              <span>Today</span>
              
              <Popover open={showDueDatePicker} onOpenChange={setShowDueDatePicker}>
                <PopoverTrigger asChild>
                  <button className="font-medium ml-2 hover:text-gray-900">
                    Due {dueDate ? format(dueDate, "MMM dd") : ""}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={(date) => {
                      setDueDate(date);
                      setShowDueDatePicker(false);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Add subtasks button */}
            <button 
              onClick={addSubtask}
              className="text-sm text-gray-600 hover:text-gray-900 font-medium"
            >
              Add subtasks
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Actions menu - only show in edit mode */}
            {isEditMode && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-2 hover:bg-gray-100 rounded">
                    <MoreHorizontal className="w-5 h-5 text-gray-600" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={handleDeleteTask} className="cursor-pointer text-red-600">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete task
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleArchiveTask} className="cursor-pointer">
                    <Archive className="w-4 h-4 mr-2" />
                    Archive task
                  </DropdownMenuItem>
                  {!isPersonal && (
                    <DropdownMenuItem onClick={handleImportTask} className="cursor-pointer">
                      <Upload className="w-4 h-4 mr-2" />
                      Import task
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Expand button */}
            {/* <button className="p-2 hover:bg-gray-100 rounded">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </button> */}

            {/* Close button */}
            {/* <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded">
              <X className="w-5 h-5 text-gray-600" />
            </button> */}
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-4">
          {/* Title with Timer/Pause button and Time tracking */}
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
                className="text-2xl font-normal border-none focus-visible:ring-0 p-0 h-auto"
              />
            </div>

            {/* Assignee avatars - only in edit mode and for non-personal projects */}
            {isEditMode && initialTask && projectId && (
              <div className="flex items-center gap-2">
                <TooltipProvider>
                  {initialTask.assignees && initialTask.assignees.length > 0 ? (
                    <div className="flex -space-x-2">
                      {initialTask.assignees.slice(0, 3).map((user: IBasicUser) => (
                        <Tooltip key={user.id}>
                          <TooltipTrigger asChild>
                            <Avatar 
                              className="border-2 border-white cursor-pointer hover:z-10 transition-transform hover:scale-110"
                              onClick={() => {
                                openAnyModal({
                                  type: "ASSIGN_TASK",
                                  data: {
                                    task: initialTask,
                                    projectId: projectId,
                                    isPersonal: isPersonal || false,
                                  },
                                });
                              }}
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
                              onClick={() => {
                                openAnyModal({
                                  type: "ASSIGN_TASK",
                                  data: {
                                    task: initialTask,
                                    projectId: projectId,
                                    isPersonal: isPersonal || false,
                                  },
                                });
                              }}
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
                          onClick={() => {
                            openAnyModal({
                              type: "ASSIGN_TASK",
                              data: {
                                task: initialTask,
                                projectId: projectId,
                                isPersonal: isPersonal || false,
                              },
                            });
                          }}
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
                      {/* Estimate time */}
                      <div className="text-gray-700 min-w-[60px] text-right">
                        {formatEstimateDisplay(parentEstimateTime)}
                      </div>
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
                          <Label className="text-sm">Estimate time (minutes)</Label>
                          <Input
                            type="number"
                            value={parentEstimateTime}
                            onChange={(e) => setParentEstimateTime(parseInt(e.target.value) || 0)}
                            placeholder="20"
                            className="text-sm"
                          />
                        </div>
                      </PopoverContent>
                    </Popover>
                  )}
                </div>

                
              </div>
            </div>
          </div>

          {/* Subtasks */}
          {subtasks.length > 0 && (
            <div className="ml-10 space-y-2 mb-6">
              {subtasks.map((subtask, index) => (
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
                    onChange={(e) => updateSubtask(subtask.id, e.target.value)}
                    placeholder="Subtask..."
                    className="flex-1 border-none focus-visible:ring-0 text-sm text-gray-700 h-8 px-0"
                  />

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
                            {subtask.spentTime > 0 ? formatTimeDisplay(subtask.spentTime) : "--:--"}
                          </span>
                          {/* Estimate time */}
                          <Popover>
                            <PopoverTrigger asChild>
                              <button className="text-gray-700 hover:text-gray-900 min-w-[60px] text-right">
                                {formatEstimateDisplay(subtask.estimateTime)}
                              </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-48" align="end">
                              <div className="space-y-2">
                                <Label className="text-xs">Estimate (min)</Label>
                                <Input
                                  type="number"
                                  value={subtask.estimateTime}
                                  onChange={(e) => updateSubtaskEstimate(subtask.id, parseInt(e.target.value) || 0)}
                                  className="text-sm"
                                />
                              </div>
                            </PopoverContent>
                          </Popover>
                        </>
                      ) : (
                        /* Estimate time for new subtask */
                        <Popover>
                          <PopoverTrigger asChild>
                            <button className="text-gray-700 hover:text-gray-900">
                              {formatEstimateDisplay(subtask.estimateTime)}
                            </button>
                          </PopoverTrigger>
                          <PopoverContent className="w-48" align="end">
                            <div className="space-y-2">
                              <Label className="text-xs">Estimate (min)</Label>
                              <Input
                                type="number"
                                value={subtask.estimateTime}
                                onChange={(e) => updateSubtaskEstimate(subtask.id, parseInt(e.target.value) || 0)}
                                className="text-sm"
                              />
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
                className="flex items-center gap-2 text-gray-400 hover:text-gray-600 text-sm ml-8"
              >
                <Plus className="w-4 h-4" />
                <span>Add subtask</span>
              </button>
            </div>
          )}

          {/* Show add subtask button if no subtasks */}
          {subtasks.length === 0 && (
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
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-6 py-4 border-t bg-gray-50">
          <Button variant="outline" onClick={closeModal}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
            {isEditMode ? "Update" : "Create"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
