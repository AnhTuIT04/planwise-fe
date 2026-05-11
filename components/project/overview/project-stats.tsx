import { Users, Layers, CheckSquare, CalendarDays } from "lucide-react";
import StatCard from "./stat-card";
import { IProject } from "@/types/project.type";

export default function ProjectStats({ project }: { project: IProject }) {
  const createdDate = new Date(project.createdAt);
  const msPerDay = 1000 * 60 * 60 * 24;
  const daysSinceCreated = Math.max(0, Math.floor((Date.now() - createdDate.getTime()) / msPerDay));
  const formattedCreated = createdDate.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const tasksPerSection = project.sectionCount > 0 ? (project.taskCount / project.sectionCount).toFixed(1) : "0";

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        icon={Users}
        iconColor="text-blue-700"
        iconBgColor="bg-blue-100"
        value={project.memberCount}
        label="Team Members"
        subLabel={project.memberCount === 1 ? "Just you for now" : "Collaborators"}
      />

      <StatCard
        icon={Layers}
        iconColor="text-green-700"
        iconBgColor="bg-green-100"
        value={project.sectionCount}
        label="Sections"
        subLabel={project.sectionCount === 0 ? "Add one to get started" : `${tasksPerSection} tasks / section`}
      />

      <StatCard
        icon={CheckSquare}
        iconColor="text-purple-700"
        iconBgColor="bg-purple-100"
        value={project.taskCount}
        label="Total Tasks"
        subLabel={project.taskCount === 0 ? "No tasks yet" : "Across all sections"}
      />

      <StatCard
        icon={CalendarDays}
        iconColor="text-orange-700"
        iconBgColor="bg-orange-100"
        value={daysSinceCreated === 0 ? "Today" : `${daysSinceCreated}d`}
        label="Active"
        subLabel={`Since ${formattedCreated}`}
      />
    </div>
  );
}
