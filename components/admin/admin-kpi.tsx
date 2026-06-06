"use client";

import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";

import { cn } from "@/lib/utils";

const accents = {
  indigo: { icon: "bg-indigo-500/10 text-indigo-600", stroke: "#6366f1", fill: "#6366f1" },
  emerald: { icon: "bg-emerald-500/10 text-emerald-600", stroke: "#10b981", fill: "#10b981" },
  amber: { icon: "bg-amber-500/10 text-amber-600", stroke: "#f59e0b", fill: "#f59e0b" },
  rose: { icon: "bg-rose-500/10 text-rose-600", stroke: "#f43f5e", fill: "#f43f5e" },
} as const;

/**
 * Compact KPI tile with an optional sparkline and week-over-week delta chip.
 */
export function AdminKpi({
  label,
  value,
  icon: Icon,
  accent = "indigo",
  delta,
  deltaLabel,
  spark,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  accent?: keyof typeof accents;
  delta?: number;
  deltaLabel?: string;
  spark?: number[];
}) {
  const tone = accents[accent];
  const sparkData = spark?.map((v, i) => ({ i, v }));

  return (
    <div className="relative overflow-hidden rounded-2xl border border-black/[0.06] bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <span className={cn("flex size-8 items-center justify-center rounded-lg", tone.icon)}>
          <Icon className="size-4" />
        </span>
        {delta !== undefined && (
          <span
            className={cn(
              "flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-semibold",
              delta >= 0 ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600",
            )}
          >
            {delta >= 0 ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
            {delta >= 0 ? "+" : ""}
            {delta}
          </span>
        )}
      </div>
      <p className="mt-3 text-[28px] leading-none font-bold tracking-tight text-[#16181d]">{value}</p>
      <p className="mt-1.5 text-xs font-medium text-[#9095a1]">
        {label}
        {deltaLabel && <span className="font-normal"> · {deltaLabel}</span>}
      </p>
      {sparkData && sparkData.length > 1 && (
        <div className="pointer-events-none absolute right-0 bottom-0 left-0 h-10 opacity-60">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparkData} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={`spark-${accent}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={tone.fill} stopOpacity={0.25} />
                  <stop offset="100%" stopColor={tone.fill} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="v"
                stroke={tone.stroke}
                strokeWidth={1.5}
                fill={`url(#spark-${accent})`}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
