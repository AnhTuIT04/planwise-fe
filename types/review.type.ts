import { ITaskPriority } from "@/types/task.type";

export type IReviewPeriod = "week" | "month";
export type IReviewBucket = "day" | "week";

export interface IReviewRange {
  from: string;
  to: string;
  prevFrom: string;
  prevTo: string;
}

export interface IReviewKpiDeltas {
  completed: number;
  timeSpentMs: number;
}

export interface IReviewKpis {
  completed: number;
  completionRate: number;
  onTimeRate: number;
  timeSpentMs: number;
  deltas: IReviewKpiDeltas;
}

export interface IReviewStatusBreakdown {
  done: number;
  running: number;
  todo: number;
  missed: number;
}

export interface IReviewTimelinePoint {
  date: string;
  completed: number;
  timeSpentMs: number;
}

export interface IReviewTimeline {
  bucket: IReviewBucket;
  points: IReviewTimelinePoint[];
}

export interface IReviewProject {
  id: string;
  name: string;
  logoUrl: string | null;
  total: number;
  completed: number;
  completionRate: number;
  timeSpentMs: number;
}

export type IReviewPriorityBreakdown = Record<ITaskPriority, number>;

export interface IReviewHighlights {
  mostProductiveDay: string | null;
  topProjectId: string | null;
  estimationAccuracy: number | null;
  lateFinishes: number;
}

export interface IReviewSummary {
  range: IReviewRange;
  kpis: IReviewKpis;
  statusBreakdown: IReviewStatusBreakdown;
  timeline: IReviewTimeline;
  projects: IReviewProject[];
  priorityBreakdown: IReviewPriorityBreakdown;
  highlights: IReviewHighlights;
}
