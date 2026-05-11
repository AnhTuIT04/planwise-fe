"use client";

import { useState, useRef } from "react";
import { Edit, Users, Check, Loader2, X, CalendarDays, Crown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useClickOutside } from "@/hooks/use-click-outside";
import { IProject } from "@/types/project.type";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useProjectModalStore } from "@/stores/project-modal.store";
import { useMemberModalStore } from "@/stores/member-modal.store";

interface OverviewHeaderProps {
  project: IProject;
  isFetching: boolean;
  isUpdatingProject: boolean;
  onUpdateProject: (data: { id: string; name?: string; description?: string }) => Promise<any>;
}

export default function OverviewHeader({
  project,
  isFetching,
  isUpdatingProject,
  onUpdateProject,
}: OverviewHeaderProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const descriptionFormRef = useRef<HTMLFormElement>(null);

  const { openModal: openProjectModal } = useProjectModalStore();
  const { openModal: openMemberModal } = useMemberModalStore();

  useClickOutside(formRef, () => {
    if (!isUpdatingProject) {
      setIsEditingName(false);
      setProjectName(project?.name || "");
    }
  });

  useClickOutside(descriptionFormRef, () => {
    if (!isUpdatingProject) {
      setIsEditingDescription(false);
      setProjectDescription(project?.description || "");
    }
  });

  const handleEditClick = () => {
    setProjectName(project?.name || "");
    setIsEditingName(true);
  };

  const handleEditDescriptionClick = () => {
    setProjectDescription(project?.description || "");
    setIsEditingDescription(true);
  };

  const handleSaveProjectName = async () => {
    if (!projectName.trim() || projectName === project?.name) {
      setIsEditingName(false);
      return;
    }
    await onUpdateProject({ id: project.id, name: projectName.trim() });
    setIsEditingName(false);
  };

  const handleSaveProjectDescription = async () => {
    if (projectDescription === (project?.description || "")) {
      setIsEditingDescription(false);
      return;
    }
    await onUpdateProject({ id: project.id, description: projectDescription.trim() });
    setIsEditingDescription(false);
  };

  const handleCancel = () => {
    setIsEditingName(false);
    setProjectName(project?.name || "");
  };

  const handleCancelDescription = () => {
    setIsEditingDescription(false);
    setProjectDescription(project?.description || "");
  };

  const handleUpdateProjectClick = () => {
    openProjectModal({ mode: "update", project });
  };

  const handleAddMemberClick = () => {
    openMemberModal({ mode: "add", project });
  };

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const formattedCreated = new Date(project.createdAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      {/* Decorative gradient banner */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-br from-[#D60808]/12 via-[#700404]/6 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full bg-[#D60808]/8 blur-3xl"
      />

      <div className="relative p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-6">
          {/* Left: Avatar + Title + Description */}
          <div className="flex min-w-0 flex-1 items-start gap-4">
            <Avatar className="h-16 w-16 shrink-0 shadow-md ring-2 ring-white sm:h-20 sm:w-20">
              <AvatarImage src={project.logoUrl || undefined} alt={project.name} />
              <AvatarFallback className="bg-gradient-to-br from-[#D60808] to-[#700404] text-2xl font-semibold text-white sm:text-3xl">
                {project.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1">
              {/* Title - inline editable */}
              {!isEditingName && !isFetching ? (
                <div className="group flex items-center gap-2">
                  <h1
                    className="truncate text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl"
                    title={project.name}
                  >
                    {project.name}
                  </h1>
                  <button
                    type="button"
                    onClick={handleEditClick}
                    className="rounded-md p-1 text-gray-400 opacity-0 transition-opacity hover:bg-gray-100 hover:text-gray-700 group-hover:opacity-100"
                    aria-label="Edit project name"
                  >
                    <Edit size={16} />
                  </button>
                </div>
              ) : isEditingName ? (
                <form
                  ref={formRef}
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSaveProjectName();
                  }}
                  className="flex items-center gap-2"
                >
                  <Input
                    autoFocus
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    disabled={isUpdatingProject}
                    className="h-10 flex-1 rounded-none border-x-0 border-t-0 border-b-2 border-[#D60808] px-2 text-2xl font-semibold shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 sm:text-3xl"
                    placeholder="Enter project name"
                  />
                  <Button
                    type="submit"
                    size="sm"
                    disabled={!projectName.trim() || isUpdatingProject || projectName === project.name}
                    className="h-8 w-8 bg-gradient-to-r from-[#D60808] to-[#700404] p-0 transition-colors duration-500 hover:cursor-pointer hover:from-[#700404] hover:to-[#D60808]"
                  >
                    {isUpdatingProject ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleCancel}
                    disabled={isUpdatingProject}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </form>
              ) : null}

              {/* Description - inline editable */}
              {!isEditingDescription && !isFetching ? (
                <div className="group mt-2 flex items-start gap-2">
                  <p className="line-clamp-3 max-w-2xl text-gray-600">{project.description || "No description"}</p>
                  <button
                    type="button"
                    onClick={handleEditDescriptionClick}
                    className="mt-0.5 rounded-md p-1 text-gray-400 opacity-0 transition-opacity hover:bg-gray-100 hover:text-gray-700 group-hover:opacity-100"
                    aria-label="Edit project description"
                  >
                    <Edit size={14} />
                  </button>
                </div>
              ) : isEditingDescription ? (
                <form
                  ref={descriptionFormRef}
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSaveProjectDescription();
                  }}
                  className="mt-2 max-w-2xl"
                >
                  <Textarea
                    autoFocus
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    disabled={isUpdatingProject}
                    className="min-h-20 resize-none border-2 border-[#D60808]/60 focus-visible:border-[#D60808] focus-visible:ring-0"
                    placeholder="Enter project description"
                  />
                  <div className="mt-2 flex gap-2">
                    <Button
                      type="submit"
                      size="sm"
                      disabled={isUpdatingProject || projectDescription === (project.description || "")}
                      className="bg-gradient-to-r from-[#D60808] to-[#700404] transition-colors duration-500 hover:cursor-pointer hover:from-[#700404] hover:to-[#D60808]"
                    >
                      {isUpdatingProject ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleCancelDescription}
                      disabled={isUpdatingProject}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : null}

              {/* Meta row */}
              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500">
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays size={14} />
                  Created {formattedCreated}
                </span>
                <span className="text-gray-300">•</span>
                <span className="inline-flex items-center gap-1.5">
                  <Users size={14} />
                  {project.memberCount} {project.memberCount === 1 ? "member" : "members"}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Action buttons */}
          <div className="flex shrink-0 flex-wrap gap-2">
            <button
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#D60808] to-[#700404] px-4 py-2 text-sm font-medium text-white shadow-sm transition-all duration-500 hover:cursor-pointer hover:from-[#700404] hover:to-[#D60808] hover:shadow-md"
              onClick={handleAddMemberClick}
            >
              <Users size={16} /> Add Member
            </button>
            <button
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:cursor-pointer hover:bg-gray-50"
              onClick={handleUpdateProjectClick}
            >
              <Edit size={16} /> Edit Project
            </button>
          </div>
        </div>

        {/* Owner card */}
        <div className="mt-6 inline-flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/70 px-4 py-3 backdrop-blur-sm">
          <Avatar className="h-11 w-11 ring-2 ring-white">
            <AvatarImage src={project.owner.avatarUrl || undefined} />
            <AvatarFallback className="bg-gradient-to-br from-[#D60808] to-[#700404] text-white">
              {getInitials(project.owner.fullname)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold tracking-wider text-[#700404] uppercase">
              <Crown size={11} /> Project Owner
            </span>
            <p className="font-semibold text-gray-900">{project.owner.fullname}</p>
            <p className="text-xs text-gray-500">{project.owner.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
