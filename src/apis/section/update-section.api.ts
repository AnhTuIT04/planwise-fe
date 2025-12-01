import api from "@/lib/api";
import { ISection } from "@/types/section.type";

interface IRequest {
  id: string;
  projectId: string;
  name?: string;
}

interface IResponse {
  data: {
    id: string;
    name: string;
    tasks: [
      {
        id: string;
        parentTaskId: string | null;
        title: string;
        description: string | null;
        status: "TODO" | "RUNNING" | "DONE" | "ARCHIVED";
        priority: "LOW" | "NORMAL" | "HIGH" | "URGENT" | null;
        estimate: number;
        timeSpent: number;
        lastStarted: string | null;
        deadline: string | null;
        supervisor: {
          id: string;
          email: string;
          fullname: string;
          avatarUrl: string | null;
        };
        assignees: {
          id: string;
          email: string;
          fullname: string;
          avatarUrl: string | null;
        }[];
        subtasks: {
          id: string;
          parentTaskId: string | null;
          title: string;
          description: string | null;
          status: "TODO" | "RUNNING" | "DONE" | "ARCHIVED";
          priority: "LOW" | "NORMAL" | "HIGH" | "URGENT" | null;
          estimate: number;
          timeSpent: number;
          lastStarted: string | null;
          deadline: string | null;
          supervisor: {
            id: string;
            email: string;
            fullname: string;
            avatarUrl: string | null;
          };
          assignees: {
            id: string;
            email: string;
            fullname: string;
            avatarUrl: string | null;
          }[];
          subtasks: [];
          createdAt: string;
          updatedAt: string;
        }[];
        createdAt: string;
        updatedAt: string;
      },
    ];
    createdAt: string;
  };
  message: string;
}

function toSection(data: IResponse): ISection {
  return {
    id: data.data.id,
    name: data.data.name,
    tasks: data.data.tasks,
    createdAt: data.data.createdAt,
  };
}

export function updateSectionApi({ id, ...payload }: IRequest) {
  return api.safeExec<ISection>(
    {
      method: "PATCH",
      url: `section/${id}`,
      data: payload,
    },
    toSection,
  );
}
