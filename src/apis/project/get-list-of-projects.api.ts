import api from "@/lib/api";
import { IProject } from "@/types/project.type";

interface IProjectResponse {
  data: IProject[];
  message: string;
  pagination: Pagination;
}

interface Pagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

function toProject(data: IProjectResponse): IProject[] {
  return data.data;
}

export function getListOfProjects() {
    return api.safeExec<IProject[]>({ method: "GET", url: "project" }, toProject);
}