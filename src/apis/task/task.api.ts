import api from "@/lib/api";
import { formatISO } from "date-fns";
export type TaskStatus = "TODO" | "RUNNING" | "DONE" | "ARCHIVED";

export interface CreateTaskRequest {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: "LOW" | "NORMAL" | "HIGH" | "URGENT";
  estimate?: number; // minutes
  timeSpent?: number; // seconds
  lastStarted?: Date | null;
  startDate?: string; // ISO string
  dueDate?: string; // ISO string
  sectionId?: string;
  parentTaskId?: string;
  supervisorId?: string;
  assigneeIds?: string[];
  subtasks?: Array<{
    title: string;
    status?: TaskStatus;
    estimate?: number;
    timeSpent?: number;
  }>;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: "LOW" | "NORMAL" | "HIGH" | "URGENT";
  estimate?: number; // minutes
  timeSpent?: number; // seconds
  lastStarted?: Date | null;
  startDate?: string;
  dueDate?: string;
  sectionId?: string;
  parentTaskId?: string;
  supervisorId?: string;
  assigneeIds?: string[];
  subtasks?: Array<{
    id?: string;
    title: string;
    status?: TaskStatus;
    estimate?: number;
    timeSpent?: number;
  }>;
}

export interface TaskResponse {
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: "LOW" | "NORMAL" | "HIGH" | "URGENT" | null;
  estimate: number;
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
interface IDeleteTask{
  projectId: string;
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
      `task/${id}`,
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
export async function updateTaskStatusApi(
  id: string,
  payload: { status: TaskStatus, sectionId: string }
): Promise<ITaskResponse> {
  try {
    const res = await api.patch<ITaskResponse>(
      `task/${id}/status`,
      payload
    );
    return {
      ...res.data,
      toTask: () => toTask(res.data),
    };
  } catch (error: any) {
    console.error("updateTaskStatusApi error:", error);
    throw error;
  }
}
// DELETE
export async function deleteTaskApi(
  id: string,
  payload :{projectId: string},
  isPersonal: boolean = false
): Promise<void> {
  try {
    await api.delete(`task/${id}`, { data: payload });
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
    const res = await api.patch<ITaskResponse>(`task/${taskId}/assignees`, {
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