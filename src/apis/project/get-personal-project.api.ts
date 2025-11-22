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
  return data.data;
}

export function getPersonalProjectApi() {
  return api.safeExec<IProject>({ method: "GET", url: "project/personal" }, toProject);
}

export function getProjectByIdApi(projectId: string) {
  return api.safeExec<IProject>({ method: "GET", url: `project/${projectId}` }, toProject);
}
