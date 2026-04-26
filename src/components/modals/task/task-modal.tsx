"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import useModal from "@/hooks/useModal";
import { useTask } from "@/hooks/useTask";
import { useSubtask } from "@/hooks/useSubtask";
import { ITask } from "@/types/task.type";
import { TaskHeader } from "./components/task-header";
import { TaskTitleSection } from "./components/task-title-section";
import { SubtasksList, Subtask } from "./components/subtasks-list";
import { NotionTaskProperties } from "./components/notion-task-properties";
import { ImportTaskDialog } from "./components/import-task-dialog";
import { useProject } from "@/hooks/useProject";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
// === Types ===
type TaskStatus = "TODO" | "RUNNING" | "DONE" | "ARCHIVED";

export default function TaskModal() {
  const { data, isOpen, closeModal } = useModal<"ADD_UPDATE_TASK">();
  const { openModal } = useModal<"ASSIGN_TASK">();
  const { user } = useAuth();
  const {
    title: modalTitle,
    description: modalDescription,
    action,
    sectionId: initialSectionId,
    listSections,
    sectionName,
    projectId,
    isPersonal,
    task: initialTask,
    isNotionMode,
    onCreateNotion,
  } = data || {};

  const { createTask, updateTask, deleteTask, updateTaskStatus, moveTask, importTask } = useTask();
  const { createSubtask, updateSubtask, deleteSubtask, updateSubtaskStatus } = useSubtask({ projectId });
  // Helper function to open assign modal for parent task - must close this modal first
  const listSectionsPersonal = isPersonal ? listSections : useProject({ projectId: user?.workspaceId || "" }).project?.sections.map((section) => ({ id: section.id, name: section.name })) || [];

  const handleOpenAssignModal = () => {
    if (!initialTask || !projectId) return;

    closeModal();

    // Open assign modal after a brief delay to ensure smooth transition
    setTimeout(() => {
      openModal({
        type: "ASSIGN_TASK",
        data: {
          previousTask: initialTask,
          task: initialTask,
          projectId: projectId,
          isPersonal: isPersonal || false,
          isSubtask: false,
          member: [],
        },
      });
    }, 100);
  };

  // Helper function to open assign modal for subtask
  const handleOpenSubtaskAssignModal = (subtask: Subtask) => {
    if (!projectId || !initialTask) return;

    // Create a temporary task object for the subtask
    const subtaskAsTask: ITask = {
      id: subtask.id,
      title: subtask.text,
      status: subtask.status,
      assignees: subtask.assignees || [],
      estimate: subtask.estimate,
      spent: subtask.spent,
      lastStarted: subtask.lastStarted?.toISOString() || null,
    } as ITask;

    closeModal();

    setTimeout(() => {
      openModal({
        type: "ASSIGN_TASK",
        data: {
          previousTask: initialTask,
          task: subtaskAsTask,
          projectId: projectId,
          isPersonal: isPersonal || false,
          isSubtask: true,
          member: [],
        },
      });
    }, 100);
  };
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [priority, setPriority] = useState<"LOW" | "NORMAL" | "HIGH" | "URGENT">("LOW");
  const [selectedSection, setSelectedSection] = useState(initialSectionId || "");
  const [taskStatus, setTaskStatus] = useState<TaskStatus>("TODO");
  const [parentEstimateTime, setParentEstimateTime] = useState(1200); // seconds (20 minutes)
  const [parentSpentTime, setParentSpentTime] = useState(0); // seconds
  const [parentLastStarted, setParentLastStarted] = useState<Date | null>(null);
  const [showSectionSelect, setShowSectionSelect] = useState(false);
  const [editingTimeId, setEditingTimeId] = useState<string | null>(null);
  const [showDueDatePicker, setShowDueDatePicker] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [selectedImportSection, setSelectedImportSection] = useState("");
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const isEditMode = !!initialTask;
  // const isEditMode =true;
  // === Khởi tạo dữ liệu ===
  useEffect(() => {
    if (!isOpen) {
      // Reset all dialogs when modal closes
      setShowImportDialog(false);
      setSelectedImportSection("");
      return;
    }

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
      setParentEstimateTime(initialTask.estimate || 1200);
      setParentSpentTime(initialTask.spent || 0);
      setParentLastStarted(initialTask.lastStarted ? new Date(initialTask.lastStarted) : null);

      setSubtasks(
        initialTask?.subtasks?.length > 0
          ? initialTask.subtasks.map((st: ITask) => ({
            id: st.id,
            text: st.title || "",
            status: (st.status || "TODO") as TaskStatus,
            isNew: false,
            estimate: st.estimate || 0,
            spent: st.spent || 0,
            lastStarted: st.lastStarted ? new Date(st.lastStarted) : null,
            assignees: st.assignees || [],
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
      setParentEstimateTime(1200);
      setParentSpentTime(0);
      setParentLastStarted(null);
      setSubtasks([]);
    }
  }, [initialTask, isOpen, initialSectionId]);

  // === Timer effect for running tasks - preserve time when reopening ===
  useEffect(() => {
    if (taskStatus === "RUNNING" && parentLastStarted) {
      // Calculate initial elapsed time since last started
      const initialElapsed = Math.floor((Date.now() - parentLastStarted.getTime()) / 1000);
      const baseSpentTime = initialTask?.spent || 0;

      // Update immediately with current elapsed time
      setParentSpentTime(baseSpentTime + initialElapsed);

      // Then update every second
      timerRef.current = setInterval(() => {
        const currentElapsed = Math.floor((Date.now() - parentLastStarted.getTime()) / 1000);
        setParentSpentTime(baseSpentTime + currentElapsed);
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
  }, [taskStatus, parentLastStarted, initialTask?.spent]);

  // === Auto-calculate parent estimate time from subtasks ===
  useEffect(() => {
    if (subtasks.length > 0) {
      const totalEstimate = subtasks.reduce((sum, st) => sum + st.estimate, 0);
      setParentEstimateTime(totalEstimate);
    }
  }, [subtasks]);

  // === Timer effects for running subtasks - preserve time when reopening ===
  useEffect(() => {
    const intervals: { [key: string]: NodeJS.Timeout } = {};

    subtasks.forEach((subtask) => {
      if (subtask.status === "RUNNING" && subtask.lastStarted) {
        // Find the original subtask from initialTask to get base spentTime
        const originalSubtask = initialTask?.subtasks?.find((st: ITask) => st.id === subtask.id);
        const baseSpentTime = originalSubtask?.spent || 0;
        const lastStartedTime = subtask.lastStarted.getTime();

        // Update immediately with current elapsed time
        const initialElapsed = Math.floor((Date.now() - lastStartedTime) / 1000);
        setSubtasks(prev =>
          prev.map(st =>
            st.id === subtask.id
              ? { ...st, spent: baseSpentTime + initialElapsed }
              : st
          )
        );

        // Then update every second
        intervals[subtask.id] = setInterval(() => {
          const currentElapsed = Math.floor((Date.now() - lastStartedTime) / 1000);
          setSubtasks(prev =>
            prev.map(st =>
              st.id === subtask.id
                ? { ...st, spent: baseSpentTime + currentElapsed }
                : st
            )
          );
        }, 1000);
      }
    });

    return () => {
      Object.values(intervals).forEach(interval => clearInterval(interval));
    };
  }, [subtasks.map(s => `${s.id}-${s.status}-${s.lastStarted}`).join(','), initialTask?.subtasks]);

  // === Helper functions ===
  // Format spent time display (H:MM:SS or M:SS)
  const formatTimeDisplay = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return hours > 0
      ? `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
      : `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  // Format estimate time display (MM:SS format - 20:00 = 20 minutes, 00:20 = 20 seconds)
  const formatEstimateDisplay = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Parse time input (MM:SS format - 20:00 = 1200 seconds, 00:20 = 20 seconds)
  const parseTimeInput = (input: string): number => {
    const parts = input.split(':').map(p => parseInt(p) || 0);
    if (parts.length === 2) {
      const minutes = parts[0];
      const seconds = parts[1];
      return minutes * 60 + seconds; // MM:SS -> seconds
    }
    return parseInt(input) || 0;
  };

  // === Subtask handlers ===
  // const updateSubtask = (id: string, text: string) => {
  //   setSubtasks((prev) => prev.map((st) => (st.id === id ? { ...st, text } : st)));
  // };
  const handleUpdateSubTaskTitle = async (id: string, text: string, subtask: Subtask) => {
    if (!initialTask || text.trim() === "") return;
    const payload = {
      title: text,
      // parentTaskId: subtask.parentTaskId || initialTask?.id,
    };
    if (!subtask || subtask.isNew) {
      const payloadCreate = { ...payload, status: subtask.status, estimate: subtask.estimate, parentTaskId: subtask.parentTaskId || initialTask?.id, assigneeIds: initialTask?.assignees.map(a => a.id) || [] };
      await createSubtask.mutateAsync(payloadCreate);
      return;
    }
    await updateSubtask.mutateAsync({ id, payload });
  };
  const updateSubtaskEstimate = (id: string, seconds: number) => {
    setSubtasks((prev) => prev.map((st) => (st.id === id ? { ...st, estimate: seconds } : st)));
    const payload = {
      estimate: seconds,
      // parentTaskId: initialTask?.id,
    };
    updateSubtask.mutateAsync({ id, payload });
  }

  const addSubtask = () => {
    setSubtasks((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        text: "",
        status: "TODO",
        isNew: true,
        estimate: 1200,
        spent: 0,
        lastStarted: null,
      },
    ]);
  };

  const removeSubtask = async (id: string) => {
    const subtask = subtasks.find((st) => st.id === id);
    if (!subtask) return;

    if (!subtask.isNew && id) {
      try {
        await deleteSubtask.mutateAsync(id);
      } catch (error) {
        // Error already handled by useTask hook
        console.error("Delete subtask error:", error);
        return;
      }
    }
    setSubtasks((prev) => prev.filter((st) => st.id !== id));
  };
  const handleMoveTask = async (fromSectionId: string, newSectionId: string) => {
    if (!initialTask) return;
    await moveTask({ id: initialTask.id, payload: { fromSectionId, toSectionId: newSectionId, insertAt: 1 } });
  }
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
          ? { ...st, status: "TODO", spent: st.spent, lastStarted: null }
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
        updates.spent = st.spent;
        updates.lastStarted = null;

        // setParentSpentTime(prev => prev + spentSeconds);

        // Check if should stop parent
        const otherRunning = subtasks.some(s => s.id !== subtaskId && s.status === "RUNNING");
        if (!otherRunning && taskStatus === "RUNNING") {
          setTaskStatus("TODO");
          setParentLastStarted(null);
        }
      }

      return { ...st, ...updates };
    }));
    if (!subtask || subtask.isNew) return;
    console.log({ id: subtaskId, payload: { status: newStatus, sectionId: selectedSection } });
    await updateSubtaskStatus.mutateAsync({ id: subtaskId, payload: { status: newStatus, sectionId: selectedSection } })
      .catch((error) => {
        // Revert status on error
        setSubtasks(prev => prev.map(st =>
          st.id === subtaskId
            ? { ...st, status: oldStatus }
            : st
        ));
        setTaskStatus(oldStatus);
        if (oldStatus === "RUNNING") {
          setParentLastStarted(new Date());
        } else {
          setParentLastStarted(null);
        }
      });
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

    // if (subtasks.length > 0 && (oldStatus === "TODO" || oldStatus === "DONE") && newStatus === "ARCHIVED") {
    //   // Prevent archiving parent if has subtasks
    //   toast.error("Cannot archive parent task with subtasks");
    //   return;
    // }

    if (newStatus === "RUNNING") {
      // Stop any running subtask (timer already incremented its time)
      const runningSubtask = subtasks.find(st => st.status === "RUNNING");
      if (runningSubtask) {
        setSubtasks(prev => prev.map(st =>
          st.id === runningSubtask.id
            ? { ...st, status: "TODO", lastStarted: null }
            : st
        ));
      }
      setParentLastStarted(new Date());
    } else if (oldStatus === "RUNNING") {
      // Just stop timer, don't add time again (timer already incremented it)
      setParentLastStarted(null);

      // Stop all running subtasks (timer already incremented their time)
      setSubtasks(prev => prev.map(st => {
        if (st.status === "RUNNING" && st.lastStarted) {
          return { ...st, status: "TODO", lastStarted: null };
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
    if (initialTask) {
      await updateTaskStatus({
        id: initialTask.id,
        payload: {
          status: newStatus,
          sectionId: selectedSection,
        },
      })
        .catch((error) => {
          // Revert status on error
          setTaskStatus(oldStatus);
          setSubtasks(prev => prev.map(st => {
            if (newStatus === "DONE") {
              return { ...st, status: st.status === "DONE" ? "TODO" : st.status };
            } else if (oldStatus === "RUNNING") {
              return { ...st, status: st.status === "TODO" ? "RUNNING" : st.status };
            }
            return st;
          }));

        });
    }
    // TODO: Call API to update status
    // await updateTaskStatusAPI(initialTask?.id, newStatus);
  };

  // === Save Task ===
  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!initialSectionId && !isNotionMode) {
      toast.error("Section is required");
      return;
    }

    // Get projectId from current project context or initialTask
    if (!projectId && !isNotionMode) {
      toast.error("Project ID is required");
      return;
    }

    if (isNotionMode && onCreateNotion) {
      try {
        await onCreateNotion({
          title,
          description: description || undefined,
          deadline: dueDate ? dueDate.toISOString() : undefined,
          status: taskStatus
        });
        closeModal();
        return;
      } catch (e) {
        return;
      }
    }

    const validSubtasks = subtasks
      .filter((st) => st.text.trim())
      .map((st) => {
        return {
          id: st.isNew ? undefined : st.id,
          title: st.text,
          // status: st.status,
          estimate: st.estimate,
          // timeSpent: st.spentTime,
          assigneeIds: initialTask?.assignees.map(a => a.id) || [],
        };
      });
    const assigneeIds = initialTask?.assignees.map(a => a.id) || [];
    const basePayload = {
      title,
      description: description || undefined,
      deadline: dueDate ? dueDate.toISOString() : undefined,
      sectionId: selectedSection,
      priority: priority as "LOW" | "NORMAL" | "HIGH" | 'URGENT',
      estimate: parentEstimateTime,
      // projectId,
    };
    const createPayload = {
      ...basePayload,
      subtasks: validSubtasks.length > 0 ? validSubtasks : [],
      status: taskStatus,
      assigneeIds: assigneeIds,
    };
    const updatePayload = {
      ...basePayload,
      priority: priority as "LOW" | "NORMAL" | "HIGH" | "URGENT",
    };
    try {
      if (initialTask) {
        await updateTask({
          id: initialTask.id,
          payload: updatePayload,
        });
      } else {
        await createTask(createPayload);
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
      // closeModal();
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
    // closeModal();
  };

  const handleRestoreTask = async () => {
    await handleParentStatusChange("TODO");
    toast.success("Task restored");
    closeModal();
  };

  const handleImportTask = async () => {
    // Show dialog to select section from personal project
    setShowImportDialog(true);
  };

  const handleConfirmImport = async () => {
    if (!initialTask?.id || !selectedImportSection || !projectId) {
      toast.error("Please select a section");
      return;
    }

    const payload = {
      fromProjectId: projectId,
      toSectionId: selectedImportSection,
      insertAt: 1,
    };

    try {
      await importTask({
        id: initialTask.id,
        payload,
      });
      setShowImportDialog(false);
      setSelectedImportSection("");
      closeModal();
    } catch (error) {
      console.error("Import task error:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={closeModal}>
        <DialogContent className="w-full max-w-3xl max-h-[90vh] overflow-y-auto p-0 gap-0">
          <TaskHeader
            isEditMode={isEditMode}
            isPersonal={isPersonal || false}
            selectedSection={selectedSection}
            sectionName={sectionName}
            status={taskStatus}
            canImport={initialTask?.canImport || false}
            isImported={initialTask?.isImported || false}
            listSections={listSections || []}
            dueDate={dueDate}
            priority={priority}
            showSectionSelect={showSectionSelect && !isNotionMode}
            showDueDatePicker={showDueDatePicker}
            setShowSectionSelect={setShowSectionSelect}
            setShowDueDatePicker={setShowDueDatePicker}
            setPriority={setPriority}
            handleMoveTask={handleMoveTask}
            setSelectedSection={setSelectedSection}
            setDueDate={setDueDate}
            addSubtask={addSubtask}
            handleDeleteTask={handleDeleteTask}
            handleArchiveTask={handleArchiveTask}
            handleImportTask={handleImportTask}
            handleRestoreTask={handleRestoreTask}
          />

          <div className="px-6 py-2">
            <TaskTitleSection
              isEditMode={isEditMode}
              isPersonal={isPersonal || false}
              title={title}
              description={description}
              taskStatus={taskStatus}
              parentSpentTime={parentSpentTime}
              parentEstimateTime={parentEstimateTime}
              hasSubtasks={subtasks.length > 0}
              initialTask={initialTask}
              projectId={projectId}
              setTitle={setTitle}
              setDescription={setDescription}
              handleParentStatusChange={handleParentStatusChange}
              setParentEstimateTime={setParentEstimateTime}
              handleOpenAssignModal={handleOpenAssignModal}
              formatTimeDisplay={formatTimeDisplay}
              formatEstimateDisplay={formatEstimateDisplay}
              parseTimeInput={parseTimeInput}
            />

            <SubtasksList
              subtasks={subtasks}
              isEditMode={isEditMode}
              isPersonal={isPersonal}
              setSubtasks={setSubtasks}
              handleSubtaskStatusChange={handleSubtaskStatusChange}
              handleUpdateSubTaskTitle={handleUpdateSubTaskTitle}
              handleOpenSubtaskAssignModal={handleOpenSubtaskAssignModal}
              updateSubtaskEstimate={updateSubtaskEstimate}
              removeSubtask={removeSubtask}
              addSubtask={addSubtask}
              formatTimeDisplay={formatTimeDisplay}
              formatEstimateDisplay={formatEstimateDisplay}
              parseTimeInput={parseTimeInput}
            />

            {initialTask?.notionPageId && (
              <NotionTaskProperties pageId={initialTask.notionPageId} />
            )}
          </div>
          <div className="px-6">
            <Label className="text-sm text-gray-600">Notes</Label>
            <Textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Add any notes..."
              className="mt-1 min-h-20 resize-none border-gray-200 focus:ring-1 focus:ring-blue-500"
            />
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

      {/* Import Task Section Selection Dialog */}
      <Dialog open={isOpen && showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent className="w-full max-w-md">
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold">Import Task to Personal Project</h2>
              <p className="text-sm text-gray-600 mt-1">Select a section in your personal project to import this task</p>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Section</Label>
              <Select value={selectedImportSection} onValueChange={setSelectedImportSection}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a section" />
                </SelectTrigger>
                <SelectContent>
                  {listSectionsPersonal?.map((section: any) => (
                    <SelectItem key={section.id} value={section.id}>
                      {section.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => {
                setShowImportDialog(false);
                setSelectedImportSection("");
              }}>
                Cancel
              </Button>
              <Button
                onClick={handleConfirmImport}
                disabled={!selectedImportSection}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Import
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
