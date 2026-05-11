"use client";

import { format } from "date-fns";
import { AlertTriangle, CalendarCheck, Crosshair, Trophy } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { IReviewHighlights, IReviewProject } from "@/types/review.type";

interface Props {
  highlights: IReviewHighlights;
  projects: IReviewProject[];
}

type Accent = "emerald" | "amber" | "violet" | "rose";

const ACCENTS: Record<Accent, { bg: string; text: string; ring: string }> = {
  emerald: { bg: "bg-emerald-100", text: "text-emerald-600", ring: "ring-emerald-200" },
  amber: { bg: "bg-amber-100", text: "text-amber-600", ring: "ring-amber-200" },
  violet: { bg: "bg-violet-100", text: "text-violet-600", ring: "ring-violet-200" },
  rose: { bg: "bg-rose-100", text: "text-rose-600", ring: "ring-rose-200" },
};

export default function Highlights({ highlights, projects }: Props) {
  const topProject = projects.find((p) => p.id === highlights.topProjectId);

  const accuracyLabel =
    highlights.estimationAccuracy === null
      ? "—"
      : `${Math.round(highlights.estimationAccuracy * 100)}%`;
  const accuracyHint =
    highlights.estimationAccuracy === null
      ? "No completed tasks with estimates"
      : highlights.estimationAccuracy <= 1
        ? "Under or on estimate"
        : "Over estimate";

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <HighlightCard
        icon={CalendarCheck}
        accent="emerald"
        label="Most productive day"
        value={highlights.mostProductiveDay ? format(new Date(highlights.mostProductiveDay), "EEE, MMM d") : "—"}
        hint={highlights.mostProductiveDay ? "Most tasks completed" : "No completions yet"}
      />
      <HighlightCard
        icon={Trophy}
        accent="amber"
        label="Top project"
        value={topProject?.name ?? "—"}
        hint={topProject ? `${topProject.completed} completed` : "No project activity"}
      />
      <HighlightCard
        icon={Crosshair}
        accent="violet"
        label="Estimation accuracy"
        value={accuracyLabel}
        hint={accuracyHint}
      />
      <HighlightCard
        icon={AlertTriangle}
        accent="rose"
        label="Late finishes"
        value={`${highlights.lateFinishes}`}
        hint="Completed after deadline"
      />
    </div>
  );
}

function HighlightCard({
  icon: Icon,
  accent,
  label,
  value,
  hint,
}: {
  icon: React.ComponentType<{ className?: string }>;
  accent: Accent;
  label: string;
  value: string;
  hint: string;
}) {
  const a = ACCENTS[accent];
  return (
    <Card size="sm" className={cn("min-w-0 ring-1", a.ring)}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <span className={cn("flex size-7 items-center justify-center rounded-md", a.bg, a.text)}>
            <Icon className="size-4" />
          </span>
          <CardDescription className="text-xs uppercase tracking-wide">{label}</CardDescription>
        </div>
        <CardTitle className="truncate text-base">{value}</CardTitle>
      </CardHeader>
      <CardContent className="text-xs text-muted-foreground">{hint}</CardContent>
    </Card>
  );
}
