"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { format } from "date-fns";
import { FolderKanban, LayoutDashboard, LogOut, ShieldCheck, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAdminAuth } from "@/hooks/use-admin-auth";

const navigation = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/admins", label: "Admins", icon: ShieldCheck },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { admin, logout } = useAdminAuth();

  return (
    <div className="flex min-h-screen bg-[#f4f4f6] text-[#16181d]">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col bg-[#0b0d12] lg:flex">
        <Link href="/admin" className="flex items-center gap-3 px-5 pt-6 pb-8">
          <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-950/40">
            <Image src="/logo.svg" alt="PlanWise" width={18} height={18} className="size-4.5 brightness-0 invert" />
          </span>
          <span>
            <span className="block text-sm font-semibold tracking-tight text-white">PlanWise</span>
            <span className="block text-[11px] font-medium tracking-wide text-white/40">Admin console</span>
          </span>
        </Link>

        <nav className="flex flex-1 flex-col gap-1 px-3">
          {navigation.map((item) => {
            const active =
              item.href === "/admin"
                ? pathname === item.href
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-colors",
                  active ? "bg-white/[0.08] text-white" : "text-white/45 hover:bg-white/[0.04] hover:text-white/80",
                )}
              >
                {active && (
                  <span className="absolute top-1/2 left-0 h-5 w-1 -translate-y-1/2 rounded-r-full bg-gradient-to-b from-indigo-400 to-violet-500" />
                )}
                <Icon className={cn("size-4", active ? "text-indigo-300" : "")} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="m-3 rounded-2xl bg-white/[0.04] p-3">
          <div className="flex items-center gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-semibold text-white">
              {(admin?.fullname ?? "A").charAt(0).toUpperCase()}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-medium text-white">{admin?.fullname ?? "Administrator"}</p>
              <p className="truncate text-[11px] text-white/40">{admin?.email}</p>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              className="shrink-0 text-white/40 hover:bg-white/10 hover:text-white"
              onClick={logout}
              title="Sign out"
            >
              <LogOut className="size-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile top nav */}
      <div className="fixed inset-x-0 top-0 z-30 flex items-center gap-1 overflow-x-auto bg-[#0b0d12] px-3 py-2 lg:hidden">
        {navigation.map((item) => {
          const active =
            item.href === "/admin"
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium",
                active ? "bg-white/10 text-white" : "text-white/50",
              )}
            >
              <Icon className="size-3.5" />
              {item.label}
            </Link>
          );
        })}
        <button onClick={logout} className="ml-auto flex shrink-0 items-center gap-1 px-2 py-1.5 text-xs text-white/50">
          <LogOut className="size-3.5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col pt-12 lg:ml-60 lg:pt-0">
        <header className="flex items-center justify-between px-5 pt-6 pb-2 sm:px-8">
          <p className="text-xs font-medium text-[#9095a1]">{format(new Date(), "EEEE, MMMM d, yyyy")}</p>
          <span className="hidden items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-600 sm:flex">
            <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
            Live data
          </span>
        </header>
        <main className="flex-1 px-5 pb-10 sm:px-8">{children}</main>
      </div>
    </div>
  );
}
