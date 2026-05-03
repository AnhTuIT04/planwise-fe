import api from "@/lib/api";
export type TaskStatus = "TODO" | "RUNNING" | "DONE" | "ARCHIVED";
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
interface ITaskResponse {
  task: TaskResponse;
  toTask(): TaskResponse;
}
function toTask(data: ITaskResponse): TaskResponse {
  return data.task;
}

export async function assignTaskToUsersApi(
  taskId: string,
  assigneeIds: string[]
): Promise<ITaskResponse> {
  try {
    const res = await api.patch<ITaskResponse>(`tasks/${taskId}/assignees`, {
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