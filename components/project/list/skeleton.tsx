import { Skeleton } from "@/components/ui/skeleton";
import SectionListSkeleton from "@/components/section/list/skeleton";

export default function ProjectListSkeleton() {
  return (
    <div className="flex h-full min-h-0 flex-1 flex-col">
      {[1, 2, 3].map((i) => (
        <SectionListSkeleton key={i} />
      ))}
      <div className="px-3 py-2">
        <Skeleton className="h-10 w-60 bg-[#eeeeee]" />
      </div>
    </div>
  );
}
