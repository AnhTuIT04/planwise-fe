"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { format, parseISO } from "date-fns";
import { ArrowLeft, FolderKanban, Lock } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminMetricCard } from "@/components/admin/admin-metric-card";
import { AdminSectionCard } from "@/components/admin/admin-section-card";
import { useAdminProjectDetail } from "@/hooks/use-admin-projects";

export default function AdminProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const projectId = params?.id ?? "";

  const { data: project, isLoading, error } = useAdminProjectDetail(projectId);

  if (isLoading) {
    return (
      <div className="space-y-5">
        <Skeleton className="h-32 w-full rounded-3xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="space-y-5">
        <AdminPageHeader
          eyebrow="Project detail"
          title="Project not found"
          description="This project may have been removed."
        />
        <Button
          variant="outline"
          className="border-[#dcdcdc] bg-white text-[#413f39]"
          onClick={() => router.push("/admin/projects")}
        >
          <ArrowLeft className="mr-2 size-4" />
          Back to projects
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          className="border-[#dcdcdc] bg-white text-[#413f39]"
          onClick={() => router.push("/admin/projects")}
        >
          <ArrowLeft className="mr-2 size-4" />
          Back to projects
        </Button>
      </div>

      <div className="flex flex-col gap-4 rounded-3xl border border-[#dcdcdc] bg-white p-5 shadow-[0_14px_36px_-30px_rgba(0,0,0,0.6)] sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <span className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#f0efe9] text-[#787878]">
            {project.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={project.logoUrl} alt={project.name} className="size-full object-cover" />
            ) : (
              <FolderKanban className="size-7" />
            )}
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-2xl font-semibold tracking-tight text-[#2d2b27]">{project.name}</h2>
              {project.isPersonal ? (
                <Badge variant="outline" className="border-sky-200 bg-sky-50 text-sky-700">
                  Personal
                </Badge>
              ) : (
                <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">
                  Team
                </Badge>
              )}
            </div>
            <p className="text-sm text-[#787878]">{project.description || "No description provided."}</p>
            <p className="mt-1 text-xs text-[#787878]">
              Owned by{" "}
              <Link href={`/admin/users/${project.owner.id}`} className="font-medium text-[#413f39] hover:underline">
                {project.owner.fullname}
              </Link>{" "}
              · Created {format(parseISO(project.createdAt), "MMM d, yyyy")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-2xl border border-[#f1eee7] bg-[#fbfaf7] px-4 py-3 text-sm text-[#787878]">
          <Lock className="size-4 shrink-0" />
          Project data (tasks, sections) is private to its members.
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <AdminMetricCard label="Members" value={String(project.memberCount)} hint="People in this project." tone="sky" />
        <AdminMetricCard
          label="Sections"
          value={String(project.sectionCount)}
          hint="Count only — content is private."
          tone="emerald"
        />
        <AdminMetricCard
          label="Tasks"
          value={String(project.taskCount)}
          hint="Count only — content is private."
          tone="amber"
        />
        <AdminMetricCard
          label="Channels"
          value={String(project.channelCount)}
          hint="Communication channels created."
          tone="slate"
        />
      </div>

      <AdminSectionCard title="Members" description="Who belongs to this project and their role.">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {project.members.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="py-8 text-center text-[#787878]">
                  This project has no members.
                </TableCell>
              </TableRow>
            )}
            {project.members.map((member) => (
              <TableRow key={member.user.id}>
                <TableCell className="font-medium text-[#2d2b27]">
                  <Link href={`/admin/users/${member.user.id}`} className="flex items-center gap-3 hover:underline">
                    <Avatar className="size-9">
                      <AvatarImage src={member.user.avatarUrl ?? undefined} alt={member.user.fullname} />
                      <AvatarFallback>{getInitials(member.user.fullname)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p>{member.user.fullname}</p>
                      <p className="text-xs font-normal text-[#787878]">{member.user.email}</p>
                    </div>
                  </Link>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="border-[#dcdcdc] bg-[#f9f7f2] text-[#57534e]">
                    {member.roleName}
                  </Badge>
                  {member.user.id === project.owner.id && (
                    <Badge variant="outline" className="ml-2 border-amber-200 bg-amber-50 text-amber-700">
                      Owner
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  {member.disabled ? (
                    <Badge variant="outline" className="border-rose-200 bg-rose-50 text-rose-700">
                      Disabled
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">
                      Active
                    </Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
