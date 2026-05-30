import Link from "next/link";
import { ArrowRight, FolderKanban, MoreHorizontal, Pencil, Plus, Search, Trash2 } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminMetricCard } from "@/components/admin/admin-metric-card";
import { AdminSectionCard } from "@/components/admin/admin-section-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { adminProjectDetails, adminProjects, adminSections, adminTasks } from "@/data/admin.mock";

const healthClass = {
  "On track": "border-emerald-200 bg-emerald-50 text-emerald-700",
  "At risk": "border-amber-200 bg-amber-50 text-amber-700",
  "Needs review": "border-rose-200 bg-rose-50 text-rose-700",
} as const;

export default function AdminProjectsPage() {
  const totalSections = adminProjects.reduce((sum, project) => sum + project.sections, 0);
  const totalTasks = adminProjects.reduce((sum, project) => sum + project.tasks, 0);
  const totalChannels = adminProjects.reduce((sum, project) => sum + project.channels, 0);

  return (
    <div className="space-y-5">
      <AdminPageHeader
        eyebrow="Project management"
        title="Keep every project aligned"
        description="Monitor project health, delivery progress, and the structures that support each workspace."
        tags={["Projects", "Operations", "Delivery"]}
      />

      <div className="grid gap-4 md:grid-cols-4">
        <AdminMetricCard
          label="Projects"
          value={String(adminProjects.length)}
          hint="Tracked workspaces in this admin area."
          tone="sky"
        />
        <AdminMetricCard
          label="Sections"
          value={String(totalSections)}
          hint="Sections distributed across projects."
          tone="emerald"
        />
        <AdminMetricCard
          label="Tasks"
          value={String(totalTasks)}
          hint="Open and completed tasks across all projects."
          tone="amber"
        />
        <AdminMetricCard
          label="Channels"
          value={String(totalChannels)}
          hint="Project communication spaces."
          tone="rose"
        />
      </div>

      <AdminSectionCard
        title="Project roster"
        description="Create, edit, remove, or open the project detail view from here."
      >
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-sm">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#8a8a8a]" />
            <Input placeholder="Search projects" className="bg-[#fbfaf7] pl-9" />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className="border-[#dcdcdc] bg-white text-[#413f39]">
              <Plus className="mr-2 size-4" />
              Add project
            </Button>
            <Button className="bg-[#2d2b27] text-white hover:bg-[#403d38]">
              <FolderKanban className="mr-2 size-4" />
              Project templates
            </Button>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Members</TableHead>
              <TableHead>Sections</TableHead>
              <TableHead>Tasks</TableHead>
              <TableHead>Channels</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {adminProjects.map((project) => (
              <TableRow key={project.id}>
                <TableCell className="font-medium text-[#2d2b27]">
                  <div>
                    <p>{project.name}</p>
                    <p className="mt-1 max-w-[18rem] truncate text-xs leading-5 font-normal text-[#787878]">
                      {project.description}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="size-8">
                      <AvatarImage src={getOwnerAvatarUrl(project.id, project.owner)} alt={project.owner} />
                      <AvatarFallback>{getInitials(project.owner)}</AvatarFallback>
                    </Avatar>
                    <span>{project.owner}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={healthClass[project.status]}>
                    {project.status}
                  </Badge>
                </TableCell>
                <TableCell>{project.progress}%</TableCell>
                <TableCell>{project.members}</TableCell>
                <TableCell>{project.sections}</TableCell>
                <TableCell>{project.tasks}</TableCell>
                <TableCell>{project.channels}</TableCell>
                <TableCell>{project.updatedAt}</TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="icon" className="size-8 border-[#dcdcdc] bg-white text-[#413f39]">
                      <Pencil className="size-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="size-8 border-[#dcdcdc] bg-white text-[#413f39]">
                      <Trash2 className="size-4" />
                    </Button>
                    <Link
                      href={`/admin/projects/${project.id}`}
                      className="inline-flex items-center justify-center rounded-md border border-[#dcdcdc] bg-white p-2 text-[#413f39] transition-colors hover:bg-[#fbfaf7]"
                    >
                      <ArrowRight className="size-4" />
                    </Link>
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

      <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <AdminSectionCard title="Section snapshot" description="A fast look at section coverage across all projects.">
          <div className="space-y-3">
            {adminSections.map((section) => (
              <div key={section.id} className="rounded-2xl border border-[#f1eee7] bg-[#fbfaf7] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-[#2d2b27]">{section.name}</p>
                    <p className="text-sm text-[#787878]">{getProjectName(section.projectId)}</p>
                  </div>
                  <Badge variant="outline" className="border-[#dcdcdc] bg-white text-[#57534e]">
                    {section.state}
                  </Badge>
                </div>
                <p className="mt-3 text-sm text-[#787878]">
                  {section.completedCount} of {section.taskCount} tasks completed
                </p>
              </div>
            ))}
          </div>
        </AdminSectionCard>

        <AdminSectionCard title="Task spotlight" description="The current task load by project and section.">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Due</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {adminTasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell className="font-medium text-[#2d2b27]">{task.title}</TableCell>
                  <TableCell>{getProjectName(task.projectId)}</TableCell>
                  <TableCell>{task.priority}</TableCell>
                  <TableCell>{task.status}</TableCell>
                  <TableCell>{task.due}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </AdminSectionCard>
      </div>
    </div>
  );
}

function getProjectName(projectId: string) {
  return adminProjects.find((project) => project.id === projectId)?.name ?? projectId;
}

function getOwnerAvatarUrl(projectId: string, ownerName: string) {
  return (
    adminProjectDetails
      .find((project) => project.id === projectId)
      ?.membersDetail.find((member) => member.name === ownerName)?.avatarUrl ?? "/logo.svg"
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
