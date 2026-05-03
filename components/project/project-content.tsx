"use client";

import { useState } from "react";
import type { DateRange } from "react-day-picker";
import { startOfDay, endOfDay } from "date-fns";
import { useProjectById } from "@/hooks/use-project";
import { useSection } from "@/hooks/use-section";
import { useAuth } from "@/hooks/use-auth";
import { useTaskQueryStore } from "@/stores/task-query.store";
import { IBasicSection } from "@/types/section.type";
// import SectionKanban from "@/components/section/section-kanban";
import AddSectionButton from "@/components/section/kanban/add-section-button";
import ProjectSkeleton from "./project-skeleton";
import ProjectKanban from "@/components/project/kanban";
import ProjectNav from "./project-nav";

type ProjectContentProps = { projectId: string };

export default function ProjectContent(param: ProjectContentProps) {
  const { user } = useAuth();
  
  // Date range state - default to today
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });

  const effectiveProjectId = param.projectId || user?.workspaceId || "";
  const queryStore = useTaskQueryStore();
  const params = queryStore.getQuery(effectiveProjectId);

  const { data: project, isLoading: isGettingProject, error: getProjectError } = useProjectById(effectiveProjectId);
  
  const { data: sections, isLoading: isGettingSections } = useSection(effectiveProjectId, {
    ...params,
    deadlineFrom: dateRange?.from?.toISOString(),
    deadlineTo: dateRange?.to?.toISOString(),
  });

  if (getProjectError) return <div>Lỗi: {getProjectError.message}</div>;

  const listSections = sections?.map((section: IBasicSection) => ({ id: section.id, name: section.name })) || [];

  return (
    <>
      <ProjectNav dateRange={dateRange} onDateRangeChange={setDateRange} />
      
      {isGettingProject || isGettingSections ? (
        <ProjectSkeleton sections={sections as any} />
      ) : getProjectError || !project ? (
        <div>Error loading project.</div>
      ) : (
        <main className="flex flex-1 overflow-auto">
          {sections?.map((section: any) => (
            <ProjectKanban 
              // key={section.id} 
              // section={section} 
              // listSections={listSections} 
              projectId={effectiveProjectId} 
              isPersonal={project.isPersonal}
            />
          ))}

          <AddSectionButton projectId={effectiveProjectId} />
        </main>
      )}
    </>
  );
}
