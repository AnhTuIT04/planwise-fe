import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ChevronDown, FolderKanban, MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminMetricCard } from "@/components/admin/admin-metric-card";
import { AdminSectionCard } from "@/components/admin/admin-section-card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { adminProjectDetails, type AdminTask } from "@/data/admin.mock";

const projectStatusClass = {
  "On track": "border-emerald-200 bg-emerald-50 text-emerald-700",
  "At risk": "border-amber-200 bg-amber-50 text-amber-700",
  "Needs review": "border-rose-200 bg-rose-50 text-rose-700",
} as const;

const sectionStateClass = {
  Open: "border-stone-200 bg-stone-50 text-stone-700",
  "In progress": "border-sky-200 bg-sky-50 text-sky-700",
  Done: "border-emerald-200 bg-emerald-50 text-emerald-700",
} as const;

const taskStateClass: Record<AdminTask["status"], string> = {
  Todo: "border-stone-200 bg-stone-50 text-stone-700",
  Doing: "border-sky-200 bg-sky-50 text-sky-700",
  Done: "border-emerald-200 bg-emerald-50 text-emerald-700",
};

export default async function AdminProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = adminProjectDetails.find((item) => item.id === id);

  if (!project) {
    notFound();
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/admin/projects"
          className="inline-flex items-center gap-2 rounded-full border border-[#dcdcdc] bg-white px-4 py-2 text-sm font-medium text-[#413f39] transition-colors hover:bg-[#fbfaf7]"
        >
          <ArrowLeft className="size-4" />
          Back to projects
        </Link>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="border-[#dcdcdc] bg-white text-[#413f39]">
            <Pencil className="mr-2 size-4" />
            Edit project
          </Button>
          <Button variant="outline" className="border-[#dcdcdc] bg-white text-[#413f39]">
            <Plus className="mr-2 size-4" />
            Add section
          </Button>
          <Button className="bg-[#2d2b27] text-white hover:bg-[#403d38]">
            <FolderKanban className="mr-2 size-4" />
            Add task
          </Button>
        </div>
      </div>

      <div className="rounded-[2rem] border border-[#dcdcdc] bg-[linear-gradient(145deg,#fffdfa_0%,#f7f5f1_100%)] p-6 shadow-[0_18px_40px_-32px_rgba(0,0,0,0.45)]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex size-16 items-center justify-center">
              <Image src={project.logoUrl} alt={project.name} width={48} height={48} className="size-12" />
            </div>
            <div>
              <AdminPageHeader
                eyebrow="Project detail"
                title={project.name}
                description={project.description}
                tags={[project.owner, project.status, `${project.members} members`]}
              />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className={projectStatusClass[project.status]}>
              {project.status}
            </Badge>
            <Badge variant="outline" className="border-[#dcdcdc] bg-white text-[#57534e]">
              Updated {project.updatedAt}
            </Badge>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <AdminMetricCard
            label="Members"
            value={String(project.members)}
            hint="People assigned to the project."
            tone="sky"
          />
          <AdminMetricCard
            label="Sections"
            value={String(project.sections)}
            hint="Structural sections in this project."
            tone="emerald"
          />
          <AdminMetricCard
            label="Tasks"
            value={String(project.tasks)}
            hint="Tasks linked to the project."
            tone="amber"
          />
          <AdminMetricCard label="Channels" value={String(project.channels)} hint="Communication spaces." tone="rose" />
        </div>
      </div>

      <AdminSectionCard
        title="Sections and tasks"
        description="Expandable sections with their task lists and CRUD actions."
      >
        <div className="space-y-3">
          {project.sectionsDetail.map((section) => {
            const tasks = project.tasksDetail.filter((task) => task.section === section.name);

            return (
              <Collapsible
                key={section.id}
                defaultOpen={section.state === "In progress"}
                className="rounded-2xl border border-[#f1eee7] bg-[#fbfaf7]"
              >
                <div className="flex w-[91.5%] items-center justify-between gap-3 border-b border-[#f1eee7] px-4 py-4">
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className="h-auto w-full justify-between gap-3 p-0 text-left text-[#2d2b27] hover:bg-transparent"
                    >
                      <div className="min-w-0 text-left">
                        <div className="flex items-center gap-3">
                          <p className="font-medium">{section.name}</p>
                          <Badge variant="outline" className={sectionStateClass[section.state]}>
                            {section.state}
                          </Badge>
                        </div>
                        <p className="mt-1 text-sm text-[#787878]">
                          {section.completedCount} of {section.taskCount} tasks completed
                        </p>
                      </div>
                      <ChevronDown className="size-4 shrink-0 text-[#787878] transition-transform duration-200 group-data-[state=open]/button:rotate-180" />
                    </Button>
                  </CollapsibleTrigger>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" className="size-8 border-[#dcdcdc] bg-white text-[#413f39]">
                      <Pencil className="size-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="size-8 border-[#dcdcdc] bg-white text-[#b91c1c]">
                      <Trash2 className="size-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="size-8 border-[#dcdcdc] bg-white text-[#413f39]">
                      <Plus className="size-4" />
                    </Button>
                  </div>
                </div>

                <CollapsibleContent className="px-4 pb-4">
                  <div className="space-y-3 pt-3">
                    <div className="flex flex-wrap items-center gap-2 text-xs tracking-[0.18em] text-[#787878] uppercase">
                      <span>Tasks</span>
                      <span>{tasks.length} items</span>
                    </div>
                    {tasks.map((task) => (
                      <div key={task.id} className="rounded-2xl border border-[#ebe6dc] bg-white p-4">
                        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                          <div>
                            <p className="font-medium text-[#2d2b27]">{task.title}</p>
                            <p className="mt-1 text-sm text-[#787878]">
                              Assigned to {task.assignee} · Due {task.due} · {task.status}
                            </p>
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge variant="outline" className={taskStateClass[task.status]}>
                              {task.status}
                            </Badge>
                            <Button
                              variant="outline"
                              size="icon"
                              className="size-8 border-[#dcdcdc] bg-white text-[#413f39]"
                            >
                              <Pencil className="size-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              className="size-8 border-[#dcdcdc] bg-white text-[#b91c1c]"
                            >
                              <Trash2 className="size-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="size-8 text-[#787878]">
                              <MoreHorizontal className="size-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" className="border-[#dcdcdc] bg-white text-[#413f39]">
                      <Plus className="mr-2 size-4" />
                      Add task to section
                    </Button>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </div>
      </AdminSectionCard>

      <div className="grid gap-4">
        <AdminSectionCard title="Members" description="People active in this project.">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Workload</TableHead>
                <TableHead>Presence</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {project.membersDetail.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium text-[#2d2b27]">
                    <div className="flex items-center gap-3">
                      <Avatar className="size-10">
                        <AvatarImage src={member.avatarUrl} alt={member.name} />
                        <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p>{member.name}</p>
                        <p className="text-xs font-normal text-[#787878]">{member.id}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{member.role}</TableCell>
                  <TableCell>{member.workload}</TableCell>
                  <TableCell>{member.presence}</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="icon" className="size-8 border-[#dcdcdc] bg-white text-[#413f39]">
                        <Pencil className="size-4" />
                      </Button>
                      <Button variant="outline" size="icon" className="size-8 border-[#dcdcdc] bg-white text-[#b91c1c]">
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </AdminSectionCard>

        <AdminSectionCard title="Roles" description="Workspace roles for this project.">
          <div className="space-y-3">
            {project.rolesDetail.map((role) => (
              <div key={role.id} className="rounded-2xl border border-[#f1eee7] bg-[#fbfaf7] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-[#2d2b27]">{role.name}</p>
                    <p className="text-sm text-[#787878]">{role.scope}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="border-[#dcdcdc] bg-white text-[#57534e]">
                      {role.members} members
                    </Badge>
                    <Button variant="outline" size="icon" className="size-8 border-[#dcdcdc] bg-white text-[#413f39]">
                      <Pencil className="size-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="size-8 border-[#dcdcdc] bg-white text-[#b91c1c]">
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {role.permissions.map((permission) => (
                    <Badge key={permission} className="bg-[#efece4] text-[#57534e] hover:bg-[#efece4]">
                      {permission}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
            <Button variant="outline" className="border-[#dcdcdc] bg-white text-[#413f39]">
              <Plus className="mr-2 size-4" />
              Add role
            </Button>
          </div>
        </AdminSectionCard>

        <AdminSectionCard title="Channels" description="Communication spaces for this project.">
          <div className="space-y-3">
            {project.channelsDetail.map((channel) => (
              <div key={channel.id} className="rounded-2xl border border-[#f1eee7] bg-[#fbfaf7] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-[#2d2b27]">#{channel.name}</p>
                    <p className="text-sm text-[#787878]">{channel.lastMessage}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="border-[#dcdcdc] bg-white text-[#57534e]">
                      {channel.type}
                    </Badge>
                    <Badge variant="outline" className="border-[#dcdcdc] bg-white text-[#57534e]">
                      {channel.unread} unread
                    </Badge>
                    <Button variant="outline" size="icon" className="size-8 border-[#dcdcdc] bg-white text-[#413f39]">
                      <Pencil className="size-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="size-8 border-[#dcdcdc] bg-white text-[#b91c1c]">
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            <Button variant="outline" className="border-[#dcdcdc] bg-white text-[#413f39]">
              <Plus className="mr-2 size-4" />
              Add channel
            </Button>
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
