"use client";

import { use } from "react";
import { useProjectById, useProjectMutations } from "@/hooks/use-project";
import OverviewSkeleton from "@/components/project/overview/overview-skeleton";
import OverviewHeader from "@/components/project/overview/overview-header";
import ProjectStats from "@/components/project/overview/project-stats";

export default function OverviewPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = use(params);
  const { data: project, isLoading: isGettingProject, error: getProjectError, isFetching } = useProjectById(projectId);
  const { updateProjectMutation } = useProjectMutations();
  
  const handleUpdateProject = async (data: { id: string; name?: string; description?: string }) => {
    return await updateProjectMutation.mutateAsync({
      projectId: data.id,
      name: data.name,
      description: data.description,
    });
  };

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
        project={project}
        isFetching={isFetching}
        isUpdatingProject={updateProjectMutation.isPending}
        onUpdateProject={handleUpdateProject}
      />
      <ProjectStats project={project} />
    </div>
  );
}
