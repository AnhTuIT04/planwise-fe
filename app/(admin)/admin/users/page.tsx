"use client";

import { useState } from "react";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { Search, UserRoundCheck, UserRoundX } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminMetricCard } from "@/components/admin/admin-metric-card";
import { AdminSectionCard } from "@/components/admin/admin-section-card";
import { AdminPagination } from "@/components/admin/admin-pagination";
import { UserStatusBadge } from "@/components/admin/user-status-badge";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useAdminUserMutations, useAdminUsers } from "@/hooks/use-admin-users";
import { useAdminStats } from "@/hooks/use-admin-stats";
import { IAdminUser } from "@/types/admin.type";

type StatusFilter = "all" | "active" | "disabled";

const PAGE_SIZE = 10;

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

  const handleToggle = (user: IAdminUser) => {
    if (user.disabledAt) {
      enableUserMutation.mutate(user.id);
    } else {
      disableUserMutation.mutate(user.id);
    }
  };

  return (
    <div className="space-y-5">
      <AdminPageHeader
        eyebrow="User management"
        title="Manage every user in the system"
        description="Search accounts, review their status, open a profile for details, and disable or re-enable access."
        tags={["Accounts", "Access"]}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <AdminMetricCard
          label="Total users"
          value={String(stats?.totals.users ?? "—")}
          hint="All accounts in the system."
          tone="sky"
        />
        <AdminMetricCard
          label="Verified"
          value={String(stats?.totals.verifiedUsers ?? "—")}
          hint="Users with a confirmed email."
          tone="emerald"
        />
        <AdminMetricCard
          label="Disabled"
          value={String(stats?.totals.disabledUsers ?? "—")}
          hint="Accounts disabled by admin."
          tone="rose"
        />
      </div>

      <AdminSectionCard title="User directory" description="Open a user for full details, or toggle their access.">
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-sm">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#8a8a8a]" />
            <Input
              placeholder="Search by name or email"
              className="bg-[#fbfaf7] pl-9"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
            />
          </div>
          <Select
            value={status}
            onValueChange={(value) => {
              setStatus(value as StatusFilter);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-40 border-[#dcdcdc] bg-white">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="disabled">Disabled</SelectItem>
            </SelectContent>
          </Select>
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
                <TableHead>User</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Owned</TableHead>
                <TableHead>Member of</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="py-8 text-center text-[#787878]">
                    No users match the current filters.
                  </TableCell>
                </TableRow>
              )}
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium text-[#2d2b27]">
                    <Link href={`/admin/users/${user.id}`} className="flex items-center gap-3 hover:underline">
                      <Avatar className="size-10">
                        <AvatarImage src={user.avatarUrl ?? undefined} alt={user.fullname} />
                        <AvatarFallback>{getInitials(user.fullname)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p>{user.fullname}</p>
                        <p className="text-xs font-normal text-[#787878]">{user.email}</p>
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <UserStatusBadge user={user} />
                  </TableCell>
                  <TableCell>{user.ownedProjectCount}</TableCell>
                  <TableCell>{user.membershipCount}</TableCell>
                  <TableCell>{format(parseISO(user.createdAt), "MMM d, yyyy")}</TableCell>
                  <TableCell>
                    <div className="flex justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        className={
                          user.disabledAt
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            : "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100"
                        }
                        disabled={disableUserMutation.isPending || enableUserMutation.isPending}
                        onClick={() => handleToggle(user)}
                      >
                        {user.disabledAt ? (
                          <>
                            <UserRoundCheck className="mr-1.5 size-4" />
                            Enable
                          </>
                        ) : (
                          <>
                            <UserRoundX className="mr-1.5 size-4" />
                            Disable
                          </>
                        )}
                      </Button>
                    </div>
                  </TableCell>
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
