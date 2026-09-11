"use client";

import { useState } from "react";
import { format, parseISO } from "date-fns";
import { Plus, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminPanel } from "@/components/admin/admin-panel";
import { AdminPageTitle } from "@/components/admin/admin-page-title";
import { useAdminAdmins, useCreateAdminMutation } from "@/hooks/use-admin-admins";
import { useAdminAuth } from "@/hooks/use-admin-auth";

export default function AdminAdminsPage() {
  const { data: admins, isLoading } = useAdminAdmins();
  const { admin: currentAdmin } = useAdminAuth();
  const createAdminMutation = useCreateAdminMutation();

  const [open, setOpen] = useState(false);
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email || !password) return;

    createAdminMutation.mutate(
      { email, password, fullname: fullname || undefined },
      {
        onSuccess: () => {
          setOpen(false);
          setFullname("");
          setEmail("");
          setPassword("");
        },
      },
    );
  };

  return (
    <div className="space-y-4">
      <AdminPageTitle
        title="Admins"
        subtitle="Administrator accounts with full access to this console."
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 font-semibold text-white shadow-md shadow-indigo-500/25 hover:from-indigo-600 hover:to-violet-700">
                <Plus className="size-4" />
                New admin
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create a new admin</DialogTitle>
                <DialogDescription>
                  The new admin signs in at <span className="font-medium">/admin-sign-in</span> with these credentials.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new-admin-name">Display name</Label>
                  <Input
                    id="new-admin-name"
                    placeholder="Jane Admin"
                    value={fullname}
                    onChange={(event) => setFullname(event.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-admin-email">Email</Label>
                  <Input
                    id="new-admin-email"
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-admin-password">Password</Label>
                  <Input
                    id="new-admin-password"
                    type="password"
                    placeholder="At least 6 characters"
                    minLength={6}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                  />
                </div>
                <DialogFooter>
                  <Button
                    type="submit"
                    className="rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 font-semibold text-white hover:from-indigo-600 hover:to-violet-700"
                    disabled={createAdminMutation.isPending}
                  >
                    {createAdminMutation.isPending ? "Creating..." : "Create admin"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      <AdminPanel bodyClassName="px-0 pb-2">
        {isLoading ? (
          <div className="space-y-2 px-5 pb-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-14 w-full rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="divide-y divide-black/[0.04]">
            {(admins ?? []).map((admin) => (
              <div key={admin.id} className="flex items-center justify-between gap-3 px-5 py-3.5">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-semibold text-white">
                    {admin.fullname.charAt(0).toUpperCase()}
                  </span>
                  <div className="min-w-0">
                    <p className="flex items-center gap-2 truncate text-sm font-medium text-[#16181d]">
                      {admin.fullname}
                      {admin.id === currentAdmin?.id && (
                        <span className="rounded-full bg-indigo-500/10 px-2 py-0.5 text-[10px] font-semibold text-indigo-600">
                          You
                        </span>
                      )}
                    </p>
                    <p className="truncate text-xs text-[#9095a1]">{admin.email}</p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="hidden items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-600 sm:flex">
                    <ShieldCheck className="size-3" />
                    Full access
                  </span>
                  <span className="text-[11px] text-[#9095a1]">
                    since {format(parseISO(admin.createdAt), "MMM d, yyyy")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </AdminPanel>
    </div>
  );
}
