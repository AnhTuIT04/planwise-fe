import { CalendarIcon, ChevronDownIcon, LayoutGridIcon, ListIcon } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import SectionSkeleton from "../section/skeleton";

export default function ProjectSkeleton() {
  return (
    <div className="my-1 flex min-h-0 flex-1 flex-col overflow-hidden rounded-l-[6px] border-y border-l border-[#dcdcdc] bg-[#f8f8f9] shadow-sm">
      {/* Header skeleton */}
      <div className="flex h-12 items-center justify-between border-b p-2">
        <div className="flex items-center gap-2">
          <div className="text-muted-foreground flex h-7 items-center justify-start gap-2 rounded-[6px] border border-[#e5e5e5] bg-white px-2! text-[12px] font-semibold">
            <CalendarIcon className="h-4 w-4" />
            <span>Deadline</span>
          </div>
          <div className="text-muted-foreground flex h-7 items-center justify-start gap-2 rounded-[6px] border border-[#e5e5e5] bg-white px-2! text-[12px] font-semibold">
            <span>Section</span>
            <ChevronDownIcon className="h-4 w-4" />
          </div>
        </div>

        <div className="inline-flex items-center gap-0.5 rounded border border-[#dcdcdc] bg-white p-0.5">
          <div className="flex h-7 w-7 items-center justify-center rounded bg-[#f0f0f0] text-[#413f39]">
            <LayoutGridIcon className="h-4 w-4" />
          </div>
          <div className="flex h-7 w-7 items-center justify-center rounded">
            <ListIcon className="h-4 w-4" />
          </div>
        </div>
      </div>

      {/* Main content skeleton */}
      <ProjectContentSkeleton />
    </div>
  );
}

export function ProjectContentSkeleton() {
  return (
    <main className="flex min-h-0 flex-1 overflow-x-auto overflow-y-hidden">
      {[1, 2, 3].map((i) => (
        <SectionSkeleton key={i} />
      ))}

      {/* AddSectionButton skeleton */}
      <div className="mt-2.5 ml-2 flex h-9 w-60 items-center justify-start rounded border bg-white pl-2 shadow-sm">
        <Skeleton className="h-4 w-25" />
      </div>
    </main>
  );
}
