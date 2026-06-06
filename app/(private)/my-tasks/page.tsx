"use client";

import { useAuth } from "@/components/providers/auth-provider";
import { useProjectViewStore } from "@/stores/project-view.store";
import Project from "@/components/project";
import ProjectSkeleton from "@/components/project/skeleton";

export default function MyTasksPage() {
  const { user } = useAuth();
  const hasHydrated = useProjectViewStore((state) => state.hasHydrated);
  const mode = useProjectViewStore((state) => (user ? state.getMode(user.workspaceId) : "kanban"));

  if (!user || !hasHydrated) {
    return <ProjectSkeleton />;
  }

  return <Project view={mode} projectId={user.workspaceId} isPersonal />;
}
