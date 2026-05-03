"use client";

import { useAuth } from "@/components/providers/auth-provider";
import { useProjectViewStore } from "@/stores/project-view.store";
import ProjectKanban from "@/components/project/kanban";
import ProjectKanbanSkeleton from "@/components/project/kanban/skeleton";
import ProjectList from "@/components/project/list";

export default function MyTasksPage() {
  const { user } = useAuth();
  const mode = useProjectViewStore((state) => (user ? state.getMode(user.workspaceId) : "kanban"));

  if (!user) {
    return <ProjectKanbanSkeleton />;
  }

  return (
    <div className="my-1 ml-1 flex min-h-0 flex-1 flex-col overflow-hidden rounded-l-[6px] border-y border-l border-[#dcdcdc] bg-[#f8f8f9] shadow-sm">
      {mode === "list" ? (
        <ProjectList projectId={user.workspaceId} isPersonal />
      ) : (
        <ProjectKanban projectId={user.workspaceId} isPersonal />
      )}
    </div>
  );
}
