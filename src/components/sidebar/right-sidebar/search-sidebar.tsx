"use client";

import { useState, useMemo } from "react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Calendar as CalendarIcon, Filter, Search, X, AlertTriangle, Clock, Loader2, ClockAlert } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { useParams } from "next/navigation";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { useSearchTasks } from "@/hooks/useSearchTasks";
import { useAuth } from "@/hooks/useAuth";
import { useProject } from "@/hooks/useProject";
import useModal from "@/hooks/useModal";
import { ITask } from "@/types/task.type";
import { ISection } from "@/types/section.type";
import { useMembers } from "@/hooks/useMembersManagement";
import { useSection } from "@/hooks/useSection";
type TaskStatus = "TODO" | "RUNNING" | "DONE" | "ARCHIVED";
type TaskPriority = "LOW" | "NORMAL" | "HIGH" | "URGENT";

const STATUS_OPTIONS: { value: TaskStatus; label: string; color: string }[] = [
  { value: "TODO", label: "To Do", color: "bg-gray-100 text-gray-700" },
  { value: "RUNNING", label: "Running", color: "bg-blue-100 text-blue-700" },
  { value: "DONE", label: "Done", color: "bg-green-100 text-green-700" },
  { value: "ARCHIVED", label: "Archived", color: "bg-yellow-100 text-yellow-700" },
];

const PRIORITY_OPTIONS: { value: TaskPriority; label: string; color: string }[] = [
  { value: "LOW", label: "Low", color: "bg-gray-100 text-gray-700" },
  { value: "NORMAL", label: "Normal", color: "bg-blue-100 text-blue-700" },
  { value: "HIGH", label: "High", color: "bg-orange-100 text-orange-700" },
  { value: "URGENT", label: "Urgent", color: "bg-red-100 text-red-700" },
];

const DATE_PRESETS = [
  { label: "Anytime", value: "anytime" },
  { label: "Today", value: "today" },
  { label: "Yesterday", value: "yesterday" },
  { label: "Last 7 days", value: "last7days" },
  { label: "Last 30 days", value: "last30days" },
  { label: "Custom", value: "custom" },
];

