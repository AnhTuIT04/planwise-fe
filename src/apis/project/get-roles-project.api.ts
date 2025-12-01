import api from "@/lib/api";
import { IPagination } from "@/types/pagination.type";
import { IRole } from "@/types/role.type";
interface IResponse {
  data: IRole[];
  message: string;
  pagination: IPagination;
}

function toRoles(data: IResponse): IRole[] {
  return data.data;
}

export function getRolesProjectApi(projectId: string) {
  return api.safeExec<IRole[]>({ method: "GET", url: `project/${projectId}/roles` }, toRoles);
}