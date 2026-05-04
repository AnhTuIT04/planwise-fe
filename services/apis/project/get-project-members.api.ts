import api from "@/lib/api";
import { IProjectMember } from "@/types/user.type";

interface IResponse {
  data: {
    id: string;
    email: string;
    fullname: string;
    avatarUrl: string | null;
    role: {
      id: string;
      name: string;
      default: boolean;
      permissions: string[];
    };
  }[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
  message: string;
}

function toUsers(data: IResponse): IProjectMember[] {
  return data.data.map((user) => ({
    id: user.id,
    email: user.email,
    fullname: user.fullname,
    avatarUrl: user.avatarUrl,
    role: {
      id: user.role.id,
      name: user.role.name,
      default: user.role.default,
      permissions: user.role.permissions.map((permission) => ({
        permission,
        name: permission,
        description: "",
      })),
    },
  }));
}

export async function getProjectMembersApi(projectId: string) {
  const res = await api.get<IResponse>(`projects/${projectId}/members`);

  return {
    ...res.data,
    toUsers: () => toUsers(res.data),
  };
}
