"use client";

import { useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { format } from "date-fns";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { cn, formatTimeLabel } from "@/lib/utils";
import { IReviewTimeline } from "@/types/review.type";

type Mode = "completed" | "timeSpent";

const chartConfig = {
  completed: { label: "Tasks completed", color: "#6366f1" },
  timeSpent: { label: "Time spent", color: "#8b5cf6" },
} satisfies ChartConfig;

export default function ActivityChart({ timeline }: { timeline: IReviewTimeline }) {
  const [mode, setMode] = useState<Mode>("completed");

  const data = timeline.points.map((p) => ({
    date: p.date,
    completed: p.completed,
    timeSpent: p.timeSpentMs,
  }));

  return (
    <Card size="sm" className="min-w-0">
      <CardHeader>
        <CardTitle>Activity</CardTitle>
        <CardDescription>
          {mode === "completed" ? "Tasks completed per day" : "Time spent per day"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-3 inline-flex rounded-lg border border-[#dcdcdc] bg-white p-0.5 text-xs">
          {(["completed", "timeSpent"] as Mode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={cn(
                "rounded-md px-2.5 py-1 font-semibold transition",
                mode === m ? "bg-[#dcdcdc] text-foreground" : "text-[#787878] hover:text-foreground",
              )}
            >
              {m === "completed" ? "Tasks" : "Hours"}
            </button>
          ))}
        </div>
        <ChartContainer config={chartConfig} className="aspect-[16/6] w-full">
          <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={16}
              tickFormatter={(value: string) => format(new Date(value), "MMM d")}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  nameKey={mode}
                  labelFormatter={(label) => format(new Date(label as string), "EEE, MMM d")}
                  formatter={(value) =>
                    mode === "timeSpent"
                      ? formatTimeLabel(Number(value))
                      : `${value} ${Number(value) === 1 ? "task" : "tasks"}`
                  }
                />
              }
            />
            <Bar dataKey={mode} fill={`var(--color-${mode})`} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
