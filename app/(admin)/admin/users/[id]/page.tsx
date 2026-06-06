"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { format, parseISO } from "date-fns";
import { ArrowLeft, Crown, FolderKanban, UserRoundCheck, UserRoundX } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminPanel } from "@/components/admin/admin-panel";
import { UserStatusBadge } from "@/components/admin/user-status-badge";
import { useAdminUserDetail, useAdminUserMutations } from "@/hooks/use-admin-users";
import { cn } from "@/lib/utils";

export default function AdminUserDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const userId = params?.id ?? "";

  const { data: user, isLoading, error } = useAdminUserDetail(userId);
  const { disableUserMutation, enableUserMutation } = useAdminUserMutations();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-32 rounded-lg" />
        <Skeleton className="h-44 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="space-y-4">
        <BackButton onClick={() => router.push("/admin/users")} />
        <AdminPanel>
          <p className="py-8 text-center text-sm text-[#9095a1]">User not found — this account may have been removed.</p>
        </AdminPanel>
      </div>
    );
  }

  const isDisabled = Boolean(user.disabledAt);
  const togglePending = disableUserMutation.isPending || enableUserMutation.isPending;
  const ownedProjects = user.projects.filter((project) => project.isOwner);

  return (
    <div className="space-y-4">
      <BackButton onClick={() => router.push("/admin/users")} />

      {/* Profile hero */}
      <div className="overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-sm">
        <div className="h-20 bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500" />
        <div className="flex flex-col gap-4 px-6 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-end gap-4">
            <Avatar className="-mt-8 size-20 rounded-2xl border-4 border-white shadow-md">
              <AvatarImage src={user.avatarUrl ?? undefined} alt={user.fullname} />
              <AvatarFallback className="rounded-xl bg-indigo-500/10 text-xl font-bold text-indigo-600">
                {getInitials(user.fullname)}
              </AvatarFallback>
            </Avatar>
            <div className="pb-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-[#16181d]">{user.fullname}</h1>
                <UserStatusBadge user={user} />
              </div>
              <p className="text-sm text-[#9095a1]">{user.email}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            className={cn(
              "rounded-xl font-semibold",
              isDisabled
                ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
                : "bg-rose-500/10 text-rose-600 hover:bg-rose-500/20",
            )}
            disabled={togglePending}
            onClick={() => (isDisabled ? enableUserMutation.mutate(user.id) : disableUserMutation.mutate(user.id))}
          >
            {isDisabled ? (
              <>
                <UserRoundCheck className="size-4" />
                Enable account
              </>
            ) : (
              <>
                <UserRoundX className="size-4" />
                Disable account
              </>
            )}
          </Button>
        </div>
        <div className="grid grid-cols-2 divide-x divide-black/[0.05] border-t border-black/[0.05] sm:grid-cols-4">
          <HeroStat label="Owned projects" value={String(user.ownedProjectCount)} />
          <HeroStat label="Memberships" value={String(user.membershipCount)} />
          <HeroStat label="Joined" value={format(parseISO(user.createdAt), "MMM d, yyyy")} />
          <HeroStat
            label="Sign-in"
            value={user.oauthProviders.length > 0 ? user.oauthProviders.join(" · ") : "Email"}
          />
        </div>
      </div>

      <AdminPanel
        title="Projects"
        subtitle={`Member of ${user.projects.length} project${user.projects.length === 1 ? "" : "s"} — owns ${ownedProjects.length}`}
      >
        {user.projects.length === 0 ? (
          <p className="py-4 text-sm text-[#9095a1]">This user is not a member of any project.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {user.projects.map((project) => (
              <Link
                key={project.id}
                href={`/admin/projects/${project.id}`}
                className="group flex items-center gap-3 rounded-xl border border-black/[0.05] p-3 transition-colors hover:border-indigo-200 hover:bg-indigo-50/40"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600">
                  <FolderKanban className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-[#16181d] group-hover:text-indigo-600">
                    {project.name}
                  </p>
                  <p className="text-xs text-[#9095a1]">{project.roleName}</p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  {project.isOwner && <Crown className="size-3.5 text-amber-500" />}
                  {project.isPersonal && (
                    <span className="rounded-full bg-violet-500/10 px-1.5 py-0.5 text-[9px] font-semibold tracking-wide text-violet-600 uppercase">
                      Personal
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
      Users
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
