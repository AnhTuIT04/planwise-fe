"use client";

import ListProjectSkelethon from "@/components/project/list-project-skelethon";
import ProjectCard from "@/components/project/project-card";
import { useProject } from "@/hooks/useProject";
import { all } from "axios";

export default function ProjectsPage() {
  const { allProjects, isLoadingAllProjects } = useProject();

  return (
    <div className="mx-auto w-full p-4 shadow-lg rounded-2xl  sm:p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold sm:text-3xl">Your Projects</h1>
        <button className="inline-flex items-center rounded-md bg-linear-to-r from-[#D60808] to-[#700404] px-3 py-1 font-semibold text-white shadow-sm hover:cursor-pointer transition-colors duration-500 hover:bg-linear-to-r hover:from-[#700404] hover:to-[#D60808] sm:px-4 sm:py-2">
          New Project
        </button>
      </div>

      {/* Scrollable grid area: limits height and allows vertical scrolling when many cards */}
      <div className="max-h-[calc(100vh-160px)] overflow-x-hidden overflow-y-auto pr-2">
        {isLoadingAllProjects ? (
          <ListProjectSkelethon />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {allProjects!.map((proj) => (
              <ProjectCard
                id={proj.id.toString()}
                key={proj.id}
                projectName={proj.name}
                description={proj.description}
                logoUrl={proj.logoUrl}
                ownerName={proj.owner.fullname}
                ownerEmail={proj.owner.email}
                ownerAvatar={proj.owner.avatarUrl}
                members={proj.members.length + 1} // +1 for owner
                sections={proj.sectionCount}
                tasks={proj.taskCount}
                todo={proj.taskCount / 2}
                createdAt={proj.createdAt}
                className="w-full"
              />
            ))}
          </div>
        )}
      </div>

      {allProjects && allProjects.length === 0 && (
        <div className="mt-20 font-bold text-center text-gray-700">
          <p className="text-lg">You have no projects yet.</p>
          <p className="mt-2">Click "New Project" to create your first project!</p>
        </div>
      )}
    </div>
  );
}