export default function SearchSidebar() {
  const params = useParams();
  const projectId = params.projectId as string;
  const { user } = useAuth();
  const { openModal: openTaskModal } = useModal<"ADD_UPDATE_TASK">();
  console.log("Project ID in SearchSidebar:", projectId);
  const { project } = useProject({ projectId: projectId ? projectId : user?.workspaceId || "" });

  // Search & Filter state
  const { members } = useMembers(projectId, "", 1, 100);
  const { sections: sectionsPersonal } = useSection({ projectId: user?.workspaceId || "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [datePreset, setDatePreset] = useState("anytime");
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [selectedStatuses, setSelectedStatuses] = useState<TaskStatus[]>([]);
  const [selectedPriorities, setSelectedPriorities] = useState<TaskPriority[]>([]);
  const [selectedSections, setSelectedSections] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Calculate date range based on preset
  const calculatedDateRange = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    switch (datePreset) {
      case "today":
        return { from: today, to: now };
      case "yesterday":
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        return { from: yesterday, to: today };
      case "last7days":
        const last7 = new Date(today);
        last7.setDate(last7.getDate() - 7);
        return { from: last7, to: now };
      case "last30days":
        const last30 = new Date(today);
        last30.setDate(last30.getDate() - 30);
        return { from: last30, to: now };
      case "custom":
        return dateRange;
      default:
        return {};
    }
  }, [datePreset, dateRange]);

  // Search tasks
  const { tasks, isLoading, isFetching } = useSearchTasks({
    projectId: projectId ? projectId : user?.workspaceId || "",
    q: searchQuery || undefined,
    deadlineFrom: calculatedDateRange.from?.toISOString(),
    deadlineTo: calculatedDateRange.to?.toISOString(),
    statuses: selectedStatuses.length > 0 ? selectedStatuses : undefined,
    priorities: selectedPriorities.length > 0 ? selectedPriorities : undefined,
    sections: selectedSections.length > 0 ? selectedSections : undefined,
    enabled: !!(
      searchQuery ||
      datePreset !== "anytime" ||
      selectedStatuses.length ||
      selectedPriorities.length ||
      selectedSections.length
    ),
  });

  // Sections for filter
  const sections = project?.sections || [];
  function isOverdue(task: ITask): boolean {
    return task.deadline ? new Date(task.deadline) < new Date() && task.status !== "DONE" : false;
  }
  function isOverspent(task: ITask): boolean {
    return task.estimate > 0 && (task.spent || 0) > task.estimate;
  }
  // Filter tasks locally for overdue/overspent if needed
  const filteredTasks = useMemo(() => {
    // Create deep copy to avoid mutating original data
    return tasks.map((section) => ({
      ...section,
      tasks: section.tasks.map((task) => ({
        ...task,
        isOverdue: task.deadline && new Date(task.deadline) < new Date() && task.status !== "DONE",
        isOverspent: task.estimate > 0 && (task.spent || 0) > task.estimate,
      })),
    }));
  }, [tasks]);
  // Determine if we're in personal workspace or a project
  const effectiveProjectId = projectId || user?.workspaceId || "";
  const isPersonalMode = !projectId;

  const handleTaskClick = (task: ITask) => {
    const section = tasks.find((s) => s.tasks?.some((t) => t.id === task.id));

    openTaskModal({
      type: "ADD_UPDATE_TASK",
      data: {
        title: "Edit Task",
        action: "UPDATE",
        task: task,
        sectionId: section?.id || "",
        sectionName: section?.name || "",
        projectId: effectiveProjectId,
        isPersonal: isPersonalMode,
        listSections: sections.map((s) => ({ id: s.id, name: s.name })),
        listSectionsPersonal: sectionsPersonal,
        member: members!,
      },
    });
  };

  const clearFilters = () => {
    setSearchQuery("");
    setDatePreset("anytime");
    setDateRange({});
    setSelectedStatuses([]);
    setSelectedPriorities([]);
    setSelectedSections([]);
  };

  const hasActiveFilters =
    searchQuery ||
    datePreset !== "anytime" ||
    selectedStatuses.length > 0 ||
    selectedPriorities.length > 0 ||
    selectedSections.length > 0;

  const activeFilterCount = [
    datePreset !== "anytime",
    selectedStatuses.length > 0,
    selectedPriorities.length > 0,
    selectedSections.length > 0,
  ].filter(Boolean).length;

  return (
    <div className="flex h-full w-80 flex-col bg-[#f8f8f9] shadow-[-5px_0px_15px_rgba(0,0,0,0.05)]">
      {/* Header */}
      <div className="flex h-12 items-center justify-between border-b px-4">
        <h2 className="text-[16px] font-semibold text-[#787878]">Search</h2>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="h-7 text-xs text-gray-500">
            Clear all
          </Button>
        )}
      </div>

      {/* Search Input */}
      <div className="p-4 pb-2">
        <div className="relative">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="search"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-8 pl-9"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-2 px-4 pb-3">
        {/* Filter Button */}
        <Popover open={showFilters} onOpenChange={setShowFilters}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={cn("h-8 gap-1 text-xs", activeFilterCount > 0 && "border-blue-500 text-blue-600")}
            >
              <Filter className="h-3.5 w-3.5" />
              Filter
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-0" align="start">
            <div className="max-h-[400px] overflow-y-auto">
              {/* Status Filter */}
              <Collapsible defaultOpen>
                <CollapsibleTrigger className="flex w-full items-center justify-between px-4 py-2 text-sm font-medium hover:bg-gray-50">
                  Status
                  {selectedStatuses.length > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {selectedStatuses.length}
                    </Badge>
                  )}
                </CollapsibleTrigger>
                <CollapsibleContent className="px-4 pb-3">
                  <div className="space-y-2">
                    {STATUS_OPTIONS.map((status) => (
                      <label key={status.value} className="flex cursor-pointer items-center gap-2">
                        <Checkbox
                          checked={selectedStatuses.includes(status.value)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedStatuses([...selectedStatuses, status.value]);
                            } else {
                              setSelectedStatuses(selectedStatuses.filter((s) => s !== status.value));
                            }
                          }}
                        />
                        <Badge className={cn("text-xs", status.color)}>{status.label}</Badge>
                      </label>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* Priority Filter */}
              <Collapsible defaultOpen>
                <CollapsibleTrigger className="flex w-full items-center justify-between border-t px-4 py-2 text-sm font-medium hover:bg-gray-50">
                  Priority
                  {selectedPriorities.length > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {selectedPriorities.length}
                    </Badge>
                  )}
                </CollapsibleTrigger>
                <CollapsibleContent className="px-4 pb-3">
                  <div className="space-y-2">
                    {PRIORITY_OPTIONS.map((priority) => (
                      <label key={priority.value} className="flex cursor-pointer items-center gap-2">
                        <Checkbox
                          checked={selectedPriorities.includes(priority.value)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedPriorities([...selectedPriorities, priority.value]);
                            } else {
                              setSelectedPriorities(selectedPriorities.filter((p) => p !== priority.value));
                            }
                          }}
                        />
                        <Badge className={cn("text-xs", priority.color)}>{priority.label}</Badge>
                      </label>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* Section Filter */}
              {sections.length > 0 && (
                <Collapsible>
                  <CollapsibleTrigger className="flex w-full items-center justify-between border-t px-4 py-2 text-sm font-medium hover:bg-gray-50">
                    Section
                    {selectedSections.length > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {selectedSections.length}
                      </Badge>
                    )}
                  </CollapsibleTrigger>
                  <CollapsibleContent className="px-4 pb-3">
                    <div className="space-y-2">
                      {sections.map((section) => (
                        <label key={section.id} className="flex cursor-pointer items-center gap-2">
                          <Checkbox
                            checked={selectedSections.includes(section.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedSections([...selectedSections, section.id]);
                              } else {
                                setSelectedSections(selectedSections.filter((s) => s !== section.id));
                              }
                            }}
                          />
                          <span className="text-sm text-gray-700">{section.name}</span>
                        </label>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              )}
            </div>
          </PopoverContent>
        </Popover>

        {/* Date Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={cn("h-8 gap-1 text-xs", datePreset !== "anytime" && "border-blue-500 text-blue-600")}
            >
              <CalendarIcon className="h-3.5 w-3.5" />
              Date: {DATE_PRESETS.find((p) => p.value === datePreset)?.label}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <div className="flex">
              {/* Presets */}
              <div className="border-r p-2">
                {DATE_PRESETS.map((preset) => (
                  <button
                    key={preset.value}
                    onClick={() => setDatePreset(preset.value)}
                    className={cn(
                      "block w-full rounded px-3 py-1.5 text-left text-sm hover:bg-gray-100",
                      datePreset === preset.value && "bg-blue-50 text-blue-600",
                    )}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              {/* Custom Calendar */}
              {datePreset === "custom" && (
                <div className="p-2">
                  <Calendar
                    mode="range"
                    selected={{ from: dateRange.from, to: dateRange.to }}
                    onSelect={(range) => setDateRange({ from: range?.from, to: range?.to })}
                    numberOfMonths={1}
                    locale={vi}
                  />
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>

        {/* Session Filter - placeholder for future */}
        <Button variant="outline" size="sm" className="h-8 gap-1 text-xs">
          Session: all
        </Button>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-1 px-4 pb-3">
          {selectedStatuses.map((status) => {
            const opt = STATUS_OPTIONS.find((s) => s.value === status);
            return (
              <Badge key={status} variant="secondary" className="gap-1 pr-1 text-xs">
                {opt?.label}
                <button onClick={() => setSelectedStatuses(selectedStatuses.filter((s) => s !== status))}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            );
          })}
          {selectedPriorities.map((priority) => {
            const opt = PRIORITY_OPTIONS.find((p) => p.value === priority);
            return (
              <Badge key={priority} variant="secondary" className="gap-1 pr-1 text-xs">
                {opt?.label}
                <button onClick={() => setSelectedPriorities(selectedPriorities.filter((p) => p !== priority))}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            );
          })}
          {selectedSections.map((sectionId) => {
            const section = sections.find((s) => s.id === sectionId);
            return (
              <Badge key={sectionId} variant="secondary" className="gap-1 pr-1 text-xs">
                {section?.name}
                <button onClick={() => setSelectedSections(selectedSections.filter((s) => s !== sectionId))}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            );
          })}
        </div>
      )}

      {/* Search Results */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {isLoading || isFetching ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : !hasActiveFilters ? (
          <p className="py-4 text-center text-sm text-gray-500">Start typing to search...</p>
        ) : filteredTasks.length === 0 ? (
          <p className="py-4 text-center text-sm text-gray-500">No tasks found</p>
        ) : (
          <div className="space-y-6">
            {filteredTasks.map((section) => {
              // Nếu section không có task nào (sau filter) → bỏ qua
              if (section.tasks.length === 0) return null;

              return (
                <div key={section.id} className="space-y-2">
                  {/* Section Header */}
                  <div className="flex items-center gap-2 px-1">
                    <h3 className="text-xs font-semibold tracking-wider text-gray-500 uppercase">{section.name}</h3>
                    <span className="text-xs text-gray-400">({section.tasks.length})</span>
                  </div>

                  {/* Task List */}
                  <div className="space-y-2">
                    {section.tasks.map((task) => (
                      <div
                        key={task.id}
                        onClick={() => handleTaskClick(task)}
                        className={cn(
                          "cursor-pointer rounded-lg border bg-white p-3 transition-all hover:border-gray-300 hover:shadow-sm",
                          (isOverdue(task) || isOverspent(task)) && "border-l-4 border-l-red-500",
                        )}
                      >
                        <div className="mb-1 flex items-start justify-between">
                          <h4 className="flex-1 text-sm font-medium text-gray-900">
                            {task.title}
                            {task.subtasks.length > 0 && (
                              <span className="ml-2 text-xs text-gray-500">({task.subtasks.length} subtasks)</span>
                            )}
                          </h4>
                          <div className="flex items-center gap-1">
                            {isOverdue(task) && <AlertTriangle className="h-4 w-4 text-red-500" aria-label="Overdue" />}
                            {isOverspent(task) && (
                              <ClockAlert className="h-4 w-4 text-orange-500" aria-label="Overspent" />
                            )}
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          {/* Status */}
                          <Badge className={cn("text-xs", STATUS_OPTIONS.find((s) => s.value === task.status)?.color)}>
                            {task.status}
                          </Badge>

                          {/* Priority */}
                          <Badge
                            className={cn("text-xs", PRIORITY_OPTIONS.find((p) => p.value === task.priority)?.color)}
                          >
                            {task.priority}
                          </Badge>

                          {/* Assignee Avatars */}
                          {task.assignees.length > 0 && (
                            <div className="flex -space-x-1">
                              {task.assignees.slice(0, 3).map((assignee) => (
                                <div
                                  key={assignee.id}
                                  className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-gray-300 text-[10px] font-medium text-gray-700"
                                  title={assignee.fullname}
                                >
                                  {assignee.fullname.charAt(0)}
                                </div>
                              ))}
                              {task.assignees.length > 3 && (
                                <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-gray-200 text-[10px]">
                                  +{task.assignees.length - 3}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Deadline */}
                          {task.deadline && (
                            <span className={cn("text-xs", isOverdue(task) ? "text-red-500" : "text-gray-500")}>
                              {format(new Date(task.deadline), "dd/MM")}
                            </span>
                          )}

                          {/* Original Project (nếu có) */}
                          {task.originalProject && (
                            <span className="text-xs text-blue-600">#{task.originalProject.name}</span>
                          )}
                        </div>

                        {/* Section tag (nếu cần) */}
                        {/* <div className="mt-1 text-xs text-gray-400">#{section.name}</div> */}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
