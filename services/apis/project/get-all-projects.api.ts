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
  }[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
  message: string;
}

function toProjects(data: IResponse): IProject[] {
  return data.data.map((project) => ({
    id: project.id,
    owner: project.owner,
    name: project.name,
    description: project.description,
    logoUrl: project.logoUrl,
    isPersonal: project.isPersonal,
    memberCount: project.memberCount,
    sectionCount: project.sectionCount,
    taskCount: project.taskCount,
    createdAt: project.createdAt,
  }));
}

export async function getListOfProjects() {
  const res = await api.get<IResponse>("projects");

  return {
    ...res.data,
    toProjects: () => toProjects(res.data),
  };
}
