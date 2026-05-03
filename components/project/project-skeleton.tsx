import { Plus } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
// import SectionKanbanSkeleton from "@/components/section/section-kanban-skeleton";
import ProjectKanbanSkeleton from "@/components/project/kanban/skeleton";
interface ProjectSkeletonProps {
  sections?: {
    id: string;
    name: string;
    createdAt: string;
  }[];
}

export default function ProjectSkeleton({ sections }: ProjectSkeletonProps) {
  // return (
  //   <main className="flex flex-1 overflow-auto">
  //     {sections
  //       ? sections.map((section) => <SectionKanbanSkeleton key={section.id} sectionName={section.name} />)
  //       : [1, 2, 3].map((i) => <SectionKanbanSkeleton key={i} />)}

  //     {/* AddSectionButton skeleton */}
  //     <div className="-ml-4 h-full w-64 min-w-64 rounded-lg px-4 py-2">
  //       {sections ? (
  //         <button className="group mt-0.5 flex h-9 w-60 min-w-60 cursor-pointer items-center justify-start rounded border bg-white p-3 px-3 py-1.5 text-[14px] text-[#b4b4b4] shadow-[0_1px_1px_#0000001a] transition-shadow hover:border-[#dcdcdc] hover:shadow-[0_3px_6px_#0000001a]">
  //           <Plus className="mr-2 h-4 w-4" />
  //           <span className="group-hover:text-[#413f39]">Add section</span>
  //         </button>
  //       ) : (
  //         <Skeleton className="h-10 w-full bg-[#eeeeee]" />
  //       )}
  //     </div>
  //   </main>
  // );
  return <ProjectKanbanSkeleton />;
}
