"use client";

import { useParams } from "next/navigation";

import { useProjectById, useProjectMutations } from "@/hooks/use-project";
import OverviewSkeleton from "@/components/project/overview/overview-skeleton";
import OverviewHeader from "@/components/project/overview/overview-header";
import ProjectStats from "@/components/project/overview/project-stats";

export default function OverviewPage() {
  const { projectId } = useParams();
  const {
    data: project,
    isLoading: isGettingProject,
    error: getProjectError,
    isFetching,
  } = useProjectById(projectId as string);
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
      <div className="flex h-full w-full items-center justify-center text-red-500">Error loading project overview.</div>
    );
  }

  return (
    <div className="my-1 ml-1 flex min-h-0 w-full flex-1 flex-col space-y-6 overflow-x-hidden overflow-y-auto rounded-l-[6px] border-y border-l border-[#dcdcdc] bg-[#f8f8f9] p-6 shadow-sm">
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
