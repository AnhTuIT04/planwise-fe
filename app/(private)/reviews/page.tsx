"use client";

import { AlertCircle, Sparkles } from "lucide-react";

import { useAuth } from "@/components/providers/auth-provider";
import ActivityChart from "@/components/review/activity-chart";
import Highlights from "@/components/review/highlights";
import PeriodSelector from "@/components/review/period-selector";
import PriorityBreakdown from "@/components/review/priority-breakdown";
import ProjectsTable from "@/components/review/projects-table";
import StatusDonut from "@/components/review/status-donut";
import SummaryCards from "@/components/review/summary-cards";
import { Skeleton } from "@/components/ui/skeleton";
import { useReview } from "@/hooks/use-review";
import { useReviewStore } from "@/stores/review.store";

export default function ReviewPage() {
  const { user } = useAuth();
  const { period, anchor } = useReviewStore();
  const { data, isLoading, isError, error } = useReview(user?.id, period, anchor);

  return (
    <div className="my-1 ml-1 flex min-h-0 flex-1 flex-col overflow-hidden rounded-l-[6px] border-y border-l border-[#dcdcdc] bg-[#f8f8f9] shadow-sm">
      <div className="flex-1 overflow-auto px-5 py-4">
        <div className="mx-auto flex max-w-6xl flex-col gap-4">
          <PeriodSelector range={data?.range} isLoading={isLoading} />

          {!user || isLoading ? (
            <ReviewSkeleton />
          ) : isError ? (
            <ReviewError message={extractErrorMessage(error)} />
          ) : data ? (
            <>
              <SummaryCards kpis={data.kpis} />

              <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <ActivityChart timeline={data.timeline} />
                </div>
                <StatusDonut status={data.statusBreakdown} />
              </div>

              <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <ProjectsTable projects={data.projects} />
                </div>
                <PriorityBreakdown priority={data.priorityBreakdown} />
              </div>

              <Highlights highlights={data.highlights} projects={data.projects} />
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function ReviewSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-[110px] w-full rounded-xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        <Skeleton className="h-[280px] w-full rounded-xl lg:col-span-2" />
        <Skeleton className="h-[280px] w-full rounded-xl" />
      </div>
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        <Skeleton className="h-[320px] w-full rounded-xl lg:col-span-2" />
        <Skeleton className="h-[320px] w-full rounded-xl" />
      </div>
    </div>
  );
}

function ReviewError({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
      <AlertCircle className="size-4 shrink-0" />
      <span>Couldn&apos;t load your review: {message}</span>
    </div>
  );
}

function extractErrorMessage(error: unknown): string {
  if (!error) return "Unknown error";
  if (typeof error === "string") return error;
  if (typeof error === "object" && error !== null && "message" in error) {
    const m = (error as { message?: unknown }).message;
    if (typeof m === "string") return m;
  }
  return "Unknown error";
}
