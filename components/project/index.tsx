import ProjectHeader from "./header";
import ProjectKanban from "./kanban";
import ProjectList from "./list";

interface ProjectProps {
  view: "kanban" | "list";
  projectId: string;
  isPersonal: boolean;
}

export default function Project({ view, projectId, isPersonal }: ProjectProps) {
  return (
    <div className="my-1 flex min-h-0 flex-1 flex-col overflow-hidden rounded-l-[6px] border-y border-l border-[#dcdcdc] bg-[#f8f8f9] shadow-sm">
      <ProjectHeader projectId={projectId} />

      {view === "kanban" && (
        <main className="flex min-h-0 flex-1 overflow-x-auto overflow-y-hidden">
          <ProjectKanban projectId={projectId} isPersonal={isPersonal} />
        </main>
      )}

      {view === "list" && (
        <main className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          <ProjectList projectId={projectId} isPersonal={isPersonal} />
        </main>
      )}
    </div>
  );
}
