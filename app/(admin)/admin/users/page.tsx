"use client";

import { useState } from "react";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { Search, UserRoundCheck, UserRoundX } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminPanel } from "@/components/admin/admin-panel";
import { AdminPageTitle } from "@/components/admin/admin-page-title";
import { AdminPagination } from "@/components/admin/admin-pagination";
import { UserStatusBadge } from "@/components/admin/user-status-badge";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useAdminUserMutations, useAdminUsers } from "@/hooks/use-admin-users";
import { useAdminStats } from "@/hooks/use-admin-stats";
import { IAdminUser } from "@/types/admin.type";
import { cn } from "@/lib/utils";

type StatusFilter = "all" | "active" | "disabled";

const PAGE_SIZE = 10;

const FILTERS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "disabled", label: "Disabled" },
];

export default function AdminUsersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const debouncedSearch = useDebouncedValue(search, 300);

  const { data, isLoading } = useAdminUsers({
    page,
    limit: PAGE_SIZE,
    q: debouncedSearch || undefined,
    status,
  });
  const { data: stats } = useAdminStats();
  const { disableUserMutation, enableUserMutation } = useAdminUserMutations();

  const users = data?.data ?? [];
  const signups14d = stats?.daily.slice(-14) ?? [];

  const handleToggle = (user: IAdminUser) => {
    if (user.disabledAt) {
      enableUserMutation.mutate(user.id);
    } else {
      disableUserMutation.mutate(user.id);
    }
  };

  return (
    <div className="space-y-4">
      <AdminPageTitle title="Users" subtitle="Every account in the system — search, inspect, disable or re-enable." />

      {/* Insight strip */}
      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="grid grid-cols-3 gap-4">
          <InsightStat label="Total" value={stats?.totals.users} accent="text-indigo-600" />
          <InsightStat label="Verified" value={stats?.totals.verifiedUsers} accent="text-emerald-600" />
          <InsightStat label="Disabled" value={stats?.totals.disabledUsers} accent="text-rose-600" />
        </div>
        <AdminPanel bodyClassName="px-4 pt-3 pb-2" className="hidden lg:block">
          <p className="mb-1 text-[11px] font-medium text-[#9095a1]">Signups · last 14 days</p>
          <div className="h-14">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={signups14d} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <XAxis dataKey="date" hide />
                <Tooltip
                  labelFormatter={(v) => format(parseISO(String(v)), "MMM d")}
                  contentStyle={{ borderRadius: 10, border: "1px solid rgba(0,0,0,0.08)", fontSize: 12 }}
                  cursor={{ fill: "rgba(0,0,0,0.04)" }}
                />
                <Bar dataKey="users" name="Signups" fill="#6366f1" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </AdminPanel>
      </div>

      <AdminPanel
        bodyClassName="px-0 pb-2"
        title="Directory"
        action={
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex rounded-lg bg-[#f4f4f6] p-0.5">
              {FILTERS.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => {
                    setStatus(filter.value);
                    setPage(1);
                  }}
                  className={cn(
                    "rounded-md px-3 py-1 text-xs font-medium transition-colors",
                    status === filter.value ? "bg-white text-[#16181d] shadow-sm" : "text-[#9095a1] hover:text-[#16181d]",
                  )}
                >
                  {filter.label}
                </button>
              ))}
            </div>
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-[#9095a1]" />
              <Input
                placeholder="Search users..."
                className="h-8 w-52 rounded-lg border-black/[0.08] bg-[#f9f9fa] pl-8 text-sm"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
              />
            </div>
          </div>
        }
      >
        {isLoading ? (
          <div className="space-y-2 px-5">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-14 w-full rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-black/[0.05] text-left text-[11px] font-semibold tracking-wide text-[#9095a1] uppercase">
                  <th className="px-5 py-2.5 font-semibold">User</th>
                  <th className="px-3 py-2.5 font-semibold">Status</th>
                  <th className="px-3 py-2.5 font-semibold">Projects</th>
                  <th className="px-3 py-2.5 font-semibold">Joined</th>
                  <th className="px-5 py-2.5 text-right font-semibold">Access</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.04]">
                {users.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-10 text-center text-[#9095a1]">
                      No users match the current filters.
                    </td>
                  </tr>
                )}
                {users.map((user) => (
                  <tr key={user.id} className="group transition-colors hover:bg-[#f9f9fa]">
                    <td className="px-5 py-3">
                      <Link href={`/admin/users/${user.id}`} className="flex items-center gap-3">
                        <Avatar className="size-9">
                          <AvatarImage src={user.avatarUrl ?? undefined} alt={user.fullname} />
                          <AvatarFallback className="bg-indigo-500/10 text-xs font-semibold text-indigo-600">
                            {getInitials(user.fullname)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="font-medium text-[#16181d] group-hover:text-indigo-600">{user.fullname}</p>
                          <p className="truncate text-xs text-[#9095a1]">{user.email}</p>
                        </div>
                      </Link>
                    </td>
                    <td className="px-3 py-3">
                      <UserStatusBadge user={user} />
                    </td>
                    <td className="px-3 py-3">
                      <span className="text-[#16181d]">{user.ownedProjectCount}</span>
                      <span className="text-xs text-[#9095a1]"> owned · </span>
                      <span className="text-[#16181d]">{user.membershipCount}</span>
                      <span className="text-xs text-[#9095a1]"> joined</span>
                    </td>
                    <td className="px-3 py-3 text-[#6b7280]">{format(parseISO(user.createdAt), "MMM d, yyyy")}</td>
                    <td className="px-5 py-3 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "rounded-lg text-xs font-semibold",
                          user.disabledAt
                            ? "text-emerald-600 hover:bg-emerald-500/10 hover:text-emerald-700"
                            : "text-rose-500 hover:bg-rose-500/10 hover:text-rose-600",
                        )}
                        disabled={disableUserMutation.isPending || enableUserMutation.isPending}
                        onClick={() => handleToggle(user)}
                      >
                        {user.disabledAt ? (
                          <>
                            <UserRoundCheck className="size-3.5" />
                            Enable
                          </>
                        ) : (
                          <>
                            <UserRoundX className="size-3.5" />
                            Disable
                          </>
                        )}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="px-5">
          {data?.pagination && <AdminPagination pagination={data.pagination} onPageChange={setPage} />}
        </div>
      </AdminPanel>
    </div>
  );
}

function InsightStat({ label, value, accent }: { label: string; value?: number; accent: string }) {
  return (
    <div className="rounded-2xl border border-black/[0.06] bg-white px-4 py-3 shadow-sm">
      <p className="text-[11px] font-medium text-[#9095a1]">{label}</p>
      <p className={cn("mt-0.5 text-2xl font-bold tracking-tight", accent)}>{value ?? "—"}</p>
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
