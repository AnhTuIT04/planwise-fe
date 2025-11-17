"use client";

import { useProject } from "@/hooks/useProject";
import SectionKanban from "@/components/section/section-kanban";
import AddSectionButton from "@/components/section/add-section-button";
import ProjectSkeleton from "./project-skeleton";
import { useSection } from "@/hooks/useSection";

type ProjectContentProps = { personal: boolean } | { projectId: string };

export default function ProjectContent(param: ProjectContentProps) {
  const { project, isLoading: isGettingProject, error: getProjectError } = useProject(param);
  const {
    sections,
    isLoading: isGettingSections,
    error: getSessionError,
  } = useSection({ projectId: project?.id || "" });

  if (isGettingProject || isGettingSections) {
    return <ProjectSkeleton sections={project?.sections} />;
  }

  if (getProjectError || !project || getSessionError || !sections) {
    return <div>Error loading project.</div>;
  }

  return (
    <main className="flex flex-1 overflow-auto">
      {sections.map((section) => (
        <SectionKanban key={section.id} section={section} />
      ))}

      <AddSectionButton />
    </main>
  );
}
