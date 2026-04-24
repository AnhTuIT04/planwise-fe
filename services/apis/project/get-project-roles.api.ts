import api from "@/lib/api";
import { IRole } from "@/types/role.type";

interface IResponse {
  data: {
    id: string;
    name: string;
    default: boolean;
    permissions: string[];
  }[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
  message: string;
}

function toRoles(data: IResponse): IRole[] {
  return data.data.map((role) => ({
    id: role.id,
    name: role.name,
    default: role.default,
    permissions: role.permissions,
  }));
}

export async function getProjectRolesApi(projectId: string) {
  const res = await api.get<IResponse>(`projects/${projectId}/roles`);

  return {
    ...res.data,
    toRoles: () => toRoles(res.data),
  };
}
