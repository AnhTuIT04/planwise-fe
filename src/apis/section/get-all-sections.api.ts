import api from "@/lib/api";
import { ISection } from "@/types/section.type";

interface IRequest {
  projectId: string;
  // page: number;
  // limit: number;
  // status?: "DONE" | "RUNNING" | "TODO" | "ARCHIVED";
  // search?: string;
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
        timeEstimate: number;
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
          timeEstimate: number;
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
  }[];
  message: string;
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

function toSessionList(data: IResponse): ISection[] {
  return data.data.map((section) => ({
    id: section.id,
    name: section.name,
    tasks: section.tasks,
    createdAt: section.createdAt,
  }));
}

export function getAllSectionsApi(params: IRequest) {
  return api.safeExec<ISection[]>(
    {
      method: "GET",
      url: "section",
      params,
    },
    toSessionList,
  );
}
