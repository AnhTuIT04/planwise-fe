import { Skeleton } from "@/components/ui/skeleton";
import { Users, Layers, CheckSquare, TrendingUp, Calendar } from "lucide-react";

export default function OverviewSkeleton() {
  return (
    <div className="space-y-6 p-6">
      {/* Header Skeleton */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between">
          {/* Left: Project Title + Description */}
          <div className="max-w-3xl">
            <div className="flex items-center gap-2">
              <Skeleton className="h-12 w-12 rounded-full" />
              <Skeleton className="h-8 w-48" />
            </div>

            <Skeleton className="mt-4 h-16 w-full max-w-2xl" />

            {/* Owner Info Skeleton */}
            <div className="mt-6 w-fit rounded-xl border bg-gray-50 p-4 space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>

          {/* Right: Buttons Skeleton */}
          <div className="flex flex-col gap-3">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </div>

      {/* Stats Section Skeleton */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
        {/* Team Members */}
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-blue-100 p-4">
              <Users className="text-blue-700" />
            </div>
            <div className="flex-1 space-y-2">
              <Skeleton className="h-8 w-12" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </div>

        {/* Sections */}
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-green-100 p-4">
              <Layers className="text-green-700" />
            </div>
            <div className="flex-1 space-y-2">
              <Skeleton className="h-8 w-12" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        </div>

        {/* Total Tasks */}
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-purple-100 p-4">
              <CheckSquare className="text-purple-700" />
            </div>
            <div className="flex-1 space-y-2">
              <Skeleton className="h-8 w-12" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-orange-100 p-4">
              <TrendingUp className="text-orange-700" />
            </div>
            <div className="flex-1 space-y-2">
              <Skeleton className="h-8 w-12" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="mt-2 h-2 w-full rounded-full" />
            </div>
          </div>
        </div>

        {/* Created Date */}
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-gray-100 p-4">
              <Calendar className="text-gray-700" />
            </div>
            <div className="flex-1 space-y-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-12" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
