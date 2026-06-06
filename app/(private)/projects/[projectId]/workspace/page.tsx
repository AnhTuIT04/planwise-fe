"use client";

import { useProjectViewStore } from "@/stores/project-view.store";
import Project from "@/components/project";
import ProjectSkeleton from "@/components/project/skeleton";
import { use } from "react";

export default function Workspace({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = use(params);

  const hasHydrated = useProjectViewStore((state) => state.hasHydrated);
  const mode = useProjectViewStore((state) => (projectId ? state.getMode(projectId) : "kanban"));

  if (!projectId || !hasHydrated) {
    return <ProjectSkeleton />;
  }

  return <Project view={mode} projectId={projectId} isPersonal={false} />;
}
