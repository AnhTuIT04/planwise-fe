import api from "@/lib/api";
import { IProject } from "@/types/project.type";

interface IResponse {
  data: {
    id: string;
    owner: {
      id: string;
      email: string;
      fullname: string;
      avatarUrl: string | null;
    };
    name: string;
    description: string | null;
    logoUrl: string | null;
    isPersonal: boolean;
    memberCount: number;
    sectionCount: number;
    taskCount: number;
    createdAt: string;
  };
  message: string;
}

function toProject(data: IResponse): IProject {
  return {
    id: data.data.id,
    owner: data.data.owner,
    name: data.data.name,
    description: data.data.description,
    logoUrl: data.data.logoUrl,
    isPersonal: data.data.isPersonal,
    memberCount: data.data.memberCount,
    sectionCount: data.data.sectionCount,
    taskCount: data.data.taskCount,
    createdAt: data.data.createdAt,
  };
}

export async function getProjectDetailApi(projectId: string) {
  const res = await api.get<IResponse>(`projects/${projectId}`);

  return {
    ...res.data,
    toProject: () => toProject(res.data),
  };
}
