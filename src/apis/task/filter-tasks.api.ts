import api from "@/lib/api";
import { ITask } from "@/types/task.type";

export interface TaskFilterParams {
  projectId?: string;
  status?: "TODO" | "RUNNING" | "DONE" | "ARCHIVED";
  priority?: "LOW" | "NORMAL" | "HIGH" | "URGENT";
  sectionId?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

interface IFilterTasksResponse {
  data: ITask[];
  message: string;
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

function toTasks(response: IFilterTasksResponse): ITask[] {
  return response.data;
}

export function filterTasksApi(projectId: string, params: TaskFilterParams = {}) {
  const queryParams = new URLSearchParams();
  
  if (params.status) queryParams.append("status", params.status);
  if (params.priority) queryParams.append("priority", params.priority);
  if (params.sectionId) queryParams.append("sectionId", params.sectionId);
  if (params.search) queryParams.append("search", params.search);
  if (params.startDate) queryParams.append("startDate", params.startDate);
  if (params.endDate) queryParams.append("endDate", params.endDate);
  if (params.page) queryParams.append("page", params.page.toString());
  if (params.limit) queryParams.append("limit", params.limit.toString());

  const queryString = queryParams.toString();
  const url = `project/${projectId}/tasks${queryString ? `?${queryString}` : ""}`;

  return api.safeExec<ITask[]>({ method: "GET", url }, toTasks);
}
