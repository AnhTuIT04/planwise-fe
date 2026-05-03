import { Skeleton } from "@/components/ui/skeleton";
export default function RoleMembersSkeleton() {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-background">
      {/* Header Skeleton */}
      <div className="border-b bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-9 w-32" />
        </div>
      </div>

      {/* Search Bar Skeleton */}
      <div className="border-b bg-card px-6 py-3">
        <Skeleton className="h-9 w-full" />
      </div>

      {/* Table Skeleton */}
      <div className="flex-1 overflow-auto m-3 rounded-lg">
        <div className="w-full space-y-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-card rounded-lg">
              <div className="flex items-center gap-3">
                <Skeleton className="size-10 rounded-full" />
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
              </div>
              <Skeleton className="h-9 w-[180px]" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-9 w-20" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}