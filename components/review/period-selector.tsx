"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, isSameYear } from "date-fns";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useReviewStore } from "@/stores/review.store";
import { IReviewPeriod, IReviewRange } from "@/types/review.type";

const OPTIONS: { value: IReviewPeriod; label: string }[] = [
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
];

function formatRangeLabel(range: IReviewRange | undefined, period: IReviewPeriod): string {
  if (!range) return "";
  const from = new Date(range.from);
  const to = new Date(range.to);
  if (period === "month") {
    return format(from, "MMMM yyyy");
  }
  const sameYear = isSameYear(from, to);
  const fromStr = format(from, sameYear ? "MMM d" : "MMM d, yyyy");
  const toStr = format(to, "MMM d, yyyy");
  return `${fromStr} – ${toStr}`;
}

export default function PeriodSelector({ range, isLoading }: { range: IReviewRange | undefined; isLoading: boolean }) {
  const { period, setPeriod, shiftAnchor, resetToToday } = useReviewStore();
  const label = formatRangeLabel(range, period);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <div
          role="tablist"
          aria-label="Review period"
          className="inline-flex rounded-lg border border-[#dcdcdc] bg-white p-0.5"
        >
          {OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              role="tab"
              aria-selected={period === opt.value}
              onClick={() => setPeriod(opt.value)}
              className={cn(
                "rounded-md px-3 py-1 text-xs font-semibold transition",
                period === opt.value ? "bg-[#dcdcdc] text-foreground" : "text-[#787878] hover:text-foreground",
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <Button variant="ghost" size="sm" onClick={resetToToday}>
          Today
        </Button>
      </div>

      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon-sm" aria-label="Previous period" onClick={() => shiftAnchor(-1)}>
          <ChevronLeft />
        </Button>
        <span className={cn("min-w-[140px] text-center text-sm font-semibold", isLoading && "opacity-50")}>
          {label || "—"}
        </span>
        <Button variant="ghost" size="icon-sm" aria-label="Next period" onClick={() => shiftAnchor(1)}>
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
}
