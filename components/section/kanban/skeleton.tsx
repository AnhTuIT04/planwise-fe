import { Skeleton } from "@/components/ui/skeleton";

export default function SectionKanbanSkeleton() {
  return (
    <div className="h-full w-64 min-w-64 transition-all">
      <div className="flex items-center justify-between px-5 pt-4 pb-2">
        <Skeleton className="h-6 w-24 bg-[#eeeeee]" />
        <Skeleton className="h-6 w-6 rounded-md bg-[#eeeeee]" />
      </div>

      <div className="space-y-2 p-2">
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
