"use client";

import { useState } from "react";
import type { DateRange } from "react-day-picker";
import { startOfDay, endOfDay } from "date-fns";
import { useProject } from "@/hooks/useProject";
import { useAuth } from "@/hooks/useAuth";
import SectionKanban from "@/components/section/section-kanban";
import AddSectionButton from "@/components/section/add-section-button";
import ProjectSkeleton from "./project-skeleton";
import ProjectNav from "./project-nav";
// import { useSection } from "@/hooks/useSection";

type ProjectContentProps = { projectId: string };

export default function ProjectContent(param: ProjectContentProps) {
  const { user } = useAuth();
  
  // Date range state - default to today
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });

  const effectiveProjectId = param.projectId || user?.workspaceId || "";
  
  const { project, isLoading: isGettingProject, error: getProjectError } = useProject({
    projectId: effectiveProjectId,
    deadlineFrom: dateRange?.from?.toISOString(),
    deadlineTo: dateRange?.to?.toISOString(),
  });
  
  const { project: projectPersonal } = useProject({
    projectId: user?.workspaceId,
  });

  if (getProjectError) return <div>Lỗi: {getProjectError.message}</div>;
  // const listSectionsPersonal = projectPersonal?.sections.map((section) => ({ id: section.id, name: section.name })) || [];
  // const {
  //   sections,
  //   isLoading: isGettingSections,
  //   error: getSessionError,
  // } = useSection({ projectId: project?.id || "" });
  const listSections = project?.sections.map((section) => ({ id: section.id, name: section.name })) || [];
  console.log("project", project);
  console.log("getProjectError", getProjectError);

  return (
    <>
      <ProjectNav dateRange={dateRange} onDateRangeChange={setDateRange} />
      
      {isGettingProject ? (
        <ProjectSkeleton sections={project?.sections} />
      ) : getProjectError || !project ? (
        <div>Error loading project.</div>
      ) : (
        <main className="flex flex-1 overflow-auto">
          {project.sections?.map((section) => (
            <SectionKanban key={section.id} section={section} listSections={listSections} projectId={project.project?.id || ""} isPersonal={project.project?.isPersonal || false}/>
          ))}

          <AddSectionButton projectId={project.project?.id || ""} isPersonal={project.project?.isPersonal || false} />
        </main>
      )}
    </>
  );
}
