"use client";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ListProjectSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((_, i) => (
        <Card
          key={i}
          className="flex flex-col gap-4 rounded-2xl border bg-white p-4 shadow-sm sm:p-6"
          aria-hidden="true"
        >
          <div className="flex items-start gap-4">
            <Skeleton className="h-12 w-12 rounded-full bg-[#eeeeee]" />
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <Skeleton className="h-5 w-3/5 bg-[#eeeeee]" />
              <Skeleton className="h-4 w-4/5 bg-[#eeeeee]" />
              <Skeleton className="h-3 w-1/3 bg-[#eeeeee]" />
            </div>
          </div>

          <div className="h-px bg-gray-200" />

          <div className="flex w-full flex-col gap-4 sm:flex-row sm:justify-between">
            <div className="flex w-full min-w-0 items-start gap-3 sm:w-1/2 sm:pr-4">
              <Skeleton className="size-10 rounded-full bg-[#eeeeee]" />
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <Skeleton className="h-4 w-2/3 bg-[#eeeeee]" />
                <Skeleton className="h-3 w-1/2 bg-[#eeeeee]" />
              </div>
            </div>

            <div className="flex w-full flex-col gap-2 text-xs sm:w-1/2">
              <Skeleton className="h-3 w-20 bg-[#eeeeee]" />
              <Skeleton className="h-3 w-24 bg-[#eeeeee]" />
              <Skeleton className="h-3 w-18 bg-[#eeeeee]" />
              <Skeleton className="mt-1 h-3 w-32 bg-[#eeeeee]" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
