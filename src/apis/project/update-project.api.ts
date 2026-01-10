import api from "@/lib/api";
import { IProject } from "@/types/project.type";

interface IRequest {
  id: string;
  name?: string;
  description?: string;
  logoUrl?: string;
  listOfSection?: string[];
}

interface IResponse {
  data: {
    id: string;
    owner: {
      id: string;
      email: string;
      fullname: string;
      avatarUrl: string | null;
    };
    members: {
      id: string;
      email: string;
      fullname: string;
      avatarUrl: string | null;
    }[];
    name: string;
    description: string | null;
    logoUrl: string | null;
    isPersonal: boolean;
    sections: {
      id: string;
      name: string;
      createdAt: string;
    }[];
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
    // members: data.data.members,
    memberCount: data.data.members.length,
    name: data.data.name,
    description: data.data.description,
    logoUrl: data.data.logoUrl,
    isPersonal: data.data.isPersonal,
    // sections: data.data.sections,
    sectionCount: data.data.sectionCount,
    taskCount: data.data.taskCount,
    createdAt: data.data.createdAt,
  };
}

export function updateProjectApi({ id, ...payload }: IRequest) {
  console.log("Updating project with id:", id, "and payload:", payload);
  return api.safeExec<IProject>(
    {
      method: "PATCH",
      url: `project/${id}`,
      data: payload,
    },
    toProject,
  );
}
