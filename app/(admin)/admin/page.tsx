"use client";

import Link from "next/link";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import { FolderKanban } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminMetricCard } from "@/components/admin/admin-metric-card";
import { AdminSectionCard } from "@/components/admin/admin-section-card";
import { useAdminStats } from "@/hooks/use-admin-stats";

export default function AdminOverviewPage() {
  const { data: stats, isLoading } = useAdminStats();

  if (isLoading || !stats) {
    return (
      <div className="space-y-5">
        <Skeleton className="h-32 w-full rounded-3xl" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-36 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-80 w-full rounded-xl" />
      </div>
    );
  }

  const { totals, growth, daily, recentUsers, recentProjects } = stats;
  const verifiedRate = totals.users > 0 ? Math.round((totals.verifiedUsers / totals.users) * 100) : 0;

  return (
    <div className="space-y-5">
      <AdminPageHeader
        eyebrow="Overview"
        title="Activity across the system"
        description="Track user growth, project creation, and the latest activity in PlanWise."
        tags={["Users", "Projects", "Growth"]}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <AdminMetricCard
          label="Total users"
          value={String(totals.users)}
          hint={growthHint(growth.newUsersThisWeek, growth.newUsersLastWeek, "users")}
          tone="sky"
        />
        <AdminMetricCard
          label="Total projects"
          value={String(totals.projects)}
          hint={growthHint(growth.newProjectsThisWeek, growth.newProjectsLastWeek, "projects")}
          tone="emerald"
        />
        <AdminMetricCard
          label="Verified rate"
          value={`${verifiedRate}%`}
          hint={`${totals.verifiedUsers} of ${totals.users} accounts verified.`}
          tone="amber"
        />
        <AdminMetricCard
          label="Disabled users"
          value={String(totals.disabledUsers)}
          hint="Accounts currently disabled by admin."
          tone="rose"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.4fr_0.6fr]">
        <AdminSectionCard title="Activity — last 30 days" description="New user signups and projects created per day.">
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={daily} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <defs>
                  <linearGradient id="fillUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="fillProjects" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" vertical={false} />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value: string) => format(parseISO(value), "MMM d")}
                  tick={{ fontSize: 11, fill: "#787878" }}
                  tickLine={false}
                  axisLine={false}
                  minTickGap={28}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 11, fill: "#787878" }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  labelFormatter={(value) => format(parseISO(String(value)), "MMM d, yyyy")}
                  contentStyle={{ borderRadius: 12, border: "1px solid #dcdcdc", fontSize: 12 }}
                />
                <Area
                  type="monotone"
                  dataKey="users"
                  name="New users"
                  stroke="#0ea5e9"
                  strokeWidth={2}
                  fill="url(#fillUsers)"
                />
                <Area
                  type="monotone"
                  dataKey="projects"
                  name="New projects"
                  stroke="#10b981"
                  strokeWidth={2}
                  fill="url(#fillProjects)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 flex items-center gap-4 text-xs text-[#787878]">
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-sky-500" /> New users
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-emerald-500" /> New projects
            </span>
          </div>
        </AdminSectionCard>

        <AdminSectionCard title="Project breakdown" description="Personal workspaces vs team projects.">
          <div className="space-y-4">
            <BreakdownBar
              label="Team projects"
              value={totals.teamProjects}
              total={totals.projects}
              barClass="bg-emerald-500"
            />
            <BreakdownBar
              label="Personal workspaces"
              value={totals.personalProjects}
              total={totals.projects}
              barClass="bg-sky-500"
            />
            <div className="rounded-2xl border border-[#f1eee7] bg-[#fbfaf7] p-4 text-sm leading-6 text-[#787878]">
              {growth.newProjectsThisWeek} project{growth.newProjectsThisWeek === 1 ? "" : "s"} created this week,{" "}
              {growth.newUsersThisWeek} new user{growth.newUsersThisWeek === 1 ? "" : "s"} joined.
            </div>
          </div>
        </AdminSectionCard>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <AdminSectionCard title="Recent signups" description="The latest users who joined the system.">
          <div className="space-y-3">
            {recentUsers.length === 0 && <EmptyHint text="No users yet." />}
            {recentUsers.map((user) => (
              <Link
                key={user.id}
                href={`/admin/users/${user.id}`}
                className="flex items-center justify-between gap-3 rounded-2xl border border-[#f1eee7] bg-[#fbfaf7] p-3 transition-colors hover:border-[#d5d0c7] hover:bg-white"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <Avatar className="size-9">
                    <AvatarImage src={user.avatarUrl ?? undefined} alt={user.fullname} />
                    <AvatarFallback>{getInitials(user.fullname)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate font-medium text-[#2d2b27]">{user.fullname}</p>
                    <p className="truncate text-sm text-[#787878]">{user.email}</p>
                  </div>
                </div>
                <span className="shrink-0 text-xs text-[#787878]">
                  {formatDistanceToNow(parseISO(user.createdAt), { addSuffix: true })}
                </span>
              </Link>
            ))}
          </div>
        </AdminSectionCard>

        <AdminSectionCard title="Recent projects" description="The latest projects created in the system.">
          <div className="space-y-3">
            {recentProjects.length === 0 && <EmptyHint text="No projects yet." />}
            {recentProjects.map((project) => (
              <Link
                key={project.id}
                href={`/admin/projects/${project.id}`}
                className="flex items-center justify-between gap-3 rounded-2xl border border-[#f1eee7] bg-[#fbfaf7] p-3 transition-colors hover:border-[#d5d0c7] hover:bg-white"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#f0efe9] text-[#787878]">
                    <FolderKanban className="size-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-medium text-[#2d2b27]">{project.name}</p>
                    <p className="truncate text-sm text-[#787878]">by {project.ownerName}</p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {project.isPersonal && (
                    <Badge variant="outline" className="border-sky-200 bg-sky-50 text-sky-700">
                      Personal
                    </Badge>
                  )}
                  <span className="text-xs text-[#787878]">
                    {formatDistanceToNow(parseISO(project.createdAt), { addSuffix: true })}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </AdminSectionCard>
      </div>
    </div>
  );
}

function growthHint(thisWeek: number, lastWeek: number, noun: string) {
  if (thisWeek === 0 && lastWeek === 0) return `No new ${noun} in the last two weeks.`;
  const direction = thisWeek >= lastWeek ? "up" : "down";
  return `${thisWeek} new this week (${direction} from ${lastWeek} last week).`;
}

function BreakdownBar({
  label,
  value,
  total,
  barClass,
}: {
  label: string;
  value: number;
  total: number;
  barClass: string;
}) {
  const percent = total > 0 ? Math.round((value / total) * 100) : 0;

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-sm">
        <span className="text-[#57534e]">{label}</span>
        <span className="font-medium text-[#2d2b27]">
          {value} <span className="font-normal text-[#787878]">({percent}%)</span>
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-[#f0efe9]">
        <div className={`h-full rounded-full ${barClass}`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

function EmptyHint({ text }: { text: string }) {
  return <p className="rounded-2xl border border-[#f1eee7] bg-[#fbfaf7] p-4 text-sm text-[#787878]">{text}</p>;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
