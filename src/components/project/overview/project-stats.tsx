import { Users, Layers, CheckSquare, TrendingUp, Calendar } from "lucide-react";
import StatCard from "./stat-card";
import { IProject } from "@/types/project.type";

export default function ProjectStats({ project }: { project: IProject }) {
    const randomComplete = Math.floor(Math.random() * project.taskCount);
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
      <StatCard
        icon={Users}
        iconColor="text-blue-700"
        iconBgColor="bg-blue-100"
        value={project.members.length + 1}
        label="Team Members"
      />

      <StatCard
        icon={Layers}
        iconColor="text-green-700"
        iconBgColor="bg-green-100"
        value={project.sectionCount}
        label="Sections"
        subLabelColor="text-green-700"
      />

      <StatCard
        icon={CheckSquare}
        iconColor="text-purple-700"
        iconBgColor="bg-purple-100"
        value={project.taskCount}
        label="Total Tasks"
        subLabel={`Completed ${Math.floor(randomComplete)}`}
        subLabelColor="text-green-700"
      />

      <StatCard
        icon={TrendingUp}
        iconColor="text-orange-700"
        iconBgColor="bg-orange-100"
        value={(Math.floor(randomComplete / project.taskCount * 100)) || 0 + "%"}
        label="Progress"
        progress={(randomComplete / project.taskCount) || 0 * 100}
      />

      <StatCard
        icon={Calendar}
        iconColor="text-gray-700"
        iconBgColor="bg-gray-100"
        value={project.createdAt.slice(5, 10)}
        label="Created Date"
        subLabel={project.createdAt.slice(0, 4)}
      />
    </div>
  );
}
