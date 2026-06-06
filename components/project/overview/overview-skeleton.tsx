import { Skeleton } from "@/components/ui/skeleton";

export default function OverviewSkeleton() {
  return (
    <div className="my-1 ml-1 flex min-h-0 w-full flex-1 flex-col space-y-6 overflow-hidden rounded-l-[6px] border-y border-l border-[#dcdcdc] bg-[#f8f8f9] p-6 shadow-sm">
      {/* Header Skeleton */}
      <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-linear-to-br from-[#D60808]/12 via-[#700404]/6 to-transparent"
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
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm lg:col-span-2">
          <div className="mb-3 flex items-end justify-between">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-48" />
            </div>
            <div className="space-y-1 text-right">
              <Skeleton className="ml-auto h-8 w-16" />
              <Skeleton className="ml-auto h-3 w-10" />
            </div>
          </div>
          <div className="flex h-48 items-end gap-3 rounded-xl bg-gray-50/70 p-4">
            <div className="flex h-full w-full items-end justify-center gap-3">
              {[40, 72, 56, 88, 64, 96].map((height, i) => (
                <Skeleton key={i} className="w-8 rounded-t-md bg-[#eeeeee]" style={{ height }} />
              ))}
            </div>
          </div>
          <div className="mt-3 flex flex-wrap justify-center gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="h-2.5 w-2.5 rounded-full bg-[#eeeeee]" />
                <Skeleton className="h-3 w-16 bg-[#eeeeee]" />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="mt-2 h-8 w-12" />
          <Skeleton className="mt-1 h-3 w-20" />

          <div className="mt-4 flex -space-x-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-9 w-9 rounded-full border-2 border-white bg-[#eeeeee]" />
            ))}
            <Skeleton className="h-9 w-9 rounded-full border-2 border-white bg-[#eeeeee]" />
          </div>

          <div className="mt-6 border-t border-gray-100 pt-4">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="mt-1 h-6 w-24" />
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm lg:col-span-2">
          <Skeleton className="h-4 w-28" />
          <div className="mt-3 flex h-48 items-end gap-2 rounded-xl bg-gray-50/70 p-4">
            {[24, 56, 40, 72, 48, 88, 60].map((height, i) => (
              <Skeleton key={i} className="w-full rounded-t-md bg-[#eeeeee]" style={{ height }} />
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="mt-1 h-3 w-32" />
          <div className="mt-3 flex h-36 items-end gap-2 rounded-xl bg-gray-50/70 p-4">
            {[48, 72, 36, 84, 60, 28, 72].map((height, i) => (
              <Skeleton key={i} className="w-full rounded-t-md bg-[#eeeeee]" style={{ height }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
