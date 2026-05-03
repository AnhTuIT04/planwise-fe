import api from "@/lib/api";
import { IUserInProject } from "@/types/user.type";
import { IPagination } from "@/types/pagination.type";
interface IResponse {
  data: IUserInProject[];
  message: string;
  pagination: IPagination;
}

function toUsers(data: IResponse): IUserInProject[] {
  return data.data;
}

export function getMembersProjectApi(projectId: string) {
  return api.safeExec<IUserInProject[]>({ method: "GET", url: `projects/${projectId}/members` }, toUsers);
}