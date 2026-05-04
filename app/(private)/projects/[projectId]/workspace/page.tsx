"use client";

import { use } from "react";

import ProjectKanban from "@/components/project/kanban";
import ProjectList from "@/components/project/list";
import { useProjectViewStore } from "@/stores/project-view.store";
import ProjectKanbanSkeleton from "@/components/project/kanban/skeleton";

export default function Workspace({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = use(params);

  const hasHydrated = useProjectViewStore((state) => state.hasHydrated);
  const mode = useProjectViewStore((state) => (projectId ? state.getMode(projectId) : "kanban"));

  if (!projectId || !hasHydrated) {
    return <ProjectKanbanSkeleton />;
  }

  return (
    <div className="my-1 ml-1 flex min-h-0 flex-1 flex-col overflow-hidden rounded-l-[6px] border-y border-l border-[#dcdcdc] bg-[#f8f8f9] shadow-sm">
      {mode === "list" ? (
        <ProjectList projectId={projectId} isPersonal />
      ) : (
        <ProjectKanban projectId={projectId} isPersonal />
      )}
    </div>
  );
}
