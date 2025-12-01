import api from "@/lib/api";
import { ITask } from "@/types/task.type";
import { ISection } from "@/types/section.type";
export interface SearchTasksParams {
  q?: string;
  deadlineFrom?: string;
  deadlineTo?: string;
  sections?: string[];
  statuses?: ("TODO" | "RUNNING" | "DONE" | "ARCHIVED")[];
  priorities?: ("LOW" | "NORMAL" | "HIGH" | "URGENT")[];
  overdue?: boolean;
  overspent?: boolean;
}

interface ISearchTasksResponse {
  data: ISection[];
  message: string;
}

function toTasks(response: ISearchTasksResponse): ISection[] {
  return response.data;
}

export function searchTasksApi(projectId: string, params: SearchTasksParams = {}) {
  const queryParams = new URLSearchParams();
  
  if (params.q) queryParams.append("q", params.q);
  if (params.deadlineFrom) queryParams.append("deadlineFrom", params.deadlineFrom);
  if (params.deadlineTo) queryParams.append("deadlineTo", params.deadlineTo);
  if (params.sections?.length) {
    params.sections.forEach(s => queryParams.append("sections", s));
  }
  if (params.statuses?.length) {
    params.statuses.forEach(s => queryParams.append("statuses", s));
  }
  if (params.priorities?.length) {
    params.priorities.forEach(p => queryParams.append("priorities", p));
  }

  const queryString = queryParams.toString();
  const url = `project/${projectId}/tasks${queryString ? `?${queryString}` : ""}`;

  return api.safeExec<ISection[]>({ method: "GET", url }, toTasks);
}
