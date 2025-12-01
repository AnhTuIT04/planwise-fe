import ProjectContent from "@/components/project/project-content";

export default function MyTasksPage() {

  return (
    <div className="my-1 ml-1 flex flex-1 flex-col overflow-auto rounded-l-[6px] border-y border-l border-[#dcdcdc] bg-[#f8f8f9] shadow-sm">
      <ProjectContent projectId={""} />
    </div>
  );
}
