"use client";

import { useState, useEffect, useRef } from "react";
import {
  format,
  isToday,
  isTomorrow,
  isThisWeek,
  isBefore,
  isAfter,
  isWithinInterval,
  parseISO,
  startOfDay,
  endOfDay,
  addDays,
  subDays,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import TaskModal from "@/components/ui/TaskModal";
import { getAllProjects, getPersonalProject } from "@/lib/project";
import { createSection, updateSection } from "@/lib/section";
import { createTask, updateTask } from "@/lib/task";

// === Types ===
interface Subtask {
  id: string;
  text: string;
  status: "TODO" | "DONE";
}

interface Task {
  id: string;
  title: string;
  description: string | null;
  subTask: Subtask[];
  priority: "LOW" | "MEDIUM" | "HIGH" | null;
  startDate: string | null;
  dueDate: string | null;
  createdAt: string;
  createdBy: string;
  status: "TODO" | "DONE";
  projectId: string;
  sectionId: string | null;
  assigneeIds: string[];
}

interface Section {
  id: string;
  name: string;
  projectId: string;
  listOfTask: string;
  tasks: Task[];
}

interface Project {
  id: string;
  name: string;
  isPersonal: boolean;
  sections: Section[];
}

// === Component ===
export default function MainContent() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dragData, setDragData] = useState<{ task: Task; fromSectionId: string } | null>(null);
  const [dropTarget, setDropTarget] = useState<{
    sectionId: string;
    taskId: string | null;
    position: "before" | "after";
  } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [fromSectionDrop, setFromSectionDrop] = useState<string | undefined>(undefined);
  const [toSectionDrop, setToSectionDrop] = useState<string | undefined>(undefined);
  const [sectionUpdate, setSectionUpdate] = useState<{
    from: { id: string; listOfTask: string };
    to?: { id: string; listOfTask: string };
  } | null>(null);

  // === Filter State ===
  const [showTodayOnly, setShowTodayOnly] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showDateFilterDropdown, setShowDateFilterDropdown] = useState(false);
  const [selectedSectionIds, setSelectedSectionIds] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>({ start: null, end: null });
  const [isSelectingRange, setIsSelectingRange] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState<Date>(new Date());
  const [dateFilter, setDateFilter] = useState<"all" | "selected_date" | "date_range">("all");
  const [isFilterLoading, setIsFilterLoading] = useState(false);
  const filterDropdownRef = useRef<HTMLDivElement>(null);
  const dateFilterDropdownRef = useRef<HTMLDivElement>(null);
  // === Load Data ===
  // useEffect(() => {
  //   async function loadData() {
  //     setIsLoading(true);
  //     try {
  //       const [allRes, personalRes] = await Promise.all([
  //         getAllProjects(),
  //         getPersonalProject(),
  //       ]);

  //       const allProjects = allRes.data || [];
  //       const personalProject = personalRes.data;

  //       const combined: Project[] = personalProject
  //         ? [personalProject, ...allProjects.filter(p => p.id !== personalProject.id)]
  //         : allProjects;

  //       setProjects(combined);

  //       if (personalProject) {
  //         setSections(personalProject.sections);
  //         setSelectedProjectId(personalProject.id);
  //       } else if (allProjects.length > 0) {
  //         setSections(allProjects[0].sections);
  //         setSelectedProjectId(allProjects[0].id);
  //       }
  //     } catch (error) {
  //       toast.error("Failed to load projects");
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   }

  //   loadData();
  // }, []);
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [allRes, personalRes] = await Promise.all([getAllProjects(), getPersonalProject()]);

        const allProjects = allRes.data || [];
        const personalProject = personalRes.data;

        const combined: Project[] = personalProject
          ? [personalProject, ...allProjects.filter((p) => p.id !== personalProject.id)]
          : allProjects;

        setProjects(combined);

        let targetProject = personalProject;
        if (!targetProject && allProjects.length > 0) {
          targetProject = allProjects[0];
        }

        if (targetProject) {
          // Initialize selectedSectionIds with all sections
          setSelectedSectionIds(targetProject.sections.map((s) => s.id));
          // === ĐỊNH NGHĨA KIỂU CHO TASK API ===
          interface RawTask {
            id: string;
            title: string;
            description: string | null;
            status: "TODO" | "DONE";
            priority: "LOW" | "MEDIUM" | "HIGH" | null;
            startDate: string | null;
            dueDate: string | null;
            createdAt: string;
            updatedAt?: string;
            createdBy?: string;
            sectionId: string;
            parentTaskId: string | null; // <-- cho phép null
            supervisorId: string | null;
            projectId: string;
            assignees: { id: string }[];
          }

          // === HÀM TRANSFORM SECTION ===
          const transformSection = (section: any): Section => {
            const rawTasks: RawTask[] = section.tasks || [];

            const taskMap = new Map<string, Task>();
            const rootTasks: Task[] = [];
            const subtaskMap = new Map<string, Subtask[]>();

            rawTasks.forEach((raw: RawTask) => {
              const isSubtask = raw.parentTaskId !== null;

              if (isSubtask && raw.parentTaskId) {
                const sub: Subtask = {
                  id: raw.id,
                  text: raw.title,
                  status: raw.status === "DONE" ? "DONE" : "TODO",
                };

                if (!subtaskMap.has(raw.parentTaskId)) {
                  subtaskMap.set(raw.parentTaskId, []);
                }
                subtaskMap.get(raw.parentTaskId)!.push(sub);
              } else if (!isSubtask) {
                // Task chính
                const task: Task = {
                  id: raw.id,
                  title: raw.title,
                  description: raw.description || null,
                  subTask: [],
                  priority: raw.priority || null,
                  startDate: raw.startDate || null,
                  dueDate: raw.dueDate || null,
                  createdAt: raw.createdAt,
                  createdBy: raw.createdBy || "",
                  status: raw.status || "TODO",
                  projectId: raw.projectId,
                  sectionId: raw.sectionId,
                  assigneeIds: raw.assignees?.map((a) => a.id) || [],
                };
                taskMap.set(task.id, task);
                rootTasks.push(task);
                console.log(" Added root task:", task);
              }
            });
            rootTasks.forEach((task: Task) => {
              if (subtaskMap.has(task.id)) {
                task.subTask = subtaskMap.get(task.id)!;
              }
            });
            console.log(" taskMap", rootTasks);
            const order = section.listOfTask
              .replaceAll('\"', "")
              .split(",")
              .map((id: string) => id.trim())
              .filter((id: string) => id && taskMap.has(id));

            const orderedTasks = order.length > 0 ? order.map((id: string) => taskMap.get(id)!) : rootTasks;

            const newListOfTask = orderedTasks.map((t: Task) => t.id).join(",");

            return {
              id: section.id,
              name: section.name,
              projectId: section.projectId,
              listOfTask: newListOfTask,
              tasks: orderedTasks,
            };
          };
          const transformedSections = targetProject.sections.map(transformSection);

          setSections(transformedSections);
          setSelectedProjectId(targetProject.id);
          console.log("transformedSections", transformedSections);
        }
      } catch (error) {
        toast.error("Failed to load projects");
      } finally {
        setIsLoading(false);
      }
    }

    // loadData();
    let isMounted = true;
    loadData().finally(() => {
      if (isMounted) setIsLoading(false);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // === Filter Effects ===
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target as Node)) {
        setShowFilterDropdown(false);
      }
      if (dateFilterDropdownRef.current && !dateFilterDropdownRef.current.contains(event.target as Node)) {
        setShowDateFilterDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!sectionUpdate) return;

    const { from, to } = sectionUpdate;
    const isPersonal = selectedProjectId === getPersonalProjectId();

    Promise.all([updateSection(from), to ? updateSection(to) : Promise.resolve()])
      .then(() => {
        toast.success("Updated");
        setSectionUpdate(null);
      })
      .catch(() => {
        toast.error("Update failed");
        setSectionUpdate(null);
      });
  }, [sectionUpdate]);
  // === Drag & Drop ===
  const handleDragStart = (task: Task, sectionId: string) => (e: React.DragEvent) => {
    const data = { task, fromSectionId: sectionId };
    e.dataTransfer.setData("task", JSON.stringify(data));
    e.dataTransfer.effectAllowed = "move";
    setDragData(data);
    (e.currentTarget as HTMLElement).classList.add("opacity-50");
  };

  const handleDragEnd = () => {
    setDropTarget(null);
    setDragData(null);
    document.querySelectorAll(".task-item").forEach((el) => el.classList.remove("opacity-50"));
  };

  const handleDragOverSection = (sectionId: string) => (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (!dropTarget || dropTarget.sectionId !== sectionId || dropTarget.taskId !== null) {
      setDropTarget({ sectionId, taskId: null, position: "after" });
    }
  };

  const handleDragOverTask = (sectionId: string, taskId: string) => (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const y = e.clientY - rect.top;
    const position = y < rect.height / 2 ? "before" : "after";
    setDropTarget({ sectionId, taskId, position });
  };

  const handleDrop = (sectionId: string) => (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!dragData) return;

    const { task, fromSectionId } = dragData;
    const isSameSection = fromSectionId === sectionId;

    // Nếu không thay đổi vị trí
    if (isSameSection && dropTarget?.taskId === task.id) {
      setDropTarget(null);
      setDragData(null);
      return;
    }
    let newFromList = "";
    let newToList = "";
    setSections((prev) => {
      const updated = prev.map((s) => ({ ...s, tasks: [...s.tasks] }));
      const fromSection = updated.find((s) => s.id === fromSectionId);
      const toSection = updated.find((s) => s.id === sectionId);

      if (!fromSection || !toSection) return prev;

      // Xóa khỏi section cũ
      fromSection.tasks = fromSection.tasks.filter((t) => t.id !== task.id);

      // Cập nhật sectionId
      task.sectionId = sectionId;

      // Thêm vào vị trí mới
      if (dropTarget?.taskId !== null) {
        const targetIndex = toSection.tasks.findIndex((t) => t.id === dropTarget?.taskId);
        const insertIndex = dropTarget?.position === "before" ? targetIndex : targetIndex + 1;
        toSection.tasks.splice(insertIndex, 0, task);
      } else {
        toSection.tasks.push(task);
      }

      // Cập nhật listOfTask
      fromSection.listOfTask = fromSection.tasks.map((t) => t.id).join(",");
      newFromList = fromSection.tasks.map((t) => t.id).join(",");
      toSection.listOfTask = toSection.tasks.map((t) => t.id).join(",");
      newToList = toSection.tasks.map((t) => t.id).join(",");
      setFromSectionDrop(newFromList);
      setToSectionDrop(newToList);
      setSectionUpdate({
        from: { id: fromSectionId, listOfTask: newFromList },
        ...(fromSectionId !== sectionId ? { to: { id: sectionId, listOfTask: newToList } } : {}),
      });
      console.log("fromSectionNewList", fromSectionDrop, fromSection);
      console.log("toSectionNewList", toSectionDrop, toSection);
      return updated;
    });
    // Gọi API
    updateTask({
      id: task.id,
      sectionId,
      isPersonal: selectedProjectId === getPersonalProjectId(),
    })
      .then((res) => {
        if (res.isSuccess) {
          toast.success("Task moved");
        } else {
          toast.error(res.message || "Failed to move");
        }
      })
      .catch(() => {
        toast.error("Failed to move task");
      });
    // setTimeout(() => {
    // updateSection({
    //   id: fromSectionId,
    //   // listOfTask: sections.find(s => s.id === fromSectionId)?.listOfTask || '',
    //   listOfTask: fromSectionDrop,
    // })
    //   .then(res => {
    //     if (!res.isSuccess) toast.error("Failed to update source section");
    //   })
    //   .catch(() => toast.error("Failed to update source section"));

    // // Cập nhật section đích (nếu khác)
    // if (fromSectionId !== sectionId) {
    //   updateSection({
    //     id: sectionId,
    //     // listOfTask: sections.find(s => s.id === sectionId)?.listOfTask || '',
    //     listOfTask: toSectionDrop,
    //   })
    //     .then(res => {
    //       if (!res.isSuccess) toast.error("Failed to update target section");
    //     })
    //     .catch(() => toast.error("Failed to update target section"));
    // }
    // console.log("fromSectionNewList", fromSectionDrop);
    // console.log("toSectionNewList", toSectionDrop);
    // }, 0);
    setDropTarget(null);
    setDragData(null);
  };

  // === Helpers ===
  const getPersonalProjectId = () => {
    return projects.find((p) => p.isPersonal)?.id || null;
  };

  const toggleSubtask = async (sectionId: string, taskId: string, subtaskId: string) => {
    toast.info("Subtask toggle not implemented");
  };

  const toggleTaskStatus = async (sectionId: string, taskId: string) => {
    const task = sections.flatMap((s) => s.tasks).find((t) => t.id === taskId);
    if (!task) return;

    const newStatus = task.status === "DONE" ? "TODO" : "DONE";

    try {
      const res = await updateTask({
        id: taskId,
        status: newStatus,
        isPersonal: selectedProjectId === getPersonalProjectId(),
      });
      if (res.isSuccess) {
        setSections((prev) =>
          prev.map((s) =>
            s.id === sectionId
              ? {
                  ...s,
                  tasks: s.tasks.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)),
                }
              : s,
          ),
        );
        toast.success("Task updated");
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  // === Save Task ===
  const handleSaveTask = async (taskData: {
    title: string;
    description: string;
    startDate: string;
    dueDate: string;
    priority: "LOW" | "MEDIUM" | "HIGH";
    sectionId: string;
    subtasks: string[];
  }) => {
    const payload = {
      ...taskData,
      projectId: selectedProjectId!,
      priority: taskData.priority,
      status: "TODO" as const,
    };

    try {
      const res = selectedTask
        ? await updateTask({
            id: selectedTask.id,
            ...payload,
            isPersonal: selectedProjectId === getPersonalProjectId(),
          })
        : await createTask(payload);

      if (res.isSuccess) {
        toast.success(selectedTask ? "Task updated" : "Task created");
        setIsModalOpen(false);
        setSelectedTask(null);

        const project = projects.find((p) => p.id === selectedProjectId);
        if (project) {
          setSections(project.sections);
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to save task");
    }
  };

  const handleAddSection = async () => {
    const name = prompt("Section name:");
    if (!name || !selectedProjectId) return;

    try {
      const res = await createSection({
        name,
        projectId: selectedProjectId,
      });
      if (res.isSuccess) {
        toast.success("Section created");
        const project = projects.find((p) => p.id === selectedProjectId);
        if (project) setSections(project.sections);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  // === Filter Functions ===
  const handleTodayFilter = () => {
    setShowDateFilterDropdown(!showDateFilterDropdown);
  };

  const handleGoToToday = async () => {
    setIsFilterLoading(true);
    const today = new Date();
    setSelectedDate(today);
    setCalendarMonth(today);

    // Simulate API delay
    setTimeout(() => {
      setDateFilter("selected_date");
      setIsFilterLoading(false);
    }, 300);
  };

  const handleGoToNextDay = async () => {
    setIsFilterLoading(true);
    const nextDay = addDays(selectedDate, 1);
    setSelectedDate(nextDay);
    setCalendarMonth(nextDay);

    // Simulate API delay
    setTimeout(() => {
      setDateFilter("selected_date");
      setIsFilterLoading(false);
    }, 300);
  };

  const handleGoToPreviousDay = async () => {
    setIsFilterLoading(true);
    const prevDay = subDays(selectedDate, 1);
    setSelectedDate(prevDay);
    setCalendarMonth(prevDay);

    // Simulate API delay
    setTimeout(() => {
      setDateFilter("selected_date");
      setIsFilterLoading(false);
    }, 300);
  };

  const handleDateSelect = async (date: Date) => {
    if (isSelectingRange) {
      handleRangeSelect(date);
    } else {
      setIsFilterLoading(true);
      setSelectedDate(date);

      // Simulate API delay
      setTimeout(() => {
        setDateFilter("selected_date");
        setShowDateFilterDropdown(false);
        setIsFilterLoading(false);
      }, 400);
    }
  };

  const handleRangeSelect = async (date: Date) => {
    if (!dateRange.start || (dateRange.start && dateRange.end)) {
      // Start new range
      setDateRange({ start: date, end: null });
    } else if (dateRange.start && !dateRange.end) {
      setIsFilterLoading(true);

      // Complete the range
      const start = dateRange.start;
      const end = date;

      // Ensure start is before end
      if (isBefore(start, end) || isSameDay(start, end)) {
        setDateRange({ start, end });
      } else {
        setDateRange({ start: end, end: start });
      }

      // Simulate API delay
      setTimeout(() => {
        setDateFilter("date_range");
        setShowDateFilterDropdown(false);
        setIsSelectingRange(false);
        setIsFilterLoading(false);
      }, 500);
    }
  };

  const handleStartRangeSelection = () => {
    setIsSelectingRange(true);
    setDateRange({ start: null, end: null });
    setDateFilter("date_range");
  };

  const handleCancelRangeSelection = () => {
    setIsSelectingRange(false);
    setDateRange({ start: null, end: null });
  };

  const handleResetDateFilter = async () => {
    setIsFilterLoading(true);
    setIsSelectingRange(false);
    setDateRange({ start: null, end: null });

    // Simulate API delay
    setTimeout(() => {
      setDateFilter("all");
      setShowDateFilterDropdown(false);
      setIsFilterLoading(false);
    }, 300);
  };

  const handlePreviousMonth = () => {
    setCalendarMonth(subMonths(calendarMonth, 1));
  };

  const handleNextMonth = () => {
    setCalendarMonth(addMonths(calendarMonth, 1));
  };

  const handleSectionToggle = async (sectionId: string) => {
    setIsFilterLoading(true);

    // Simulate API delay
    setTimeout(() => {
      setSelectedSectionIds((prev) =>
        prev.includes(sectionId) ? prev.filter((id) => id !== sectionId) : [...prev, sectionId],
      );
      setIsFilterLoading(false);
    }, 250);
  };

  const handleSelectAllSections = async () => {
    setIsFilterLoading(true);

    // Simulate API delay
    setTimeout(() => {
      setSelectedSectionIds(sections.map((s) => s.id));
      setIsFilterLoading(false);
    }, 300);
  };

  const handleDeselectAllSections = async () => {
    setIsFilterLoading(true);

    // Simulate API delay
    setTimeout(() => {
      setSelectedSectionIds([]);
      setIsFilterLoading(false);
    }, 300);
  };

  const filterTasksByDate = (tasks: Task[]) => {
    if (dateFilter === "all") return tasks;

    return tasks.filter((task) => {
      const startDate = task.startDate ? parseISO(task.startDate) : null;
      const dueDate = task.dueDate ? parseISO(task.dueDate) : null;

      if (dateFilter === "selected_date") {
        return (startDate && isSameDay(startDate, selectedDate)) || (dueDate && isSameDay(dueDate, selectedDate));
      }

      if (dateFilter === "date_range" && dateRange.start && dateRange.end) {
        const rangeStart = startOfDay(dateRange.start);
        const rangeEnd = endOfDay(dateRange.end);

        // Check if task's dates overlap with the selected range
        const taskStartInRange = startDate && isWithinInterval(startDate, { start: rangeStart, end: rangeEnd });
        const taskEndInRange = dueDate && isWithinInterval(dueDate, { start: rangeStart, end: rangeEnd });

        // Check if task spans across the range
        const taskSpansRange = startDate && dueDate && isBefore(startDate, rangeStart) && isAfter(dueDate, rangeEnd);

        return taskStartInRange || taskEndInRange || taskSpansRange;
      }

      return true;
    });
  };

  const filterTasks = (tasks: Task[]) => {
    return filterTasksByDate(tasks);
  };

  const getDateFilterLabel = () => {
    if (dateFilter === "selected_date") {
      if (isToday(selectedDate)) return "Today";
      return format(selectedDate, "MMM dd");
    }

    if (dateFilter === "date_range" && dateRange.start && dateRange.end) {
      const startLabel = format(dateRange.start, "MMM dd");
      const endLabel = format(dateRange.end, "MMM dd");
      return `${startLabel} - ${endLabel}`;
    }

    if (isSelectingRange) {
      return dateRange.start ? `${format(dateRange.start, "MMM dd")} - ...` : "Select range";
    }

    return "Today";
  };

  const generateCalendarDays = () => {
    const start = startOfMonth(calendarMonth);
    const end = endOfMonth(calendarMonth);
    const days = eachDayOfInterval({ start, end });

    // Add empty cells for days before the first day of month
    const startDay = start.getDay();
    const emptyDays = Array(startDay).fill(null);

    return [...emptyDays, ...days];
  };

  const filteredSections = sections.filter((section) => selectedSectionIds.includes(section.id));

  // === Render ===
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <main className="flex-1 overflow-y-auto bg-gray-100 p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative" ref={dateFilterDropdownRef}>
            <Button
              variant={dateFilter !== "all" ? "default" : "outline"}
              size="sm"
              onClick={handleTodayFilter}
              disabled={isFilterLoading}
            >
              {isFilterLoading ? (
                <>
                  <svg className="mr-2 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Loading...
                </>
              ) : (
                <>
                  {getDateFilterLabel()}
                  <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </>
              )}
            </Button>

            {showDateFilterDropdown && (
              <div className="absolute top-full left-0 z-50 mt-1 w-80 rounded-md border bg-white shadow-lg">
                <div className="p-4">
                  {/* Quick Actions */}
                  <div className="mb-4 space-y-2 border-b pb-4">
                    <button
                      onClick={handleResetDateFilter}
                      disabled={isFilterLoading}
                      className={`flex w-full items-center justify-between rounded px-3 py-2 text-left text-sm hover:bg-gray-100 ${
                        dateFilter === "all" ? "bg-blue-50 text-blue-700" : ""
                      } ${isFilterLoading ? "cursor-not-allowed opacity-50" : ""}`}
                    >
                      <span>All Tasks</span>
                    </button>
                    <button
                      onClick={handleGoToToday}
                      disabled={isFilterLoading}
                      className={`flex w-full items-center justify-between rounded px-3 py-2 text-left text-sm hover:bg-gray-100 ${
                        isFilterLoading ? "cursor-not-allowed opacity-50" : ""
                      }`}
                    >
                      <span>Go to today</span>
                      <span className="text-xs text-gray-400">⌘ Space</span>
                    </button>
                    <button
                      onClick={handleGoToNextDay}
                      disabled={isFilterLoading}
                      className={`flex w-full items-center justify-between rounded px-3 py-2 text-left text-sm hover:bg-gray-100 ${
                        isFilterLoading ? "cursor-not-allowed opacity-50" : ""
                      }`}
                    >
                      <span>Go to next day</span>
                      <span className="text-xs text-gray-400">⌘ →</span>
                    </button>
                    <button
                      onClick={handleGoToPreviousDay}
                      disabled={isFilterLoading}
                      className={`flex w-full items-center justify-between rounded px-3 py-2 text-left text-sm hover:bg-gray-100 ${
                        isFilterLoading ? "cursor-not-allowed opacity-50" : ""
                      }`}
                    >
                      <span>Go to previous day</span>
                      <span className="text-xs text-gray-400">⌘ ←</span>
                    </button>

                    {!isSelectingRange ? (
                      <button
                        onClick={handleStartRangeSelection}
                        disabled={isFilterLoading}
                        className={`flex w-full items-center justify-between rounded px-3 py-2 text-left text-sm hover:bg-gray-100 ${
                          dateFilter === "date_range" && !isSelectingRange ? "bg-blue-50 text-blue-700" : ""
                        } ${isFilterLoading ? "cursor-not-allowed opacity-50" : ""}`}
                      >
                        <span>Select date range</span>
                      </button>
                    ) : (
                      <div className="rounded bg-blue-50 px-3 py-2 text-sm">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="font-medium text-blue-700">
                            {!dateRange.start ? "Click start date" : "Click end date"}
                          </span>
                          <button
                            onClick={handleCancelRangeSelection}
                            className="text-xs text-red-600 hover:text-red-800"
                          >
                            Cancel
                          </button>
                        </div>
                        {dateRange.start && (
                          <div className="text-xs text-blue-600">
                            Start: {format(dateRange.start, "MMM dd, yyyy")}
                            {dateRange.end && <div className="mt-1">End: {format(dateRange.end, "MMM dd, yyyy")}</div>}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Range Display */}
                  {dateFilter === "date_range" && dateRange.start && dateRange.end && !isSelectingRange && (
                    <div className="mb-4 border-b pb-4">
                      <div className="rounded bg-green-50 px-3 py-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-green-700">Range Selected</span>
                          <button
                            onClick={() => {
                              setDateRange({ start: null, end: null });
                              setDateFilter("all");
                            }}
                            className="text-xs text-red-600 hover:text-red-800"
                          >
                            Clear
                          </button>
                        </div>
                        <div className="mt-1 text-xs text-green-600">
                          {format(dateRange.start, "MMM dd")} - {format(dateRange.end, "MMM dd, yyyy")}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Calendar */}
                  <div>
                    {/* Month Navigation */}
                    <div className="mb-4 flex items-center justify-between">
                      <button onClick={handlePreviousMonth} className="rounded p-1 hover:bg-gray-100">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <h3 className="text-sm font-medium">{format(calendarMonth, "MMMM yyyy")}</h3>
                      <button onClick={handleNextMonth} className="rounded p-1 hover:bg-gray-100">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>

                    {/* Week Days Header */}
                    <div className="mb-2 grid grid-cols-7 gap-1">
                      {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
                        <div key={index} className="p-1 text-center text-xs text-gray-500">
                          {day}
                        </div>
                      ))}
                    </div>

                    {/* Calendar Days */}
                    <div className="grid grid-cols-7 gap-1">
                      {generateCalendarDays().map((day, index) => {
                        if (!day) {
                          return <div key={index} className="p-2"></div>;
                        }

                        const isCurrentMonth = isSameMonth(day, calendarMonth);
                        const isCurrentDay = isToday(day);

                        // Single date selection logic
                        const isSelected =
                          !isSelectingRange && dateFilter === "selected_date" && isSameDay(day, selectedDate);

                        // Range selection logic
                        const isRangeStart = dateRange.start && isSameDay(day, dateRange.start);
                        const isRangeEnd = dateRange.end && isSameDay(day, dateRange.end);
                        const isInRange =
                          dateRange.start &&
                          dateRange.end &&
                          isWithinInterval(day, { start: dateRange.start, end: dateRange.end }) &&
                          !isSameDay(day, dateRange.start) &&
                          !isSameDay(day, dateRange.end);

                        let dayClassName = `rounded p-2 text-xs transition-colors hover:bg-gray-100 ${
                          !isCurrentMonth ? "text-gray-300" : "text-gray-700"
                        }`;

                        if (isSelected || isRangeStart || isRangeEnd) {
                          dayClassName += " bg-blue-500 text-white hover:bg-blue-600";
                        } else if (isInRange) {
                          dayClassName += " bg-blue-100 text-blue-700";
                        } else if (isCurrentDay) {
                          dayClassName += " bg-blue-50 text-blue-600 font-semibold";
                        }

                        if (isFilterLoading) {
                          dayClassName += " opacity-50 cursor-not-allowed";
                        }

                        return (
                          <button
                            key={day.toISOString()}
                            onClick={() => handleDateSelect(day)}
                            disabled={isFilterLoading}
                            className={dayClassName}
                          >
                            {format(day, "d")}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="relative" ref={filterDropdownRef}>
            <Button variant="outline" size="sm" onClick={() => setShowFilterDropdown(!showFilterDropdown)}>
              Filter
              <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </Button>

            {showFilterDropdown && (
              <div className="absolute top-full left-0 z-50 mt-1 w-64 rounded-md border bg-white shadow-lg">
                <div className="p-3">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-sm font-medium">Filter by Sections</h3>
                    <div className="flex gap-1">
                      <button
                        onClick={handleSelectAllSections}
                        disabled={isFilterLoading}
                        className={`text-xs hover:text-blue-800 ${isFilterLoading ? "text-gray-400" : "text-blue-600"}`}
                      >
                        All
                      </button>
                      <span className="text-xs text-gray-400">|</span>
                      <button
                        onClick={handleDeselectAllSections}
                        disabled={isFilterLoading}
                        className={`text-xs hover:text-blue-800 ${isFilterLoading ? "text-gray-400" : "text-blue-600"}`}
                      >
                        None
                      </button>
                    </div>
                  </div>

                  <div className="max-h-48 space-y-2 overflow-y-auto">
                    {sections.map((section) => (
                      <label key={section.id} className="flex cursor-pointer items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedSectionIds.includes(section.id)}
                          onChange={() => handleSectionToggle(section.id)}
                          disabled={isFilterLoading}
                          className={`h-4 w-4 rounded border-gray-300 ${isFilterLoading ? "cursor-not-allowed opacity-50" : ""}`}
                        />
                        <span className="text-sm text-gray-700">{section.name}</span>
                        <span className="text-xs text-gray-500">({filterTasksByDate(section.tasks).length})</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{projects.find((p) => p.id === selectedProjectId)?.name || "Tasks"}</h1>
      </div>

      <div className="relative">
        {isFilterLoading && (
          <div className="bg-opacity-80 absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-white">
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 animate-spin text-blue-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span className="text-sm text-gray-600">Filtering tasks...</span>
            </div>
          </div>
        )}

        <div
          className={`grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${isFilterLoading ? "opacity-50" : ""}`}
        >
          {filteredSections.map((section) => {
            const sectionTasks = filterTasks(section.tasks);

            return (
              <div
                key={section.id}
                className="rounded-lg border bg-white p-4"
                onDragOver={handleDragOverSection(section.id)}
                onDrop={handleDrop(section.id)}
              >
                <h2 className="mb-3 font-semibold">{section.name}</h2>

                <Button
                  className="mb-3 w-full"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedTask(null);
                    setIsModalOpen(true);
                  }}
                >
                  + Add task
                </Button>

                <div className="space-y-2">
                  {sectionTasks
                    .sort((a, b) => {
                      const order = section.listOfTask.split(",").filter(Boolean);
                      const aIndex = order.indexOf(a.id);
                      const bIndex = order.indexOf(b.id);
                      return (aIndex === -1 ? Infinity : aIndex) - (bIndex === -1 ? Infinity : bIndex);
                    })
                    .map((task) => {
                      const isOverBefore =
                        dropTarget?.sectionId === section.id &&
                        dropTarget.taskId === task.id &&
                        dropTarget.position === "before";
                      const isOverAfter =
                        dropTarget?.sectionId === section.id &&
                        dropTarget.taskId === task.id &&
                        dropTarget.position === "after";

                      return (
                        <div
                          key={task.id}
                          className={`task-item relative mb-2 cursor-move rounded border bg-white p-3 transition-all ${isOverBefore ? "border-t-4 border-blue-500" : ""} ${isOverAfter ? "border-b-4 border-blue-500" : ""}`}
                          draggable
                          onDragStart={handleDragStart(task, section.id)}
                          onDragEnd={handleDragEnd}
                          onDragOver={(e) => handleDragOverTask(section.id, task.id)(e)}
                          onClick={() => {
                            setSelectedTask(task);
                            setIsModalOpen(true);
                          }}
                        >
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">{task.title}</span>
                            <span className="text-xs text-gray-500">
                              {task.startDate && format(new Date(task.startDate), "HH:mm")}
                            </span>
                          </div>

                          {task?.subTask?.length > 0 && (
                            <div className="mt-2 space-y-1">
                              {task.subTask.map((st) => (
                                <label
                                  key={st.id}
                                  className="flex items-center gap-2 text-xs"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {/* <input
                                type="checkbox"
                                checked={st.status === 'DONE'}
                                onChange={() => toggleSubtask(section.id, task.id, st.id)}
                                className="w-3 h-3"
                              /> */}
                              <div
                                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all
                                  ${st.status === 'DONE'
                                    ? 'bg-green-500 border-green-500'
                                    : 'border-gray-400 bg-white'
                                  }`}
                                onClick={() => toggleSubtask(section.id, task.id, st.id)}
                              >
                                {st.status === 'DONE' && (
                                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                              </div>
                              <span className={st.status === 'DONE' ? '' : ''}>
                                {st.text}
                              </span>
                            </label>
                          ))}
                        </div>
                      )}

                          <div className="mt-2 flex items-center justify-between">
                            <span className="rounded bg-gray-100 px-2 py-1 text-xs">{task.priority}</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleTaskStatus(section.id, task.id);
                              }}
                              className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${task.status === "DONE" ? "border-green-500 bg-green-500" : "border-gray-400"}`}
                            >
                              {task.status === "DONE" && (
                                <svg
                                  className="h-3 w-3 text-white"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={3}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            );
          })}

        <div className="p-4 flex justify-center">
          <Button variant="outline" onClick={handleAddSection}>
            + Add Section
          </Button>
        </div>
      </div>
      </div>
      {/* <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTask(null);
        }}
        initialTask={selectedTask}
        sections={sections}
        projectId={selectedProjectId!}
        isPersonal={selectedProjectId === getPersonalProjectId()}
      /> */}
    </main>
  );
}
