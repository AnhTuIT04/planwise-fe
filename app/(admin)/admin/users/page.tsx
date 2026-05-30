import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminMetricCard } from "@/components/admin/admin-metric-card";
import { AdminSectionCard } from "@/components/admin/admin-section-card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { adminUsers, type AdminUser } from "@/data/admin.mock";
import { MoreHorizontal, Pencil, Plus, Search, Trash2, UserRoundCheck, UserRoundX } from "lucide-react";

const statusClass: Record<AdminUser["status"], string> = {
  Verified: "border-emerald-200 bg-emerald-50 text-emerald-700",
  "Not verified": "border-amber-200 bg-amber-50 text-amber-700",
  Suspended: "border-rose-200 bg-rose-50 text-rose-700",
};

export default function AdminUsersPage() {
  const verifiedCount = adminUsers.filter((user) => user.status === "Verified").length;
  const pendingCount = adminUsers.filter((user) => user.status === "Not verified").length;
  const suspendedCount = adminUsers.filter((user) => user.status === "Suspended").length;

  return (
    <div className="space-y-5">
      <AdminPageHeader
        eyebrow="User management"
        title="Manage every user in the workspace"
        description="Review account status, project coverage, and activity for every user in the workspace."
        tags={["Accounts", "Access", "Activity"]}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <AdminMetricCard
          label="Total users"
          value={String(adminUsers.length)}
          hint="All accounts in the workspace."
          tone="sky"
        />
        <AdminMetricCard
          label="Verified"
          value={String(verifiedCount)}
          hint="Users with confirmed access."
          tone="emerald"
        />
        <AdminMetricCard
          label="Suspended"
          value={String(suspendedCount)}
          hint="Users removed or disabled by admin."
          tone="rose"
        />
      </div>

      <AdminSectionCard title="User directory" description="Create, update, suspend, or delete users from one table.">
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-sm">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#8a8a8a]" />
            <Input placeholder="Search users" className="bg-[#fbfaf7] pl-9" />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className="border-[#dcdcdc] bg-white text-[#413f39]">
              <Plus className="mr-2 size-4" />
              Add user
            </Button>
            <Button className="bg-[#2d2b27] text-white hover:bg-[#403d38]">
              <UserRoundCheck className="mr-2 size-4" />
              Verify queue
            </Button>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Last active</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {adminUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium text-[#2d2b27]">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-10">
                      <AvatarImage src={user.avatarUrl} alt={user.name} />
                      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p>{user.name}</p>
                      <p className="text-xs font-normal text-[#787878]">{user.id}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={statusClass[user.status]}>
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell>{user.projects}</TableCell>
                <TableCell>{user.lastActive}</TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="icon" className="size-8 border-[#dcdcdc] bg-white text-[#413f39]">
                      <Pencil className="size-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="size-8 border-[#dcdcdc] bg-white text-[#413f39]">
                      {user.status === "Suspended" ? (
                        <UserRoundCheck className="size-4" />
                      ) : (
                        <UserRoundX className="size-4" />
                      )}
                    </Button>
                    <Button variant="outline" size="icon" className="size-8 border-[#dcdcdc] bg-white text-[#b91c1c]">
                      <Trash2 className="size-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="size-8 text-[#787878]">
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </AdminSectionCard>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <AdminSectionCard title="Access controls" description="Quick actions for the current account review cycle.">
          <div className="grid gap-3 sm:grid-cols-3">
            <ActionStat label="Verified ready" value={verifiedCount} tone="emerald" />
            <ActionStat label="Pending review" value={pendingCount} tone="amber" />
            <ActionStat label="Suspended" value={suspendedCount} tone="rose" />
          </div>
        </AdminSectionCard>

        <AdminSectionCard title="Review queue" description="Users that usually need a follow-up from admin.">
          <div className="space-y-3">
            {adminUsers
              .filter((user) => user.status !== "Verified")
              .map((user) => (
                <div key={user.id} className="rounded-2xl border border-[#f1eee7] bg-[#fbfaf7] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-[#2d2b27]">{user.name}</p>
                      <p className="text-sm text-[#787878]">{user.email}</p>
                    </div>
                    <Badge variant="outline" className={statusClass[user.status]}>
                      {user.status}
                    </Badge>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-[#787878]">
                    This account may need verification, reactivation, or removal review.
                  </p>
                </div>
              ))}
          </div>
        </AdminSectionCard>
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

function ActionStat({ label, value, tone }: { label: string; value: number; tone: "emerald" | "amber" | "rose" }) {
  const toneClass = {
    emerald: "border-emerald-200 bg-emerald-50 text-emerald-700",
    amber: "border-amber-200 bg-amber-50 text-amber-700",
    rose: "border-rose-200 bg-rose-50 text-rose-700",
  }[tone];

  return (
    <div className={`rounded-2xl border px-4 py-3 ${toneClass}`}>
      <p className="text-xs tracking-[0.16em] uppercase">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  );
}
