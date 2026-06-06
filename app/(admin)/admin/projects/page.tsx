"use client";

import { useState } from "react";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { CheckSquare, FolderKanban, Layers, Search, Users } from "lucide-react";
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminPanel } from "@/components/admin/admin-panel";
import { AdminPageTitle } from "@/components/admin/admin-page-title";
import { AdminPagination } from "@/components/admin/admin-pagination";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useAdminProjects } from "@/hooks/use-admin-projects";
import { useAdminStats } from "@/hooks/use-admin-stats";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 12;
const BAR_COLORS = ["#6366f1", "#8b5cf6", "#0ea5e9", "#10b981", "#f59e0b", "#f43f5e"];

export default function AdminProjectsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 300);

  const { data, isLoading } = useAdminProjects({
    page,
    limit: PAGE_SIZE,
    q: debouncedSearch || undefined,
  });
  const { data: stats } = useAdminStats();

  const projects = data?.data ?? [];
  const topProjects = stats?.topProjects ?? [];

  return (
    <div className="space-y-4">
      <AdminPageTitle
        title="Projects"
        subtitle="All projects across the system — general info only, project content stays private."
      />

      {/* Overview strip: chart + counters */}
      <div className="grid gap-4 lg:grid-cols-3">
        <AdminPanel title="Most active projects" subtitle="Ranked by member count" className="lg:col-span-2">
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={topProjects}
                layout="vertical"
                margin={{ top: 0, right: 24, left: 8, bottom: 0 }}
                barCategoryGap={8}
              >
                <XAxis type="number" hide />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={130}
                  tick={{ fontSize: 11, fill: "#6b7280" }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{ borderRadius: 10, border: "1px solid rgba(0,0,0,0.08)", fontSize: 12 }}
                  cursor={{ fill: "rgba(0,0,0,0.03)" }}
                />
                <Bar dataKey="memberCount" name="Members" radius={[0, 6, 6, 0]} maxBarSize={18}>
                  {topProjects.map((entry, index) => (
                    <Cell key={entry.id} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </AdminPanel>

        <div className="grid grid-cols-1 gap-4">
          <CounterCard label="All projects" value={stats?.totals.projects} className="text-indigo-600" />
          <div className="grid grid-cols-2 gap-4">
            <CounterCard label="Team" value={stats?.totals.teamProjects} className="text-emerald-600" />
            <CounterCard label="Personal" value={stats?.totals.personalProjects} className="text-violet-600" />
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center justify-between gap-3">
        <div className="relative w-full max-w-xs">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#9095a1]" />
          <Input
            placeholder="Search projects..."
            className="h-9 rounded-xl border-black/[0.08] bg-white pl-9 text-sm shadow-sm"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
          />
        </div>
        {data?.pagination && (
          <p className="shrink-0 text-xs text-[#9095a1]">{data.pagination.totalItems} projects</p>
        )}
      </div>

      {/* Card grid */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton key={index} className="h-44 rounded-2xl" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <AdminPanel>
          <p className="py-8 text-center text-sm text-[#9095a1]">No projects match the current filters.</p>
        </AdminPanel>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/admin/projects/${project.id}`}
              className="group flex flex-col rounded-2xl border border-black/[0.06] bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-indigo-500/10 to-violet-500/10 text-indigo-600">
                  {project.logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={project.logoUrl} alt={project.name} className="size-full object-cover" />
                  ) : (
                    <FolderKanban className="size-4.5" />
                  )}
                </span>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase",
                    project.isPersonal ? "bg-violet-500/10 text-violet-600" : "bg-emerald-500/10 text-emerald-600",
                  )}
                >
                  {project.isPersonal ? "Personal" : "Team"}
                </span>
              </div>

              <h3 className="mt-3 truncate font-semibold text-[#16181d] group-hover:text-indigo-600">{project.name}</h3>
              <p className="mt-0.5 line-clamp-1 min-h-4 text-xs text-[#9095a1]">{project.description || " "}</p>

              <div className="mt-3 flex items-center gap-3 text-xs text-[#6b7280]">
                <span className="flex items-center gap-1">
                  <Users className="size-3.5 text-[#b0b4be]" />
                  {project.memberCount}
                </span>
                <span className="flex items-center gap-1">
                  <Layers className="size-3.5 text-[#b0b4be]" />
                  {project.sectionCount}
                </span>
                <span className="flex items-center gap-1">
                  <CheckSquare className="size-3.5 text-[#b0b4be]" />
                  {project.taskCount}
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-black/[0.04] pt-3">
                <span className="flex min-w-0 items-center gap-1.5">
                  <Avatar className="size-5">
                    <AvatarImage src={project.owner.avatarUrl ?? undefined} alt={project.owner.fullname} />
                    <AvatarFallback className="bg-indigo-500/10 text-[9px] font-semibold text-indigo-600">
                      {getInitials(project.owner.fullname)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="truncate text-xs text-[#6b7280]">{project.owner.fullname}</span>
                </span>
                <span className="shrink-0 text-[11px] text-[#9095a1]">
                  {format(parseISO(project.createdAt), "MMM d, yyyy")}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {data?.pagination && <AdminPagination pagination={data.pagination} onPageChange={setPage} />}
    </div>
  );
}

function CounterCard({ label, value, className }: { label: string; value?: number; className?: string }) {
  return (
    <div className="flex flex-col justify-center rounded-2xl border border-black/[0.06] bg-white px-4 py-3 shadow-sm">
      <p className="text-[11px] font-medium text-[#9095a1]">{label}</p>
      <p className={cn("mt-0.5 text-2xl font-bold tracking-tight", className)}>{value ?? "—"}</p>
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
