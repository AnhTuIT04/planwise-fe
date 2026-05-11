import { Skeleton } from "@/components/ui/skeleton";
import { Users, Layers, CheckSquare, CalendarDays } from "lucide-react";

export default function OverviewSkeleton() {
  return (
    <div className="space-y-6 p-6">
      {/* Header Skeleton */}
      <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-br from-[#D60808]/12 via-[#700404]/6 to-transparent"
        />
        <div className="relative p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="flex min-w-0 flex-1 items-start gap-4">
              <Skeleton className="h-16 w-16 shrink-0 rounded-full sm:h-20 sm:w-20" />
              <div className="min-w-0 flex-1 space-y-3">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-full max-w-md" />
                <Skeleton className="h-4 w-72" />
                <div className="flex gap-3 pt-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-4 w-28" />
                </div>
              </div>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2">
              <Skeleton className="h-10 w-32 rounded-lg" />
              <Skeleton className="h-10 w-32 rounded-lg" />
            </div>
          </div>
          <div className="mt-6 inline-flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/70 px-4 py-3">
            <Skeleton className="h-11 w-11 rounded-full" />
            <div className="space-y-1.5">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Skeleton */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { Icon: Users, bg: "bg-blue-100", color: "text-blue-700" },
          { Icon: Layers, bg: "bg-green-100", color: "text-green-700" },
          { Icon: CheckSquare, bg: "bg-purple-100", color: "text-purple-700" },
          { Icon: CalendarDays, bg: "bg-orange-100", color: "text-orange-700" },
        ].map(({ Icon, bg, color }, i) => (
          <div key={i} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-start gap-4">
              <div className={`rounded-xl ${bg} p-3`}>
                <Icon className={color} size={22} />
              </div>
              <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
