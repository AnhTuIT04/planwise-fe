import ProjectSidebar from "@/components/sidebar/project-sidebar";

export default async function ProjectLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full w-full overflow-hidden border-l border-gray-300">
      <ProjectSidebar />
      <div className="flex min-w-0 flex-1">{children}</div>
    </div>
  );
}
