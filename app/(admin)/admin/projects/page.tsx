"use client";

import { useState } from "react";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { FolderKanban, Search } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminMetricCard } from "@/components/admin/admin-metric-card";
import { AdminSectionCard } from "@/components/admin/admin-section-card";
import { AdminPagination } from "@/components/admin/admin-pagination";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useAdminProjects } from "@/hooks/use-admin-projects";
import { useAdminStats } from "@/hooks/use-admin-stats";

const PAGE_SIZE = 10;

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

  return (
    <div className="space-y-5">
      <AdminPageHeader
        eyebrow="Project management"
        title="Every project in the system"
        description="Browse all projects and open one to review its general information. Project data stays private — admins cannot view tasks or sections."
        tags={["Projects", "Read-only"]}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <AdminMetricCard
          label="Total projects"
          value={String(stats?.totals.projects ?? "—")}
          hint="All projects across the system."
          tone="emerald"
        />
        <AdminMetricCard
          label="Team projects"
          value={String(stats?.totals.teamProjects ?? "—")}
          hint="Collaborative projects with members."
          tone="sky"
        />
        <AdminMetricCard
          label="Personal workspaces"
          value={String(stats?.totals.personalProjects ?? "—")}
          hint="Auto-created personal workspaces."
          tone="amber"
        />
      </div>

      <AdminSectionCard
        title="Project roster"
        description="General information only — open a project for its profile and member list."
      >
        <div className="relative mb-4 w-full lg:max-w-sm">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#8a8a8a]" />
          <Input
            placeholder="Search by project name"
            className="bg-[#fbfaf7] pl-9"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
          />
        </div>

        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-14 w-full rounded-xl" />
            ))}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Members</TableHead>
                <TableHead>Sections</TableHead>
                <TableHead>Tasks</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="py-8 text-center text-[#787878]">
                    No projects match the current filters.
                  </TableCell>
                </TableRow>
              )}
              {projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium text-[#2d2b27]">
                    <Link href={`/admin/projects/${project.id}`} className="flex items-center gap-3 hover:underline">
                      <span className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#f0efe9] text-[#787878]">
                        {project.logoUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={project.logoUrl} alt={project.name} className="size-full object-cover" />
                        ) : (
                          <FolderKanban className="size-4" />
                        )}
                      </span>
                      <div>
                        <p>{project.name}</p>
                        {project.description && (
                          <p className="max-w-56 truncate text-xs font-normal text-[#787878]">{project.description}</p>
                        )}
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="size-7">
                        <AvatarImage src={project.owner.avatarUrl ?? undefined} alt={project.owner.fullname} />
                        <AvatarFallback className="text-xs">{getInitials(project.owner.fullname)}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{project.owner.fullname}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {project.isPersonal ? (
                      <Badge variant="outline" className="border-sky-200 bg-sky-50 text-sky-700">
                        Personal
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">
                        Team
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>{project.memberCount}</TableCell>
                  <TableCell>{project.sectionCount}</TableCell>
                  <TableCell>{project.taskCount}</TableCell>
                  <TableCell>{format(parseISO(project.createdAt), "MMM d, yyyy")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {data?.pagination && <AdminPagination pagination={data.pagination} onPageChange={setPage} />}
      </AdminSectionCard>
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
