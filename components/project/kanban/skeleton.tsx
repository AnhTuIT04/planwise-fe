import { Skeleton } from "@/components/ui/skeleton";
import SectionKanbanSkeleton from "@/components/section/kanban/skeleton";

export default function ProjectKanbanSkeleton() {
  return (
    <>
      {[1, 2, 3].map((i) => (
        <SectionKanbanSkeleton key={i} />
      ))}

      {/* AddSectionButton skeleton */}
      <div className="-ml-4 h-full w-64 min-w-64 rounded-lg px-4 py-2">
        <Skeleton className="h-10 w-full bg-[#eeeeee]" />
      </div>
    </>
  );
}
