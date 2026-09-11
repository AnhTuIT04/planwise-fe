"use client";

import ListProjectSkeleton from "@/components/project/list-project-skeleton";
import ProjectCard from "@/components/project/project-card";
import { useProjectModalStore } from "@/stores/project-modal.store";
import { useProject } from "@/hooks/use-project";
import { IProject } from "@/types/project.type";

export default function ProjectsPage() {
  const { data: allProjects, isLoading: isLoadingAllProjects } = useProject();
  const { openModal } = useProjectModalStore();

  const handleAddProjectClick = () => {
    openModal({
      mode: "add",
    });
  };

  return (
    <div className="mx-auto my-1 ml-1 flex min-h-0 w-full flex-1 flex-col overflow-hidden rounded-l-[6px] border-y border-l border-[#dcdcdc] bg-[#f8f8f9] p-4 shadow-sm sm:p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold sm:text-3xl">Your Projects</h1>
        <button
          className="inline-flex items-center rounded-md bg-linear-to-r from-[#D60808] to-[#700404] px-3 py-1 font-semibold text-white shadow-sm transition-colors duration-500 hover:cursor-pointer hover:bg-linear-to-r hover:from-[#700404] hover:to-[#D60808] sm:px-4 sm:py-2"
          onClick={handleAddProjectClick}
        >
          New Project
        </button>
      </div>

      <div className="max-h-[calc(100vh-160px)] overflow-x-hidden overflow-y-auto px-2 pb-4">
        {isLoadingAllProjects ? (
          <ListProjectSkeleton />
        ) : (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {allProjects?.map((proj: IProject) => (
              <div key={proj.id} className="p-3">
                <ProjectCard
                  id={proj.id.toString()}
                  projectName={proj.name}
                  description={proj.description}
                  logoUrl={proj.logoUrl}
                  ownerName={proj.owner.fullname}
                  ownerEmail={proj.owner.email}
                  ownerAvatar={proj.owner.avatarUrl}
                  members={proj.memberCount}
                  sections={proj.sectionCount}
                  tasks={proj.taskCount}
                  todo={proj.taskCount / 2}
                  createdAt={proj.createdAt}
                  className="w-full"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {allProjects && allProjects.length === 0 && (
        <div className="mt-20 text-center font-bold text-gray-700">
          <p className="text-lg">You have no projects yet.</p>
          <p className="mt-2">{`Click "New Project" to create your first project!`}</p>
        </div>
      )}
    </div>
  );
}
