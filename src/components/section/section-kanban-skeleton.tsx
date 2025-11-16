import { Plus } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";

interface SectionKanbanSkeletonProps {
  sectionName?: string;
}

export default function SectionKanbanSkeleton({ sectionName }: SectionKanbanSkeletonProps) {
  return (
    <div className="h-full w-64 min-w-64 transition-all">
      {sectionName ? (
        <div>
          <div className="group flex items-center justify-between px-5 pt-4 pb-2">
            <h2 className="h-6 w-fit cursor-pointer border border-transparent border-b-transparent text-[16px] font-semibold text-[#413f39] hover:text-[#2caefd]">
              {sectionName}
            </h2>
          </div>

          <div className="px-2 pt-2">
            <button className="group flex w-full cursor-pointer items-center justify-start rounded border bg-white p-3 px-3 py-1.5 text-[14px] text-[#b4b4b4] shadow-[0_1px_1px_#0000001a] transition-shadow hover:border-[#dcdcdc] hover:shadow-[0_3px_6px_#0000001a]">
              <Plus className="mr-2 h-4 w-4" /> <span className="group-hover:text-[#413f39]">Add task</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between px-5 pt-4 pb-2">
          <Skeleton className="h-6 w-24 bg-[#eeeeee]" />
          <Skeleton className="h-6 w-6 rounded-md bg-[#eeeeee]" />
        </div>
      )}

      <div className="space-y-2 p-2">
        {/* Add Task Button */}
        {!sectionName && <Skeleton className="h-8 w-full bg-[#eeeeee]" />}

        {/* Task skeletons */}
        {[1, 2, 3].map((i) => (
          <TaskSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

function TaskSkeleton() {
  return (
    <div className="rounded border bg-white p-3 shadow-sm">
      {/* Priority + Estimate */}
      <div className="mb-2 flex items-center justify-between">
        <Skeleton className="h-4 w-10" />
        <Skeleton className="h-4 w-16" />
      </div>

      {/* Title */}
      <Skeleton className="h-4 w-40" />

      {/* Subtasks */}
      <div className="mt-3 space-y-2">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-32" />
      </div>

      {/* Checkbox */}
      <div className="mt-3 flex justify-end">
        <Skeleton className="h-5 w-5 rounded-full" />
      </div>
    </div>
  );
}
