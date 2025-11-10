"use server";

import {
  createSectionApi,
  updateSectionApi,
  deleteSectionApi,
} from "@/apis/section/section.api";
import { revalidatePath } from "next/cache";

export async function createSection({
  name,
  projectId,
  listOfTask,
}: {
  name: string;
  projectId: string;
  listOfTask?: string;
}) {
  try {
    const response = await createSectionApi({ name, projectId, listOfTask });
    const section = response.toSection();

    // revalidatePath(`/projects/${projectId}`);
    // revalidatePath("/my-tasks");

    return {
      isSuccess: true,
      message: "Section created successfully",
      data: section,
    };
  } catch (error: any) {
    console.log("Create section error:", error);
    return {
      isSuccess: false,
      message: error?.message || "Failed to create section",
    };
  }
}

export async function updateSection({
  id,
  name,
  listOfTask,
}: {
  id: string;
  name?: string;
  listOfTask?: string;
}) {
  try {
    const response = await updateSectionApi(id, { name, listOfTask });
    const section = response.toSection();

    // Revalidate project page
    revalidatePath(`/projects/[id]`, "page");

    return {
      isSuccess: true,
      message: "Section updated successfully",
      data: section,
    };
  } catch (error: any) {
    console.log("Update section error:", error);
    return {
      isSuccess: false,
      message: error?.message || "Failed to update section",
    };
  }
}

export async function deleteSection(id: string, projectId: string) {
  try {
    await deleteSectionApi(id);

    revalidatePath(`/projects/${projectId}`);
    revalidatePath("/my-tasks");

    return {
      isSuccess: true,
      message: "Section deleted successfully",
    };
  } catch (error: any) {
    console.log("Delete section error:", error);
    return {
      isSuccess: false,
      message: error?.message || "Failed to delete section",
    };
  }
}