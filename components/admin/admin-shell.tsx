"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, FolderKanban, LayoutDashboard, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const navigation = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#ecedee] text-[#413f39]">
      <div className="grid min-h-screen lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="border-b border-[#dcdcdc] bg-[#f7f5f1] lg:border-r lg:border-b-0">
          <div className="sticky top-0 flex h-full flex-col gap-6 px-5 py-6 lg:h-screen">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <Link href="/admin" className="flex items-center gap-3">
                  <div className="flex size-11 items-center justify-center">
                    <Image src="/logo.svg" alt="PlanWise" width={32} height={32} className="size-8" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold tracking-[0.24em] text-[#787878] uppercase">PlanWise</p>
                    <h1 className="text-lg font-semibold text-[#413f39]">Admin console</h1>
                  </div>
                </Link>
              </div>

              {/* <div className="space-y-3 rounded-2xl border border-[#dcdcdc] bg-white p-4 shadow-[0_12px_30px_-24px_rgba(0,0,0,0.45)]">
                <p className="text-[11px] font-semibold tracking-[0.18em] text-[#787878] uppercase">Search surface</p>
                <Input placeholder="Search users or projects" className="bg-[#fbfbfb]" />
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-[#f0efe9] text-[#57534e]">
                    Users
                  </Badge>
                  <Badge variant="secondary" className="bg-[#f0efe9] text-[#57534e]">
                    Projects
                  </Badge>
                </div>
              </div> */}
            </div>

            <nav className="flex flex-1 flex-col gap-1">
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
                      "group flex items-center gap-3 rounded-2xl border px-3 py-2.5 text-sm font-medium transition-all",
                      active
                        ? "border-[#d5d0c7] bg-[#fffdfa] text-[#2d2b27] shadow-[0_10px_24px_-20px_rgba(0,0,0,0.5)]"
                        : "border-transparent text-[#787878] hover:border-[#e1ddd4] hover:bg-white hover:text-[#413f39]",
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-8 items-center justify-center rounded-xl transition-colors",
                        active ? "bg-[#2d2b27] text-white" : "bg-[#f0efe9] text-[#787878] group-hover:text-[#413f39]",
                      )}
                    >
                      <Icon className="size-4" />
                    </span>
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="space-y-3 rounded-2xl border border-[#dcdcdc] bg-white p-4 shadow-[0_12px_30px_-24px_rgba(0,0,0,0.45)]">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-[11px] font-semibold tracking-[0.18em] text-[#787878] uppercase">Admin scope</p>
                  <p className="text-sm font-medium text-[#413f39]">Entire app coverage</p>
                </div>
                <BarChart3 className="size-5 text-[#787878]" />
              </div>
              <p className="text-sm leading-6 text-[#787878]">
                Manage users, projects, sections, tasks, members, roles, and channels from one console.
              </p>
              <Button variant="outline" className="w-full border-[#dcdcdc] bg-[#fbfbfb] text-[#413f39]">
                Export snapshot
              </Button>
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-col">
          <header className="sticky top-0 z-20 border-b border-[#dcdcdc] bg-[#ecedee]/85 backdrop-blur-xl">
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
              <div>
                <p className="text-[11px] font-semibold tracking-[0.22em] text-[#787878] uppercase">Administration</p>
                <p className="text-lg font-semibold text-[#413f39] sm:text-xl">Manage the full PlanWise workspace</p>
              </div>
              <div className="flex items-center gap-2">
                {/* <Button variant="outline" className="border-[#dcdcdc] bg-white text-[#413f39]">
                  Add item
                </Button>
                <Button className="bg-[#2d2b27] text-white hover:bg-[#403d38]">Refresh view</Button> */}
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-5 sm:px-6 lg:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
