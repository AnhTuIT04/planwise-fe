// components/task-management/MainContent.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { useProject } from "@/hooks/userProject";
import ProjectHeader from "./ProjectHeader";
import FilterBar from "./FilterBar/FilterBar";
import SectionColumn from "./SectionColumn/SectionColumn";
import AddSectionButton from "./SectionColumn/AddSectionButton";
import TaskModal from "@/components/ui/TaskModal";
import SectionModal from "@/components/ui/SectionModal"; // New Modal
import { createSection, updateSection } from "@/lib/section";
import { updateTask } from "@/lib/task";
import { filterTasksByDate } from "@/utils/dateFilter";
import { ITask } from "@/types/task.type";
import { ISection } from "@/types/section.type";

export default function MainContent() {
  const { project, isLoading, refetch } = useProject(); // Assume useProject has refetch from react-query

  const [sections, setSections] = useState<ISection[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedSectionIds, setSelectedSectionIds] = useState<string[]>([]);
  const [dateFilter, setDateFilter] = useState<"all" | "selected_date" | "date_range">("all");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>({ start: null, end: null });
  const [isSelectingRange, setIsSelectingRange] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [isFilterLoading, setIsFilterLoading] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false); // New state for SectionModal
  const [selectedTask, setSelectedTask] = useState<ITask | null>(null);
  const [initialSectionId, setInitialSectionId] = useState<string | null>(null);
  const [fromSectionDrop, setFromSectionDrop] = useState<string | undefined>(undefined);
  const [toSectionDrop, setToSectionDrop] = useState<string | undefined>(undefined);
  // Drag & Drop
  const [dragData, setDragData] = useState<{ task: ITask; fromSectionId: string } | null>(null);
  const [dropTarget, setDropTarget] = useState<{
    sectionId: string;
    taskId: string | null;
    position: "before" | "after";
  } | null>(null);
  const [sectionUpdate, setSectionUpdate] = useState<{
    from: { id: string; listOfTask: string };
    to?: { id: string; listOfTask: string };
  } | null>(null);

  // Sync project
  useEffect(() => {
    if (project) {
      setSelectedProjectId(project.id);
      setSections(project.sections || []);
      setSelectedSectionIds(project.sections?.map(s => s.id) || []);
    }
  }, [project]);

  // Update section order
  useEffect(() => {
    if (!sectionUpdate) 
      {
        console.log("unchange");
        return;
      }
      console.log("change");
    const { from, to } = sectionUpdate;
    const promises = [updateSection(from)];
    if (to) promises.push(updateSection(to));

    Promise.all(promises)
      .then(() => {
        toast.success("Order saved");
        refetch(); // Refetch sau update
      })
      .catch(() => toast.error("Failed to save order"))
      .finally(() => setSectionUpdate(null));
  }, [sectionUpdate, refetch]);

  // === Drag & Drop Handlers ===
  const handleDragStart = (task: ITask, sectionId: string) => (e: React.DragEvent) => {
    const data = { task, fromSectionId: sectionId };
    e.dataTransfer.setData("task", JSON.stringify(data));
    e.dataTransfer.effectAllowed = "move";
    setDragData(data);
    (e.currentTarget as HTMLElement).classList.add("opacity-50");
  };

  const handleDragEnd = () => {
    setDropTarget(null);
    setDragData(null);
    document.querySelectorAll(".task-item").forEach(el => el.classList.remove("opacity-50"));
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

    if (isSameSection && dropTarget?.taskId === task.id) {
      setDropTarget(null);
      setDragData(null);
      return;
    }

    let fromUpdate: { id: string; listOfTask: string } | null = null;
    let toUpdate: { id: string; listOfTask: string } | null = null;

    setSections(prev => {
      const updated = prev.map(s => ({ ...s, tasks: [...s.tasks] }));
      const fromSection = updated.find(s => s.id === fromSectionId);
      const toSection = updated.find(s => s.id === sectionId);

      if (!fromSection || !toSection) return prev;

      fromSection.tasks = fromSection.tasks.filter(t => t.id !== task.id);
      task.sectionId = sectionId;

      let insertIndex = toSection.tasks.length;
      if (dropTarget?.taskId) {
        const targetIndex = toSection.tasks.findIndex(t => t.id === dropTarget.taskId);
        insertIndex = dropTarget.position === "before" ? targetIndex : targetIndex + 1;
      }
      toSection.tasks.splice(insertIndex, 0, task);

      fromUpdate = { id: fromSectionId, listOfTask: fromSection.tasks.map(t => t.id).join(",") };
      toUpdate = { id: sectionId, listOfTask: toSection.tasks.map(t => t.id).join(",") };
      fromSection.listOfTask = fromSection.tasks.map((t) => t.id).join(",");
      toSection.listOfTask = toSection.tasks.map((t) => t.id).join(",");
      setFromSectionDrop(fromSection.listOfTask);
      setToSectionDrop(toSection.listOfTask);
      setSectionUpdate({
        from: { id: fromSectionId, listOfTask: fromSection.listOfTask },
        ...(fromSectionId !== sectionId ? { to: { id: sectionId, listOfTask: toSection.listOfTask } } : {}),
      });
      return updated;
    });

    if (fromUpdate) {
      console.log("updateeee");
      setSectionUpdate({
        from: fromUpdate,
        ...(fromSectionId !== sectionId && toUpdate ? { to: toUpdate } : {}),
      });
    }

    updateTask({ id: task.id, sectionId, isPersonal: true })
      .then(res => {
        if (res.isSuccess) toast.success("Task moved");
        else toast.error(res.message || "Move failed");
        // refetch(); 
      })
      .catch(() => toast.error("Failed to move task"));

    setDropTarget(null);
    setDragData(null);
  };

  const handleToggleStatus = async (taskId: string) => {
    const task = sections.flatMap(s => s.tasks).find(t => t.id === taskId);
    if (!task) return;

    const newStatus = task.status === "DONE" ? "TODO" : "DONE";

    try {
      const res = await updateTask({ id: taskId, status: newStatus, isPersonal: true });
      if (res.isSuccess) {
        setSections(prev =>
          prev.map(s => ({
            ...s,
            tasks: s.tasks.map(t => (t.id === taskId ? { ...t, status: newStatus } : t)),
          }))
        );
        toast.success("Task updated");
        refetch(); // Refetch sau update status
      }
    } catch {
      toast.error("Update failed");
    }
  };

  const handleCreateSection = async (name: string) => {
    if (!name || !selectedProjectId) return;

    try {
      const res = await createSection({ name, projectId: selectedProjectId });
      if (res.isSuccess) {
        toast.success("Section created");
        refetch(); // Refetch sau create section
      }
    } catch {
      toast.error("Failed to create section");
    }
  };

  // === Filter Logic ===
  const filteredSections = useMemo(() => {
    if (!sections) return [];
    return sections
      .filter(s => selectedSectionIds.includes(s.id))
      .map(section => ({
        ...section,
        tasks: filterTasksByDate(section.tasks, { dateFilter, selectedDate, dateRange }),
      }));
  }, [sections, selectedSectionIds, dateFilter, selectedDate, dateRange]);

  if (isLoading) return <div className="p-6 text-center">Loading...</div>;

  return (
    <main className="flex-1 overflow-y-auto bg-gray-100 p-6">
      <ProjectHeader project={project} selectedProjectId={selectedProjectId} />

      <FilterBar
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        dateRange={dateRange}
        setDateRange={setDateRange}
        isSelectingRange={isSelectingRange}
        setIsSelectingRange={setIsSelectingRange}
        calendarMonth={calendarMonth}
        setCalendarMonth={setCalendarMonth}
        isFilterLoading={isFilterLoading}
        setIsFilterLoading={setIsFilterLoading}
        sections={sections}
        selectedSectionIds={selectedSectionIds}
        setSelectedSectionIds={setSelectedSectionIds}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-6">
        {filteredSections.map(section => (
          <SectionColumn
            key={section.id}
            section={section}
            tasks={section.tasks}
            isDropTarget={dropTarget?.sectionId === section.id}
            dropPosition={dropTarget?.sectionId === section.id ? dropTarget.position : null}
            dropTaskId={dropTarget?.taskId}
            onDragOver={handleDragOverSection(section.id)}
            onDrop={handleDrop(section.id)}
            onAddTask={() => {
              setSelectedTask(null);
              setIsTaskModalOpen(true);
              setInitialSectionId(section.id);

            }}
            onTaskClick={task => {
              setSelectedTask(task);
              setIsTaskModalOpen(true);
            }}
            onDragStart={handleDragStart}
            onDragOverTask={handleDragOverTask}
            onDragEnd={handleDragEnd}
            onToggleStatus={handleToggleStatus}
          />
        ))}
        <AddSectionButton onClick={() => setIsSectionModalOpen(true)} />
      </div>

      

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setSelectedTask(null);
          refetch();
          setInitialSectionId(null);
        }}
        initialTask={selectedTask}
        sections={sections}
        projectId={selectedProjectId!}
        isPersonal={true}
        initialSectionId={initialSectionId}
      />

      <SectionModal
        isOpen={isSectionModalOpen}
        onClose={() => setIsSectionModalOpen(false)}
        onSave={handleCreateSection}
        projectId={selectedProjectId!}
      />
    </main>
  );
}