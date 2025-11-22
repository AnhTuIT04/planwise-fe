import api from "@/lib/api";
import { IProject } from "@/types/project.type";

export interface CreateProjectRequest {
  name: string;
  description?: string;
  logoUrl?: string;
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


export function createProjectApi(payload: CreateProjectRequest) {
  return api.safeExec<IProject>(
    {
      method: "POST",
      url: "project",
      data: payload,
    }
  );
}
