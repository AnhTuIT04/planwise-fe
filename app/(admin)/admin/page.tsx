"use client";

import Link from "next/link";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import { CheckSquare, FolderKanban, UserX, Users } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminKpi } from "@/components/admin/admin-kpi";
import { AdminPanel } from "@/components/admin/admin-panel";
import { AdminPageTitle } from "@/components/admin/admin-page-title";
import { useAdminStats } from "@/hooks/use-admin-stats";

const COLORS = {
  indigo: "#6366f1",
  violet: "#8b5cf6",
  emerald: "#10b981",
  amber: "#f59e0b",
  rose: "#f43f5e",
  sky: "#0ea5e9",
};

const tooltipStyle = {
  borderRadius: 12,
  border: "1px solid rgba(0,0,0,0.08)",
  boxShadow: "0 8px 24px -12px rgba(0,0,0,0.25)",
  fontSize: 12,
};

export default function AdminDashboardPage() {
  const { data: stats, isLoading } = useAdminStats();

  if (isLoading || !stats) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64 rounded-xl" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
        <div className="grid gap-4 xl:grid-cols-3">
          <Skeleton className="h-80 rounded-2xl xl:col-span-2" />
          <Skeleton className="h-80 rounded-2xl" />
        </div>
      </div>
    );
  }

  const { totals, growth, daily, authMethods, topProjects, recentUsers, recentProjects } = stats;

  const projectMix = [
    { name: "Team", value: totals.teamProjects, color: COLORS.indigo },
    { name: "Personal", value: totals.personalProjects, color: COLORS.violet },
  ];

  const weekComparison = [
    { name: "Last week", users: growth.newUsersLastWeek, projects: growth.newProjectsLastWeek },
    { name: "This week", users: growth.newUsersThisWeek, projects: growth.newProjectsThisWeek },
  ];

  const authTotal = Math.max(authMethods.email + authMethods.google + authMethods.github, 1);
  const authRows = [
    { label: "Email & password", value: authMethods.email, color: COLORS.indigo },
    { label: "Google", value: authMethods.google, color: COLORS.amber },
    { label: "GitHub", value: authMethods.github, color: COLORS.sky },
  ];

  const maxTopMembers = Math.max(...topProjects.map((p) => p.memberCount), 1);
  const usersSpark = daily.slice(-14).map((d) => d.users);
  const projectsSpark = daily.slice(-14).map((d) => d.projects);

  return (
    <div className="space-y-4">
      <AdminPageTitle title="Dashboard" subtitle="What's happening across PlanWise right now." />

      {/* KPI row */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminKpi
          label="Total users"
          value={String(totals.users)}
          icon={Users}
          accent="indigo"
          delta={growth.newUsersThisWeek}
          deltaLabel="this week"
          spark={usersSpark}
        />
        <AdminKpi
          label="Total projects"
          value={String(totals.projects)}
          icon={FolderKanban}
          accent="emerald"
          delta={growth.newProjectsThisWeek}
          deltaLabel="this week"
          spark={projectsSpark}
        />
        <AdminKpi label="Tasks in system" value={String(totals.tasks)} icon={CheckSquare} accent="amber" />
        <AdminKpi label="Disabled accounts" value={String(totals.disabledUsers)} icon={UserX} accent="rose" />
      </div>

      {/* Growth + project mix */}
      <div className="grid gap-4 xl:grid-cols-3">
        <AdminPanel
          title="Growth"
          subtitle="New users and projects per day — last 30 days"
          className="xl:col-span-2"
          action={
            <div className="flex items-center gap-3 text-[11px] font-medium text-[#9095a1]">
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full" style={{ background: COLORS.indigo }} /> Users
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full" style={{ background: COLORS.emerald }} /> Projects
              </span>
            </div>
          }
        >
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={daily} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={COLORS.indigo} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={COLORS.indigo} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gProjects" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={COLORS.emerald} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={COLORS.emerald} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="0" stroke="rgba(0,0,0,0.04)" vertical={false} />
                <XAxis
                  dataKey="date"
                  tickFormatter={(v: string) => format(parseISO(v), "MMM d")}
                  tick={{ fontSize: 11, fill: "#9095a1" }}
                  tickLine={false}
                  axisLine={false}
                  minTickGap={32}
                />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#9095a1" }} tickLine={false} axisLine={false} />
                <Tooltip
                  labelFormatter={(v) => format(parseISO(String(v)), "MMM d, yyyy")}
                  contentStyle={tooltipStyle}
                />
                <Area
                  type="monotone"
                  dataKey="users"
                  name="New users"
                  stroke={COLORS.indigo}
                  strokeWidth={2.5}
                  fill="url(#gUsers)"
                />
                <Area
                  type="monotone"
                  dataKey="projects"
                  name="New projects"
                  stroke={COLORS.emerald}
                  strokeWidth={2.5}
                  fill="url(#gProjects)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </AdminPanel>

        <AdminPanel title="Project mix" subtitle="Team projects vs personal workspaces">
          <div className="relative h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={projectMix}
                  dataKey="value"
                  nameKey="name"
                  innerRadius="68%"
                  outerRadius="92%"
                  paddingAngle={3}
                  cornerRadius={6}
                  stroke="none"
                >
                  {projectMix.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-3xl font-bold tracking-tight text-[#16181d]">{totals.projects}</p>
              <p className="text-[11px] font-medium text-[#9095a1]">projects</p>
            </div>
          </div>
          <div className="mt-4 space-y-2.5">
            {projectMix.map((entry) => (
              <div key={entry.name} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-[#6b7280]">
                  <span className="size-2.5 rounded-sm" style={{ background: entry.color }} />
                  {entry.name}
                </span>
                <span className="font-semibold text-[#16181d]">
                  {entry.value}
                  <span className="ml-1.5 font-normal text-[#9095a1]">
                    {totals.projects > 0 ? Math.round((entry.value / totals.projects) * 100) : 0}%
                  </span>
                </span>
              </div>
            ))}
            <div className="mt-3 rounded-xl bg-[#f4f4f6] px-3 py-2.5 text-xs leading-5 text-[#6b7280]">
              {totals.verifiedUsers} of {totals.users} users verified (
              {totals.users > 0 ? Math.round((totals.verifiedUsers / totals.users) * 100) : 0}%).
            </div>
          </div>
        </AdminPanel>
      </div>

      {/* Week comparison + auth methods + top projects */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <AdminPanel title="Momentum" subtitle="This week vs last week">
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weekComparison} margin={{ top: 4, right: 4, left: -24, bottom: 0 }} barGap={6}>
                <CartesianGrid stroke="rgba(0,0,0,0.04)" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#9095a1" }} tickLine={false} axisLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#9095a1" }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(0,0,0,0.03)" }} />
                <Bar dataKey="users" name="New users" fill={COLORS.indigo} radius={[6, 6, 0, 0]} maxBarSize={36} />
                <Bar dataKey="projects" name="New projects" fill={COLORS.emerald} radius={[6, 6, 0, 0]} maxBarSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </AdminPanel>

        <AdminPanel title="Sign-in methods" subtitle="How users authenticate">
          <div className="mt-2 space-y-4">
            {authRows.map((row) => (
              <div key={row.label}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="text-[#6b7280]">{row.label}</span>
                  <span className="font-semibold text-[#16181d]">{row.value}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-[#f4f4f6]">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${Math.round((row.value / authTotal) * 100)}%`, background: row.color }}
                  />
                </div>
              </div>
            ))}
            <p className="rounded-xl bg-[#f4f4f6] px-3 py-2.5 text-xs leading-5 text-[#6b7280]">
              OAuth counts include users who also set a password — one user can appear in multiple rows.
            </p>
          </div>
        </AdminPanel>

        <AdminPanel title="Top projects" subtitle="Largest projects by members" className="md:col-span-2 xl:col-span-1">
          <div className="mt-1 space-y-3">
            {topProjects.length === 0 && <p className="text-sm text-[#9095a1]">No projects yet.</p>}
            {topProjects.map((project, index) => (
              <Link key={project.id} href={`/admin/projects/${project.id}`} className="group block">
                <div className="mb-1 flex items-center justify-between gap-2 text-sm">
                  <span className="flex min-w-0 items-center gap-2">
                    <span className="w-4 shrink-0 text-[11px] font-bold text-[#c2c6cf]">{index + 1}</span>
                    <span className="truncate font-medium text-[#16181d] group-hover:text-indigo-600">
                      {project.name}
                    </span>
                  </span>
                  <span className="shrink-0 text-xs text-[#9095a1]">
                    {project.memberCount} members · {project.taskCount} tasks
                  </span>
                </div>
                <div className="ml-6 h-1.5 overflow-hidden rounded-full bg-[#f4f4f6]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
                    style={{ width: `${Math.round((project.memberCount / maxTopMembers) * 100)}%` }}
                  />
                </div>
              </Link>
            ))}
          </div>
        </AdminPanel>
      </div>

      {/* Activity feed */}
      <div className="grid gap-4 xl:grid-cols-2">
        <AdminPanel title="Latest signups" subtitle="Most recent user registrations">
          <div className="divide-y divide-black/[0.04]">
            {recentUsers.length === 0 && <p className="py-3 text-sm text-[#9095a1]">No users yet.</p>}
            {recentUsers.map((user) => (
              <Link
                key={user.id}
                href={`/admin/users/${user.id}`}
                className="-mx-2 flex items-center justify-between gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-[#f4f4f6]"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <Avatar className="size-8">
                    <AvatarImage src={user.avatarUrl ?? undefined} alt={user.fullname} />
                    <AvatarFallback className="bg-indigo-500/10 text-xs font-semibold text-indigo-600">
                      {getInitials(user.fullname)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-[#16181d]">{user.fullname}</p>
                    <p className="truncate text-xs text-[#9095a1]">{user.email}</p>
                  </div>
                </div>
                <span className="shrink-0 text-[11px] text-[#9095a1]">
                  {formatDistanceToNow(parseISO(user.createdAt), { addSuffix: true })}
                </span>
              </Link>
            ))}
          </div>
        </AdminPanel>

        <AdminPanel title="Latest projects" subtitle="Most recently created projects">
          <div className="divide-y divide-black/[0.04]">
            {recentProjects.length === 0 && <p className="py-3 text-sm text-[#9095a1]">No projects yet.</p>}
            {recentProjects.map((project) => (
              <Link
                key={project.id}
                href={`/admin/projects/${project.id}`}
                className="-mx-2 flex items-center justify-between gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-[#f4f4f6]"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
                    <FolderKanban className="size-3.5" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-[#16181d]">{project.name}</p>
                    <p className="truncate text-xs text-[#9095a1]">
                      by {project.ownerName}
                      {project.isPersonal && " · personal"}
                    </p>
                  </div>
                </div>
                <span className="shrink-0 text-[11px] text-[#9095a1]">
                  {formatDistanceToNow(parseISO(project.createdAt), { addSuffix: true })}
                </span>
              </Link>
            ))}
          </div>
        </AdminPanel>
      </div>
    </div>
  );
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
