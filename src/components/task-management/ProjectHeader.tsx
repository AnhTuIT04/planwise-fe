import { IProject } from "@/types/project.type";

interface ProjectHeaderProps {
  project: IProject | undefined;
  selectedProjectId: string | null;
}

export default function ProjectHeader({ project, selectedProjectId }: ProjectHeaderProps) {
  return (
    <h1 className="text-2xl font-bold mb-6">
      {project?.name || "Tasks"}
    </h1>
  );
}