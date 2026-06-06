"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { format, parseISO } from "date-fns";
import { ArrowLeft, Crown, FolderKanban, UserRoundCheck, UserRoundX } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminMetricCard } from "@/components/admin/admin-metric-card";
import { AdminSectionCard } from "@/components/admin/admin-section-card";
import { UserStatusBadge } from "@/components/admin/user-status-badge";
import { useAdminUserDetail, useAdminUserMutations } from "@/hooks/use-admin-users";

export default function AdminUserDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const userId = params?.id ?? "";

  const { data: user, isLoading, error } = useAdminUserDetail(userId);
  const { disableUserMutation, enableUserMutation } = useAdminUserMutations();

  if (isLoading) {
    return (
      <div className="space-y-5">
        <Skeleton className="h-32 w-full rounded-3xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="space-y-5">
        <AdminPageHeader eyebrow="User detail" title="User not found" description="This account may have been removed." />
        <Button variant="outline" className="border-[#dcdcdc] bg-white text-[#413f39]" onClick={() => router.push("/admin/users")}>
          <ArrowLeft className="mr-2 size-4" />
          Back to users
        </Button>
      </div>
    );
  }

  const isDisabled = Boolean(user.disabledAt);
  const togglePending = disableUserMutation.isPending || enableUserMutation.isPending;

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          className="border-[#dcdcdc] bg-white text-[#413f39]"
          onClick={() => router.push("/admin/users")}
        >
          <ArrowLeft className="mr-2 size-4" />
          Back to users
        </Button>
      </div>

      <div className="flex flex-col gap-4 rounded-3xl border border-[#dcdcdc] bg-white p-5 shadow-[0_14px_36px_-30px_rgba(0,0,0,0.6)] sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="size-16">
            <AvatarImage src={user.avatarUrl ?? undefined} alt={user.fullname} />
            <AvatarFallback className="text-lg">{getInitials(user.fullname)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-2xl font-semibold tracking-tight text-[#2d2b27]">{user.fullname}</h2>
              <UserStatusBadge user={user} />
            </div>
            <p className="text-sm text-[#787878]">{user.email}</p>
            <p className="mt-1 text-xs text-[#787878]">
              Joined {format(parseISO(user.createdAt), "MMM d, yyyy")}
              {user.oauthProviders.length > 0 && <> · OAuth: {user.oauthProviders.join(", ")}</>}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          className={
            isDisabled
              ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
              : "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100"
          }
          disabled={togglePending}
          onClick={() => (isDisabled ? enableUserMutation.mutate(user.id) : disableUserMutation.mutate(user.id))}
        >
          {isDisabled ? (
            <>
              <UserRoundCheck className="mr-2 size-4" />
              Enable account
            </>
          ) : (
            <>
              <UserRoundX className="mr-2 size-4" />
              Disable account
            </>
          )}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <AdminMetricCard
          label="Owned projects"
          value={String(user.ownedProjectCount)}
          hint="Projects this user owns."
          tone="emerald"
        />
        <AdminMetricCard
          label="Memberships"
          value={String(user.membershipCount)}
          hint="Projects this user belongs to."
          tone="sky"
        />
        <AdminMetricCard
          label="Account status"
          value={isDisabled ? "Disabled" : "Active"}
          hint={
            isDisabled
              ? `Disabled on ${format(parseISO(user.disabledAt!), "MMM d, yyyy")}.`
              : "The user can access the app."
          }
          tone={isDisabled ? "rose" : "emerald"}
        />
      </div>

      <AdminSectionCard
        title="Projects"
        description="Projects this user belongs to — general info only."
      >
        <div className="space-y-3">
          {user.projects.length === 0 && (
            <p className="rounded-2xl border border-[#f1eee7] bg-[#fbfaf7] p-4 text-sm text-[#787878]">
              This user is not a member of any project.
            </p>
          )}
          {user.projects.map((project) => (
            <Link
              key={project.id}
              href={`/admin/projects/${project.id}`}
              className="flex items-center justify-between gap-3 rounded-2xl border border-[#f1eee7] bg-[#fbfaf7] p-4 transition-colors hover:border-[#d5d0c7] hover:bg-white"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#f0efe9] text-[#787878]">
                  <FolderKanban className="size-4" />
                </span>
                <div className="min-w-0">
                  <p className="truncate font-medium text-[#2d2b27]">{project.name}</p>
                  <p className="text-sm text-[#787878]">Role: {project.roleName}</p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {project.isOwner && (
                  <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700">
                    <Crown className="mr-1 size-3" />
                    Owner
                  </Badge>
                )}
                {project.isPersonal && (
                  <Badge variant="outline" className="border-sky-200 bg-sky-50 text-sky-700">
                    Personal
                  </Badge>
                )}
              </div>
            </Link>
          ))}
        </div>
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
