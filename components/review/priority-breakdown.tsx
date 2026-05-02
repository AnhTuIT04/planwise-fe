"use client";

import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { IReviewPriorityBreakdown } from "@/types/review.type";

const ORDER: { key: keyof IReviewPriorityBreakdown; label: string; color: string }[] = [
  { key: "LOW", label: "Low", color: "#0ea5e9" },
  { key: "NORMAL", label: "Normal", color: "#64748b" },
  { key: "HIGH", label: "High", color: "#f59e0b" },
  { key: "URGENT", label: "Urgent", color: "#f43f5e" },
];

const chartConfig = {
  count: { label: "Tasks" },
} satisfies ChartConfig;

export default function PriorityBreakdown({ priority }: { priority: IReviewPriorityBreakdown }) {
  const data = ORDER.map((o) => ({ priority: o.label, count: priority[o.key], color: o.color }));
  const total = data.reduce((sum, d) => sum + d.count, 0);

  return (
    <Card size="sm" className="min-w-0">
      <CardHeader>
        <CardTitle>By priority</CardTitle>
        <CardDescription>Completed tasks by priority</CardDescription>
      </CardHeader>
      <CardContent>
        {total === 0 ? (
          <div className="flex h-[160px] items-center justify-center text-sm text-muted-foreground">
            No completed tasks
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="aspect-[16/8] w-full">
            <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="priority" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis allowDecimals={false} width={28} tickLine={false} axisLine={false} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent nameKey="count" hideLabel />} />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {data.map((entry) => (
                  <Cell key={entry.priority} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
