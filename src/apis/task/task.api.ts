import api from "@/lib/api";
import { formatISO } from "date-fns";
export type TaskStatus = "TODO" | "RUNNING" | "DONE" | "ARCHIVED";

export interface CreateTaskRequest {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: "LOW" | "MEDIUM" | "HIGH";
  timeEstimate?: number; // minutes
  timeSpent?: number; // seconds
  lastStarted?: Date | null;
  startDate?: string; // ISO string
  dueDate?: string; // ISO string
  sectionId?: string;
  projectId: string;
  parentTaskId?: string;
  supervisorId?: string;
  assigneeIds?: string[];
  subtasks?: Array<{
    title: string;
    status?: TaskStatus;
    timeEstimate?: number;
    timeSpent?: number;
  }>;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: "LOW" | "MEDIUM" | "HIGH";
  timeEstimate?: number; // minutes
  timeSpent?: number; // seconds
  lastStarted?: Date | null;
  startDate?: string;
  dueDate?: string;
  sectionId?: string;
  projectId?: string;
  parentTaskId?: string;
  supervisorId?: string;
  assigneeIds?: string[];
  subtasks?: Array<{
    id?: string;
    title: string;
    status?: TaskStatus;
    timeEstimate?: number;
    timeSpent?: number;
  }>;
}

export interface TaskResponse {
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: "LOW" | "MEDIUM" | "HIGH" | null;
  timeEstimate: number;
  timeSpent: number;
  lastStarted: string | null;
  startDate: string | null; // ISO string
  dueDate: string | null; // ISO string
  sectionId: string | null;
  projectId: string;
  parentTaskId: string | null;
  supervisorId: string | null;
  assigneeIds: string[];
  subtasks?: TaskResponse[];
  id: string;
  createdAt: string;
  updatedAt: string;
}
const toUTCISO = (date?: string) => {
  if (!date) return undefined;
  try {
    const d = new Date(date);
    return d.toISOString();
  } catch {
    return undefined;
  }
};
interface ITaskResponse {
  task: TaskResponse;
  toTask(): TaskResponse;
}

function toTask(data: ITaskResponse): TaskResponse {
  return data.task;
}

// CREATE
export async function createTaskApi(
  payload: CreateTaskRequest
): Promise<ITaskResponse> {
  try {
    const formattedPayload = {
      ...payload,
      startDate: toUTCISO(payload.startDate),
      dueDate: toUTCISO(payload.dueDate),
    };

    console.log("createTaskApi request:", formattedPayload);
    const res = await api.post<ITaskResponse>("task", formattedPayload);
    console.log("createTaskApi response:", res);
    return {
      ...res.data,
      toTask: () => toTask(res.data),
    };
  } catch (error: any) {
    console.error("createTaskApi error:", error);
    throw error;
  }
}

// READ - Detail
export async function getTaskDetailApi(id: string): Promise<ITaskResponse> {
  try {
    const res = await api.get<ITaskResponse>(`task/${id}`);
    return {
      ...res.data,
      toTask: () => toTask(res.data),
    };
  } catch (error: any) {
    console.error("getTaskDetailApi error:", error);
    throw error;
  }
}

// UPDATE (partial)
export async function updateTaskApi(
  id: string,
  payload: UpdateTaskRequest,
  isPersonal: boolean = false
): Promise<ITaskResponse> {
  try {
    const res = await api.patch<ITaskResponse>(
      `task/${id}?isPersonal=${isPersonal}`,
      payload
    );
    return {
      ...res.data,
      toTask: () => toTask(res.data),
    };
  } catch (error: any) {
    console.error("updateTaskApi error:", error);
    throw error;
  }
}

// DELETE
export async function deleteTaskApi(
  id: string,
  isPersonal: boolean = false
): Promise<void> {
  try {
    await api.delete(`task/${id}?isPersonal=${isPersonal}`);
  } catch (error: any) {
    console.error("deleteTaskApi error:", error);
    throw error;
  }
}

// ASSIGN USERS (nếu có endpoint)
export async function assignTaskToUsersApi(
  taskId: string,
  assigneeIds: string[]
): Promise<ITaskResponse> {
  try {
    const res = await api.post<ITaskResponse>("task/assign", {
      id: taskId,
      assigneeIds,
    });
    return {
      ...res.data,
      toTask: () => toTask(res.data),
    };
  } catch (error: any) {
    console.error("assignTaskToUsersApi error:", error);
    throw error;
  }
}