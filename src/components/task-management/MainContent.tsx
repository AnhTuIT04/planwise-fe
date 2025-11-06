// components/task-management/MainContent.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { useProject } from "@/hooks/userProject";
import ProjectHeader from "./ProjectHeader";
import FilterBar from "./FilterBar/FilterBar";
import SectionColumn from "./SectionColumn/SectionColumn";
import AddSectionButton from "./SectionColumn/AddSectionButton";
import TaskModal from "@/components/ui/TaskModal";
import { createSection, updateSection } from "@/lib/section";
import { updateTask } from "@/lib/task";
import { filterTasksByDate } from "@/utils/dateFilter"; // Tách logic filter
import { ITask } from "@/types/task.type";

export default function MainContent() {
  const { project, isLoading, isFetching } = useProject();

  const [sections, setSections] = useState(project?.sections || []);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedSectionIds, setSelectedSectionIds] = useState<string[]>([]);
  const [dateFilter, setDateFilter] = useState<"all" | "selected_date" | "date_range">("all");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>({ start: null, end: null });
  const [isSelectingRange, setIsSelectingRange] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [showSectionFilter, setShowSectionFilter] = useState(false);
  const [isFilterLoading, setIsFilterLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<ITask | null>(null);
  const [dragData, setDragData] = useState<{ task: ITask; fromSectionId: string } | null>(null);
  const [dropTarget, setDropTarget] = useState<{
    sectionId: string;
    taskId: string | null | undefined;
    position: "before" | "after";
  } | null>(null);
  const [sectionUpdate, setSectionUpdate] = useState<{
    from: { id: string; listOfTask: string };
    to?: { id: string; listOfTask: string };
  } | null>(null);

  // Sync sections từ useProject
//   useEffect(() => {
//     if (initialSections.length > 0) {
//       setSections(initialSections);
//       setSelectedSectionIds(initialSections.map(s => s.id));
//     }
//   }, [initialSections]);

  useEffect(() => {
    if (project) setSelectedProjectId(project.id);
  }, [project]);

  // === Drag & Drop ===
  const handleDragStart = (task: ITask, sectionId: string) => (e: React.DragEvent) => {
    const data = { task, fromSectionId: sectionId };
    e.dataTransfer.setData("task", JSON.stringify(data));
    setDragData(data);
    (e.currentTarget as HTMLElement).classList.add("opacity-50");
  };

  const handleDragEnd = () => {
    setDropTarget(null);
    setDragData(null);
    document.querySelectorAll(".task-item").forEach(el => el.classList.remove("opacity-50"));
  };

  const handleDragOverTask = (sectionId: string, taskId: string) => (e: React.DragEvent) => {
    e.preventDefault();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const y = e.clientY - rect.top;
    const position = y < rect.height / 2 ? "before" : "after";
    setDropTarget({ sectionId, taskId, position });
  };
  const handleDrop = (sectionId: string) => (e: React.DragEvent) => {
    e.preventDefault();
    if (!dragData) return;

    const { task, fromSectionId } = dragData;
    if (fromSectionId === sectionId && dropTarget?.taskId === task.id) {
      setDragData(null);
      setDropTarget(null);
      return;
    }

    let newFromList = "";
    let newToList = "";

    setSections(prev => {
      const updated = prev.map(s => ({ ...s, tasks: [...s.tasks] }));
      const fromSection = updated.find(s => s.id === fromSectionId);
      const toSection = updated.find(s => s.id === sectionId);
      if (!fromSection || !toSection) return prev;

      // Remove from old
      fromSection.tasks = fromSection.tasks.filter(t => t.id !== task.id);
      task.sectionId = sectionId;

      // Insert into new position
      if (dropTarget?.taskId) {
        const idx = toSection.tasks.findIndex(t => t.id === dropTarget.taskId);
        const insertIdx = dropTarget.position === "before" ? idx : idx + 1;
        toSection.tasks.splice(insertIdx, 0, task);
      } else {
        toSection.tasks.push(task);
      }

      // Update listOfTask
      newFromList = fromSection.tasks.map(t => t.id).join(",");
      newToList = toSection.tasks.map(t => t.id).join(",");
      fromSection.listOfTask = newFromList;
      toSection.listOfTask = newToList;

      return updated;
    });

    // Update task section
    updateTask({
      id: task.id,
      sectionId,
      isPersonal: true,
    }).catch(() => toast.error("Failed to move task"));

    // Queue section update
    setSectionUpdate({
      from: { id: fromSectionId, listOfTask: newFromList },
      ...(fromSectionId !== sectionId ? { to: { id: sectionId, listOfTask: newToList } } : {}),
    });

    setDragData(null);
    setDropTarget(null);
  };

  // === Update Section Order ===
  useEffect(() => {
    if (!sectionUpdate) return;

    const { from, to } = sectionUpdate;
    const promises = [updateSection(from)];
    if (to) promises.push(updateSection(to));

    Promise.all(promises)
      .then(() => toast.success("Order saved"))
      .catch(() => toast.error("Failed to save order"))
      .finally(() => setSectionUpdate(null));
  }, [sectionUpdate]);

  // === Toggle Task Status ===
  const handleToggleStatus = async (taskId: string) => {
    const task = sections.flatMap(s => s.tasks).find(t => t.id === taskId);
    if (!task) return;

    const newStatus = task.status === "DONE" ? "TODO" : "DONE";

    try {
      const res = await updateTask({
        id: taskId,
        status: newStatus,
        isPersonal: true,
      });

      if (res.isSuccess) {
        setSections(prev =>
          prev.map(s => ({
            ...s,
            tasks: s.tasks.map(t =>
              t.id === taskId ? { ...t, status: newStatus } : t
            )
          }))
        );
        toast.success("Task updated");
      }
    } catch {
      toast.error("Failed to update task");
    }
  };
  const handleAddSection = async () => {
    const name = prompt("Section name:");
    if (!name || !selectedProjectId) return;

    try {
      const res = await createSection({ name, projectId: selectedProjectId });
      if (res.isSuccess) {
        toast.success("Section created");
        // Refresh project or add locally
      }
    } catch {
      toast.error("Failed to create section");
    }
  };
  // === Filter ===
  const filteredSections = sections?.filter(s => selectedSectionIds.includes(s.id));

  if (isLoading) return <div className="p-6 text-center">Loading...</div>;

  return (
    <main className="flex-1 overflow-y-auto bg-gray-100 p-6">
      <ProjectHeader project={project} selectedProjectId={selectedProjectId} />
      
      

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredSections?.map(section => {
          const tasks = filterTasksByDate(section.tasks, { dateFilter, selectedDate, dateRange });
          return (
            <SectionColumn
              key={section.id}
              section={section}
              tasks={tasks}
              isDropTarget={dropTarget?.sectionId === section.id}
              dropPosition={dropTarget?.sectionId === section.id ? dropTarget.position : null}
              dropTaskId={dropTarget?.taskId}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(section.id)}
              onAddTask={() => {
                setSelectedTask(null);
                setIsModalOpen(true);
              }}
              // onTaskClick={setSelectedTask}
              onTaskClick={(task) => {
                  setSelectedTask(task);
                  setIsModalOpen(true);
                }}
                onDragStart={handleDragStart}
                onDragOverTask={handleDragOverTask}
                onDragEnd={handleDragEnd}
                onToggleStatus={handleToggleStatus}
            />
          );
        })}
      </div>

      <AddSectionButton onClick={() => {handleAddSection}} />

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTask(null);
        }}
        initialTask={selectedTask}
        sections={sections}
        projectId={selectedProjectId!}
        isPersonal={true}
      />
    </main>
  );
}