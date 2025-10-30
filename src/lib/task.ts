"use server";

import {
  createTaskApi,
  getTaskDetailApi,
  updateTaskApi,
  deleteTaskApi,
  assignTaskToUsersApi,
} from "@/apis/task/task.api";
import { revalidatePath } from "next/cache";

export async function createTask(payload: {
  title: string;
  description?: string;
  status?: "TODO" | "DONE";
  priority?: "LOW" | "MEDIUM" | "HIGH";
  startDate?: string;
  dueDate?: string;
  sectionId?: string;
  projectId: string;
  parentTaskId?: string;
  supervisorId?: string;
  assigneeIds?: string[];
}) {
  try {
    console.log("Created task:", payload);
    const response = await createTaskApi(payload);
    const task = response.toTask();
    console.log("Created task:", task);
    revalidatePath(`/projects/${payload.projectId}`);
    revalidatePath("/my-tasks");

    return {
      isSuccess: true,
      message: "Task created successfully",
      data: task,
    };
  } catch (error: any) {
    console.log("Create task error:", error);
    return {
      isSuccess: false,
      message: error?.message || "Failed to create task",
    };
  }
}

export async function getTaskDetail(id: string) {
  try {
    const response = await getTaskDetailApi(id);
    const task = response.toTask();

    return {
      isSuccess: true,
      data: task,
    };
  } catch (error: any) {
    console.log("Get task detail error:", error);
    return {
      isSuccess: false,
      message: "Task not found",
      data: null,
    };
  }
}

export async function updateTask({
  id,
  isPersonal = false,
  ...payload
}: {
  id: string;
  isPersonal?: boolean;
  title?: string;
  description?: string;
  status?: "TODO" | "DONE";
  priority?: "LOW" | "MEDIUM" | "HIGH";
  startDate?: string;
  dueDate?: string;
  sectionId?: string;
  projectId?: string;
  parentTaskId?: string;
  supervisorId?: string;
  assigneeIds?: string[];
}) {
  try {
    const response = await updateTaskApi(id, payload, isPersonal);
    const task = response.toTask();

    // Revalidate cả project và my-tasks
    // if (payload.projectId) {
    //   revalidatePath(`/projects/${payload.projectId}`);
    // }
    // revalidatePath("/my-tasks");

    return {
      isSuccess: true,
      message: "Task updated successfully",
      data: task,
    };
  } catch (error: any) {
    console.log("Update task error:", error);
    return {
      isSuccess: false,
      message: error?.message || "Failed to update task",
    };
  }
}

export async function deleteTask({
  id,
  isPersonal = false,
  projectId,
}: {
  id: string;
  isPersonal?: boolean;
  projectId?: string;
}) {
  try {
    await deleteTaskApi(id, isPersonal);

    // if (projectId) {
    //   revalidatePath(`/projects/${projectId}`);
    // }
    // revalidatePath("/my-tasks");

    return {
      isSuccess: true,
      message: "Task deleted successfully",
    };
  } catch (error: any) {
    console.log("Delete task error:", error);
    return {
      isSuccess: false,
      message: error?.message || "Failed to delete task",
    };
  }
}

export async function assignTask({
  taskId,
  assigneeIds,
}: {
  taskId: string;
  assigneeIds: string[];
}) {
  try {
    const response = await assignTaskToUsersApi(taskId, assigneeIds);
    const task = response.toTask();

    // revalidatePath(`/tasks/${taskId}`);
    // revalidatePath("/my-tasks");

    return {
      isSuccess: true,
      message: "Task assigned successfully",
      data: task,
    };
  } catch (error: any) {
    console.log("Assign task error:", error);
    return {
      isSuccess: false,
      message: error?.message || "Failed to assign task",
    };
  }
}