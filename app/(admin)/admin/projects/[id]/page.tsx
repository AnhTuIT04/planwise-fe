"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { format, parseISO } from "date-fns";
import { ArrowLeft, Crown, FolderKanban, Lock } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminPanel } from "@/components/admin/admin-panel";
import { useAdminProjectDetail } from "@/hooks/use-admin-projects";
import { cn } from "@/lib/utils";

export default function AdminProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const projectId = params?.id ?? "";

  const { data: project, isLoading, error } = useAdminProjectDetail(projectId);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-32 rounded-lg" />
        <Skeleton className="h-44 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="space-y-4">
        <BackButton onClick={() => router.push("/admin/projects")} />
        <AdminPanel>
          <p className="py-8 text-center text-sm text-[#9095a1]">
            Project not found — it may have been removed.
          </p>
        </AdminPanel>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <BackButton onClick={() => router.push("/admin/projects")} />

      {/* Project hero */}
      <div className="overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-sm">
        <div
          className={cn(
            "h-20 bg-gradient-to-r",
            project.isPersonal
              ? "from-violet-500 via-purple-500 to-fuchsia-500"
              : "from-emerald-500 via-teal-500 to-cyan-500",
          )}
        />
        <div className="flex flex-col gap-4 px-6 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-end gap-4">
            <span className="-mt-8 flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-white shadow-md">
              {project.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={project.logoUrl} alt={project.name} className="size-full object-cover" />
              ) : (
                <span className="flex size-full items-center justify-center bg-indigo-500/10 text-indigo-600">
                  <FolderKanban className="size-7" />
                </span>
              )}
            </span>
            <div className="pb-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-[#16181d]">{project.name}</h1>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase",
                    project.isPersonal ? "bg-violet-500/10 text-violet-600" : "bg-emerald-500/10 text-emerald-600",
                  )}
                >
                  {project.isPersonal ? "Personal" : "Team"}
                </span>
              </div>
              <p className="max-w-xl text-sm text-[#9095a1]">{project.description || "No description provided."}</p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2 rounded-xl bg-[#f4f4f6] px-3.5 py-2.5 text-xs leading-5 text-[#6b7280]">
            <Lock className="size-3.5 shrink-0" />
            Tasks & sections are private to members
          </div>
        </div>
        <div className="grid grid-cols-2 divide-x divide-black/[0.05] border-t border-black/[0.05] sm:grid-cols-5">
          <HeroStat label="Members" value={String(project.memberCount)} />
          <HeroStat label="Sections" value={String(project.sectionCount)} />
          <HeroStat label="Tasks" value={String(project.taskCount)} />
          <HeroStat label="Channels" value={String(project.channelCount)} />
          <HeroStat label="Created" value={format(parseISO(project.createdAt), "MMM d, yyyy")} />
        </div>
      </div>

      <AdminPanel title="Members" subtitle={`${project.memberCount} people in this project`}>
        {project.members.length === 0 ? (
          <p className="py-4 text-sm text-[#9095a1]">This project has no members.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {project.members.map((member) => (
              <Link
                key={member.user.id}
                href={`/admin/users/${member.user.id}`}
                className="group flex items-center gap-3 rounded-xl border border-black/[0.05] p-3 transition-colors hover:border-indigo-200 hover:bg-indigo-50/40"
              >
                <Avatar className="size-10">
                  <AvatarImage src={member.user.avatarUrl ?? undefined} alt={member.user.fullname} />
                  <AvatarFallback className="bg-indigo-500/10 text-xs font-semibold text-indigo-600">
                    {getInitials(member.user.fullname)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-1.5 truncate text-sm font-medium text-[#16181d] group-hover:text-indigo-600">
                    {member.user.fullname}
                    {member.user.id === project.owner.id && <Crown className="size-3.5 shrink-0 text-amber-500" />}
                  </p>
                  <p className="truncate text-xs text-[#9095a1]">{member.user.email}</p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <span className="rounded-full bg-[#f4f4f6] px-2 py-0.5 text-[10px] font-semibold text-[#6b7280]">
                    {member.roleName}
                  </span>
                  {member.disabled && (
                    <span className="rounded-full bg-rose-500/10 px-2 py-0.5 text-[10px] font-semibold text-rose-600">
                      Disabled
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </AdminPanel>
    </div>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <Button variant="ghost" size="sm" className="-ml-2 rounded-lg text-[#6b7280] hover:bg-black/5" onClick={onClick}>
      <ArrowLeft className="size-4" />
      Projects
    </Button>
  );
}

function HeroStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-5 py-3">
      <p className="text-[11px] font-medium text-[#9095a1]">{label}</p>
      <p className="mt-0.5 truncate text-sm font-semibold text-[#16181d]">{value}</p>
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
