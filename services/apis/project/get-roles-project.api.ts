import api from "@/lib/api";
import { IPagination } from "@/types/pagination.type";
import { IRole } from "@/types/role.type";

interface IRawRole {
  id: string;
  name: string;
  default: boolean;
  permissions: (string | { permission: string; name?: string; description?: string })[];
}

interface IResponse {
  data: IRawRole[];
  message: string;
  pagination: IPagination;
}

function toRoles(data: IResponse): IRole[] {
  return data.data.map((role) => ({
    id: role.id,
    name: role.name,
    default: role.default,
    permissions: role.permissions.map((p) =>
      typeof p === "string"
        ? { permission: p, name: p, description: "" }
        : { permission: p.permission, name: p.name ?? p.permission, description: p.description ?? "" },
    ),
  }));
}

export function getRolesProjectApi(projectId: string) {
  return api.safeExec<IRole[]>({ method: "GET", url: `projects/${projectId}/roles` }, toRoles);
}