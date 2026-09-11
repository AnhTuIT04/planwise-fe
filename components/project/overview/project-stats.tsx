"use client";

import { useMemo, useState } from "react";
import { Bar, BarChart, Cell, Pie, PieChart, Area, AreaChart, XAxis, YAxis } from "recharts";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { useSection } from "@/hooks/use-section";
import { useProjectMember } from "@/hooks/use-project-member";
import { IProject } from "@/types/project.type";

const STATUS_COLORS: Record<string, string> = {
  TODO: "#94a3b8",
  RUNNING: "#3b82f6",
  DONE: "#10b981",
  ARCHIVED: "#cbd5e1",
};

const STATUS_LABEL: Record<string, string> = {
  TODO: "To do",
  RUNNING: "In progress",
  DONE: "Done",
  ARCHIVED: "Archived",
};

const statusConfig: ChartConfig = {
  TODO: { label: "To do", color: STATUS_COLORS.TODO },
  RUNNING: { label: "In progress", color: STATUS_COLORS.RUNNING },
  DONE: { label: "Done", color: STATUS_COLORS.DONE },
  ARCHIVED: { label: "Archived", color: STATUS_COLORS.ARCHIVED },
};

const barConfig: ChartConfig = {
  count: { label: "Tasks", color: "#6366f1" },
};

const activityConfig: ChartConfig = {
  count: { label: "Tasks created", color: "#f97316" },
};

function initials(name?: string | null) {
  if (!name) return "?";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

export default function ProjectStats({ project }: { project: IProject }) {
  const sectionsQuery = useSection(project.id);
  const membersQuery = useProjectMember(project.id);
  const [nowMs] = useState(() => Date.now());

  const sections = sectionsQuery.data;
  const members = membersQuery.data ?? [];

  const allTasks = useMemo(() => sections.flatMap((s) => s.tasks.data), [sections]);

  const statusData = useMemo(() => {
    const counts: Record<string, number> = { TODO: 0, RUNNING: 0, DONE: 0, ARCHIVED: 0 };
    for (const t of allTasks) counts[t.status] = (counts[t.status] ?? 0) + 1;
    return Object.entries(counts)
      .filter(([, v]) => v > 0)
      .map(([status, count]) => ({
        status,
        name: STATUS_LABEL[status] ?? status,
        count,
        fill: STATUS_COLORS[status] ?? "#94a3b8",
      }));
  }, [allTasks]);

  const totalTasks = allTasks.length;
  const doneCount = allTasks.filter((t) => t.status === "DONE").length;
  const percentDone = totalTasks > 0 ? Math.round((doneCount / totalTasks) * 100) : 0;

  const tasksPerSection = useMemo(
    () =>
      sections.map((s) => ({
        name: s.name.length > 14 ? s.name.slice(0, 13) + "…" : s.name,
        fullName: s.name,
        count: s.taskCount,
      })),
    [sections],
  );

  const activityData = useMemo(() => {
    const days = 14;
    const buckets = new Map<string, number>();
    const today = new Date(nowMs);
    today.setHours(0, 0, 0, 0);

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      buckets.set(d.toISOString().slice(0, 10), 0);
    }

    for (const t of allTasks) {
      const key = new Date(t.createdAt).toISOString().slice(0, 10);
      if (buckets.has(key)) buckets.set(key, (buckets.get(key) ?? 0) + 1);
    }

    return Array.from(buckets.entries()).map(([date, count]) => ({
      date: new Date(date).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
      count,
    }));
  }, [allTasks, nowMs]);

  const visibleMembers = members.slice(0, 5);
  const extraMembers = Math.max(0, members.length - visibleMembers.length);

  const daysSinceCreated = useMemo(() => {
    const created = new Date(project.createdAt).getTime();
    return Math.max(0, Math.floor((nowMs - created) / (1000 * 60 * 60 * 24)));
  }, [project.createdAt, nowMs]);

  return (
    <div className="grid shrink-0 grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm lg:col-span-2">
        <div className="mb-3 flex items-end justify-between">
          <div>
            <h3 className="text-sm font-semibold text-gray-700">Task status</h3>
            <p className="text-xs text-gray-500">
              {totalTasks} task{totalTasks === 1 ? "" : "s"} across {project.sectionCount} section
              {project.sectionCount === 1 ? "" : "s"}
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl leading-none font-bold text-emerald-600">{percentDone}%</div>
            <div className="text-xs text-gray-500">done</div>
          </div>
        </div>
        {totalTasks === 0 ? (
          <div className="flex h-48 items-center justify-center text-sm text-gray-400">No tasks yet</div>
        ) : (
          <ChartContainer config={statusConfig} className="h-48 w-full">
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
              <Pie data={statusData} dataKey="count" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={2}>
                {statusData.map((entry) => (
                  <Cell key={entry.status} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
        )}
        <div className="mt-2 flex flex-wrap justify-center gap-3 text-xs">
          {statusData.map((s) => (
            <div key={s.status} className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: s.fill }} />
              <span className="text-gray-600">{s.name}</span>
              <span className="font-semibold text-gray-800">{s.count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-700">Members</h3>
        <div className="mt-2 text-3xl leading-none font-bold">{project.memberCount}</div>
        <p className="text-xs text-gray-500">{project.memberCount === 1 ? "Just you" : "Collaborators"}</p>

        <div className="mt-4 flex -space-x-2">
          {visibleMembers.map((m) => (
            <Avatar key={m.id} className="h-9 w-9 border-2 border-white">
              {m.avatarUrl ? <AvatarImage src={m.avatarUrl} alt={m.fullname} /> : null}
              <AvatarFallback className="text-xs">{initials(m.fullname)}</AvatarFallback>
            </Avatar>
          ))}
          {extraMembers > 0 ? (
            <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-gray-100 text-xs font-medium text-gray-600">
              +{extraMembers}
            </div>
          ) : null}
        </div>

        <div className="mt-6 border-t border-gray-100 pt-4">
          <div className="text-xs text-gray-500">Active for</div>
          <div className="mt-0.5 text-lg font-semibold text-gray-800">
            {daysSinceCreated === 0 ? "Today" : `${daysSinceCreated} day${daysSinceCreated === 1 ? "" : "s"}`}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm lg:col-span-2">
        <h3 className="text-sm font-semibold text-gray-700">Tasks per section</h3>
        {tasksPerSection.length === 0 ? (
          <div className="flex h-48 items-center justify-center text-sm text-gray-400">No sections yet</div>
        ) : (
          <ChartContainer config={barConfig} className="mt-3 h-48 w-full">
            <BarChart data={tasksPerSection} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={11} />
              <YAxis allowDecimals={false} tickLine={false} axisLine={false} fontSize={11} />
              <ChartTooltip content={<ChartTooltipContent nameKey="count" labelKey="fullName" />} />
              <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ChartContainer>
        )}
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-700">Activity (14 days)</h3>
        <p className="text-xs text-gray-500">Tasks created per day</p>
        <ChartContainer config={activityConfig} className="mt-3 h-36 w-full">
          <AreaChart data={activityData} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="activity-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f97316" stopOpacity={0.45} />
                <stop offset="100%" stopColor="#f97316" stopOpacity={0} />
              </linearGradient>
            </defs>
            <ChartTooltip content={<ChartTooltipContent nameKey="count" labelKey="date" />} />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#f97316"
              strokeWidth={2}
              fill="url(#activity-fill)"
              dot={false}
            />
          </AreaChart>
        </ChartContainer>
      </div>
    </div>
  );
}
