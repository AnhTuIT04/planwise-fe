"use server";

import { cookies } from "next/headers";
import {
  createProjectApi,
  getAllProjectsApi,
  getPersonalProjectApi,
  getDetailedProjectApi,
  updateProjectApi,
  deleteProjectApi,
} from "@/apis/project/project.api";
import { revalidatePath } from "next/cache";

export async function createProject({
  name,
  description,
  isPersonal = false,
}: {
  name: string;
  description?: string;
  isPersonal?: boolean;
}) {
  try {
    const response = await createProjectApi({ name, description, isPersonal });
    const project = response.toProject();

    // revalidatePath("/projects");
    // revalidatePath("/my-tasks");

    return {
      isSuccess: true,
      message: "Project created successfully",
      data: project,
    };
  } catch (error: any) {
    console.log("Create project error:", error);
    return {
      isSuccess: false,
      message: error?.message || "Failed to create project",
    };
  }
}

export async function getAllProjects() {
  try {
    const response = await getAllProjectsApi();
    const projects = response.toProjects();

    return {
      isSuccess: true,
      data: projects,
    };
  } catch (error: any) {
    console.log("Get all projects error:", error);
    return {
      isSuccess: false,
      message: error?.message || "Failed to fetch projects",
      data: [],
    };
  }
}

export async function getPersonalProject() {
  try {
    const response = await getPersonalProjectApi();
    console.log("response personal project", response);
    const project = response.toProject();

    return {
      isSuccess: true,
      data: project,
    };
  } catch (error: any) {
    console.log("Get personal project error:", error);
    return {
      isSuccess: false,
      message: error?.message || "Failed to fetch personal project",
      data: null,
    };
  }
}

export async function getProjectDetail(id: string) {
  try {
    const response = await getDetailedProjectApi(id);
    const project = response.toProject();

    return {
      isSuccess: true,
      data: project,
    };
  } catch (error: any) {
    console.log("Get project detail error:", error);
    return {
      isSuccess: false,
      message: error?.message || "Project not found",
      data: null,
    };
  }
}

export async function updateProject({
  id,
  name,
  description,
}: {
  id: string;
  name?: string;
  description?: string;
}) {
  try {
    const response = await updateProjectApi(id, { name, description });
    const project = response.toProject();

    revalidatePath(`/projects/${id}`);
    revalidatePath("/projects");

    return {
      isSuccess: true,
      message: "Project updated successfully",
      data: project,
    };
  } catch (error: any) {
    console.log("Update project error:", error);
    return {
      isSuccess: false,
      message: error?.message || "Failed to update project",
    };
  }
}

export async function deleteProject(id: string) {
  try {
    await deleteProjectApi(id);

    // revalidatePath("/projects");
    // revalidatePath("/my-tasks");

    return {
      isSuccess: true,
      message: "Project deleted successfully",
    };
  } catch (error: any) {
    console.log("Delete project error:", error);
    return {
      isSuccess: false,
      message: error?.message || "Failed to delete project",
    };
  }
}