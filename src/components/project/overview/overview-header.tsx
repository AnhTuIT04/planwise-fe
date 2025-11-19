"use client";

import { useState, useRef } from "react";
import { Edit, Users, Check, Loader2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useClickOutside } from "@/hooks/useClickOutside";
import { IProject } from "@/types/project.type";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import useModal from "@/hooks/useModal";

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

  const { openModal, closeModal } = useModal<"ADD_MEMBER">();

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

  const handleAddMemberClick = () => {
    openModal({
      type: "ADD_MEMBER",
      data: {
        project,
      },
      onSubmit: async () => {
        try {
          await new Promise((r) => setTimeout(r, 500));
        } catch (error) {
          console.error("Error during delete execution:", error);
        } finally {
          closeModal();
        }
      },
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between">
        {/* Left: Project Title + Description */}
        <div className="max-w-3xl">
          {!isEditingName && !isFetching ? (
            <h1 className="flex items-center gap-2 text-2xl font-semibold">
              <div className="flex h-12 w-12 items-center justify-center rounded-full text-2xl">
                <img src={project.logoUrl || ""} alt="Project avatar" />
              </div>
              <span className="max-w-[400px] truncate" title={project.name}>
                {project.name}
              </span>
              <Edit size={16} className="cursor-pointer text-gray-400 hover:text-gray-600" onClick={handleEditClick} />
            </h1>
          ) : (
            <form
              ref={formRef}
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveProjectName();
              }}
              className="flex items-center gap-2"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full text-2xl">
                <img src={project.logoUrl || ""} alt="Project avatar" />
              </div>
              <Input
                autoFocus
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                disabled={isUpdatingProject}
                className="h-10 flex-1 rounded-none border-t-0 border-r-0 border-b-2 border-l-0 border-blue-500 px-2 text-2xl font-semibold shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                placeholder="Enter project name"
              />
              <Button
                type="submit"
                size="sm"
                disabled={!projectName.trim() || isUpdatingProject || projectName === project.name}
                className="h-8 w-8 p-0"
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
          )}

          {/* Description - Editable */}
          {!isEditingDescription && !isFetching ? (
            <div className="group mt-4 flex items-start gap-2">
              <p className="flex-1 text-gray-600">{project.description || "No description"}</p>
              <Edit
                size={14}
                className="mt-1 cursor-pointer text-gray-400 opacity-0 transition-opacity group-hover:opacity-100 hover:text-gray-600"
                onClick={handleEditDescriptionClick}
              />
            </div>
          ) : isEditingDescription ? (
            <form
              ref={descriptionFormRef}
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveProjectDescription();
              }}
              className="mt-4"
            >
              <Textarea
                autoFocus
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                disabled={isUpdatingProject}
                className="min-h-20 resize-none border-2 border-blue-500"
                placeholder="Enter project description"
              />
              <div className="mt-2 flex gap-2">
                <Button
                  type="submit"
                  size="sm"
                  disabled={isUpdatingProject || projectDescription === (project.description || "")}
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

          {/* Owner Info */}
          <div className="mt-6 w-fit rounded-xl border bg-gray-50 p-4">
            <div className="flex items-center gap-3">
              <Avatar className="size-10">
                <AvatarImage src={project.owner.avatarUrl || undefined} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {getInitials(project.owner.fullname)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <p className="font-medium">{project.owner.fullname}</p>
                <p className="text-sm text-gray-500">{project.owner.email}</p>
                <p className="mt-1 text-xs text-gray-400">Project Owner</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Buttons */}
        <div className="flex flex-col gap-3">
          <button
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            onClick={handleAddMemberClick}
          >
            <Users size={16} /> Add Member
          </button>

          {/* <button className="flex items-center gap-2 rounded-lg border px-4 py-2 hover:bg-gray-50">
            <Edit size={16} /> Edit Project
          </button> */}
        </div>
      </div>
    </div>
  );
}
