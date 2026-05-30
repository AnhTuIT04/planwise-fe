import Link from "next/link";
import { ArrowRight, CircleAlert, FolderKanban, ShieldUser, Users } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminMetricCard } from "@/components/admin/admin-metric-card";
import { AdminSectionCard } from "@/components/admin/admin-section-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { adminActivity, adminOverview, adminProjects } from "@/data/admin.mock";

const quickLinks = [
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
];

export default function AdminOverviewPage() {
  return (
    <div className="space-y-5">
      <AdminPageHeader
        eyebrow="Admin overview"
        title="Whole-app control center"
        description="Use this dashboard to manage users, projects, and the project data that powers sections, tasks, members, roles, and channels."
        tags={["Users", "Projects", "Project data"]}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <AdminMetricCard
          label="Users"
          value={String(adminOverview.users)}
          hint="Workspace accounts visible in the admin scope."
          tone="sky"
        />
        <AdminMetricCard
          label="Active projects"
          value={String(adminOverview.activeProjects)}
          hint="Projects currently tracked in the workspace."
          tone="emerald"
        />
        <AdminMetricCard
          label="Open tasks"
          value={String(adminOverview.openTasks)}
          hint="Tasks that still need review, assignment, or delivery."
          tone="amber"
        />
        <AdminMetricCard
          label="Channels"
          value={String(adminOverview.projectChannels)}
          hint="Project channels, announcements, and support spaces."
          tone="rose"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.4fr_0.9fr]">
        <AdminSectionCard
          title="Recent administration activity"
          description="A lightweight audit trail for the admin experience."
        >
          <div className="space-y-3">
            {adminActivity.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-3 rounded-2xl border border-[#f1eee7] bg-[#fbfaf7] p-3"
              >
                <span
                  className={`mt-0.5 size-2.5 rounded-full ${
                    item.tone === "emerald"
                      ? "bg-emerald-500"
                      : item.tone === "sky"
                        ? "bg-sky-500"
                        : item.tone === "amber"
                          ? "bg-amber-500"
                          : "bg-rose-500"
                  }`}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-medium text-[#2d2b27]">{item.title}</p>
                    <span className="text-xs text-[#787878]">{item.timestamp}</span>
                  </div>
                  <p className="mt-1 text-sm leading-6 text-[#787878]">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </AdminSectionCard>

        <div className="space-y-4">
          <AdminSectionCard title="Admin reach" description="Areas covered by the current admin scope.">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <ScopeStat label="Members" value={adminOverview.projectMembers} />
              <ScopeStat label="Roles" value={adminOverview.projectRoles} />
              <ScopeStat label="Sections" value={adminOverview.projectSections} />
              <ScopeStat label="Projects" value={adminOverview.activeProjects} />
            </div>
          </AdminSectionCard>

          <AdminSectionCard title="Quick links" description="Jump straight into the admin workflows.">
            <div className="space-y-2">
              {quickLinks.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center justify-between rounded-2xl border border-[#f1eee7] bg-[#fbfaf7] px-4 py-3 text-sm font-medium text-[#2d2b27] transition-colors hover:bg-white"
                  >
                    <span className="flex items-center gap-3">
                      <span className="flex size-8 items-center justify-center rounded-xl bg-[#2d2b27] text-white">
                        <Icon className="size-4" />
                      </span>
                      {item.label}
                    </span>
                    <ArrowRight className="size-4 text-[#787878]" />
                  </Link>
                );
              })}
            </div>
          </AdminSectionCard>

          <div className="rounded-3xl border border-[#dcdcdc] bg-[#2d2b27] p-5 text-white shadow-[0_14px_36px_-30px_rgba(0,0,0,0.6)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs tracking-[0.22em] text-white/60 uppercase">
                  <ShieldUser className="size-4" />
                  Workspace governance
                </div>
                <h3 className="mt-3 text-xl font-semibold">Whole app, one place</h3>
                <p className="mt-2 text-sm leading-6 text-white/70">
                  This page is designed as a control hub for all administrative entities in the app.
                </p>
              </div>
              <Badge className="bg-white/10 text-white hover:bg-white/10">Workspace</Badge>
            </div>
            <Button className="mt-5 w-full bg-white text-[#2d2b27] hover:bg-white/90">Review projects</Button>
          </div>
        </div>
      </div>

      <AdminSectionCard
        title="Most active projects"
        description="A snapshot of the projects that currently carry the most admin responsibility."
      >
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {adminProjects.map((project) => (
            <div key={project.id} className="rounded-2xl border border-[#f1eee7] bg-[#fbfaf7] p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-[#2d2b27]">{project.name}</p>
                  <p className="mt-1 text-xs tracking-[0.18em] text-[#787878] uppercase">{project.owner}</p>
                </div>
                <Badge variant="outline" className="border-[#dcdcdc] bg-white text-[#57534e]">
                  {project.status}
                </Badge>
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs text-[#787878]">
                <CircleAlert className="size-3.5" />
                {project.progress}% complete, updated {project.updatedAt}
              </div>
            </div>
          ))}
        </div>
      </AdminSectionCard>
    </div>
  );
}

function ScopeStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-[#f1eee7] bg-[#fbfaf7] p-3">
      <p className="text-xs tracking-[0.16em] text-[#787878] uppercase">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-[#2d2b27]">{value}</p>
    </div>
  );
}
