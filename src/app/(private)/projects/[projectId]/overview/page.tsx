"use client";

import { use } from "react";
import { useProject } from "@/hooks/useProject";
import OverviewSkeleton from "@/components/project/overview/overview-skeleton";
import OverviewHeader from "@/components/project/overview/overview-header";
import ProjectStats from "@/components/project/overview/project-stats";

export default function OverviewPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = use(params);
  const {
    project,
    isLoading: isGettingProject,
    error: getProjectError,
    isFetching,
    updateProject,
    isUpdatingProject,
  } = useProject({ projectId });

  if (isGettingProject) {
    return <OverviewSkeleton />;
  }

  if (getProjectError || !project) {
    return (
      <div className="flex h-full w-full items-center justify-center text-red-500">
        Error loading project overview.
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <OverviewHeader
        project={project.project}
        isFetching={isFetching}
        isUpdatingProject={isUpdatingProject}
        onUpdateProject={updateProject}
      />
      <ProjectStats project={project.project} />
    </div>
  );
}
