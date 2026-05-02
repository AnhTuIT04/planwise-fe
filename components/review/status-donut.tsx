"use client";

import { Cell, Pie, PieChart } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { IReviewStatusBreakdown } from "@/types/review.type";

const chartConfig: ChartConfig = {
  done: { label: "Done", color: "#10b981" },
  running: { label: "Running", color: "#6366f1" },
  todo: { label: "To Do", color: "#94a3b8" },
  missed: { label: "Missed", color: "#f43f5e" },
};

export default function StatusDonut({ status }: { status: IReviewStatusBreakdown }) {
  const data = [
    { key: "done", value: status.done },
    { key: "running", value: status.running },
    { key: "todo", value: status.todo },
    { key: "missed", value: status.missed },
  ];
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <Card size="sm" className="min-w-0">
      <CardHeader>
        <CardTitle>Status breakdown</CardTitle>
        <CardDescription>Where the period&apos;s tasks landed</CardDescription>
      </CardHeader>
      <CardContent>
        {total === 0 ? (
          <div className="flex h-[220px] items-center justify-center text-sm text-muted-foreground">No tasks in this period</div>
        ) : (
          <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[220px]">
            <PieChart>
              <ChartTooltip cursor={false} content={<ChartTooltipContent nameKey="key" hideLabel />} />
              <Pie data={data} dataKey="value" nameKey="key" innerRadius={50} strokeWidth={2}>
                {data.map((d) => (
                  <Cell key={d.key} fill={chartConfig[d.key].color} />
                ))}
              </Pie>
              <ChartLegend content={<ChartLegendContent nameKey="key" />} />
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
