"use client";

import { ArrowDown, ArrowUp, CheckCircle2, Clock, Minus, Target, Timer } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, formatTimeLabel } from "@/lib/utils";
import { IReviewKpis } from "@/types/review.type";

interface KpiTileProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  accent: "emerald" | "indigo" | "sky" | "amber";
  delta?: { direction: "up" | "down" | "flat"; label: string; positive: boolean };
  hint?: string;
}

const ACCENTS: Record<KpiTileProps["accent"], { bg: string; text: string; ring: string }> = {
  emerald: { bg: "bg-emerald-100", text: "text-emerald-600", ring: "ring-emerald-200" },
  indigo: { bg: "bg-indigo-100", text: "text-indigo-600", ring: "ring-indigo-200" },
  sky: { bg: "bg-sky-100", text: "text-sky-600", ring: "ring-sky-200" },
  amber: { bg: "bg-amber-100", text: "text-amber-600", ring: "ring-amber-200" },
};

function KpiTile({ icon: Icon, label, value, accent, delta, hint }: KpiTileProps) {
  const a = ACCENTS[accent];
  return (
    <Card size="sm" className={cn("min-w-0 ring-1", a.ring)}>
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardDescription className="text-xs uppercase tracking-wide">{label}</CardDescription>
          <span className={cn("flex size-7 items-center justify-center rounded-md", a.bg, a.text)}>
            <Icon className="size-4" />
          </span>
        </div>
        <CardTitle className="text-2xl font-semibold">{value}</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="truncate">{hint ?? ""}</span>
        {delta && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[11px] font-medium",
              delta.direction === "flat" && "bg-slate-100 text-slate-600",
              delta.direction !== "flat" && delta.positive && "bg-emerald-100 text-emerald-700",
              delta.direction !== "flat" && !delta.positive && "bg-rose-100 text-rose-700",
            )}
          >
            {delta.direction === "up" && <ArrowUp className="size-3" />}
            {delta.direction === "down" && <ArrowDown className="size-3" />}
            {delta.direction === "flat" && <Minus className="size-3" />}
            {delta.label}
          </span>
        )}
      </CardContent>
    </Card>
  );
}

function pctDelta(current: number, prev: number): { direction: "up" | "down" | "flat"; label: string; positive: boolean } {
  if (prev === 0 && current === 0) return { direction: "flat", label: "—", positive: true };
  if (prev === 0) return { direction: "up", label: "new", positive: true };
  const diff = current - prev;
  if (diff === 0) return { direction: "flat", label: "0%", positive: true };
  const pct = Math.round((diff / Math.max(prev, 1)) * 100);
  return {
    direction: diff > 0 ? "up" : "down",
    label: `${pct > 0 ? "+" : ""}${pct}%`,
    positive: diff > 0,
  };
}

export default function SummaryCards({ kpis }: { kpis: IReviewKpis }) {
  const completedPrev = kpis.completed - kpis.deltas.completed;
  const timePrev = kpis.timeSpentMs - kpis.deltas.timeSpentMs;

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <KpiTile
        icon={CheckCircle2}
        label="Tasks completed"
        value={`${kpis.completed}`}
        accent="emerald"
        delta={pctDelta(kpis.completed, completedPrev)}
        hint="vs previous period"
      />
      <KpiTile
        icon={Target}
        label="Completion rate"
        value={`${Math.round(kpis.completionRate * 100)}%`}
        accent="indigo"
        hint="completed / (completed + missed)"
      />
      <KpiTile
        icon={Clock}
        label="On-time rate"
        value={`${Math.round(kpis.onTimeRate * 100)}%`}
        accent="sky"
        hint="of tasks with a deadline"
      />
      <KpiTile
        icon={Timer}
        label="Time spent"
        value={kpis.timeSpentMs > 0 ? formatTimeLabel(kpis.timeSpentMs) : "0s"}
        accent="amber"
        delta={pctDelta(kpis.timeSpentMs, timePrev)}
        hint="vs previous period"
      />
    </div>
  );
}
