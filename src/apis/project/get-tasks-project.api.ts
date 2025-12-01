import api from "@/lib/api";
import { IProject } from "@/types/project.type";
import { ITask } from "@/types/task.type";
import { ISection } from "@/types/section.type";

interface IResponse {
  data: ISection[];
  message: string;
  pagination: IPagination;
}

interface IPagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export interface GetProjectTasksParams {
  deadlineFrom?: string;
  deadlineTo?: string;
}

function toProject(data: IResponse): ISection[] {
  return data.data;
}

export function getPersonalProjectApi() {
  return api.safeExec<IResponse>({ method: "GET", url: "project/personal" });
}

export function getProjectByIdApi(projectId: string, params?: GetProjectTasksParams) {
  const queryParams = new URLSearchParams();
  
  if (params?.deadlineFrom) queryParams.append("deadlineFrom", params.deadlineFrom);
  if (params?.deadlineTo) queryParams.append("deadlineTo", params.deadlineTo);
  
  const queryString = queryParams.toString();
  const url = `project/${projectId}/tasks${queryString ? `?${queryString}` : ""}`;
  
  return api.safeExec<ISection[]>({ method: "GET", url }, toProject);
}
