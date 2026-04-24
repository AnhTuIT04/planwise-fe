import qs from "qs";

import api from "@/lib/api";
import { removeFalsy } from "@/lib/utils";
import { ITaskStatus, ITaskPriority } from "@/types/task.type";

interface IRequest {
  page?: number;
  limit?: number;
  deadlineFrom?: string;
  deadlineTo?: string;
  sections?: string[];
  statuses?: ITaskStatus[];
  priorities?: ITaskPriority[];
  q?: string;
}

export interface IGetProjectSectionsResponse {
  data: {
    id: string;
    name: string;
    taskCount: number;
    tasks: {
      data: {
        id: string;
        title: string;
        description: string | null;
        status: "TODO" | "RUNNING" | "DONE" | "ARCHIVED";
        priority: "LOW" | "NORMAL" | "HIGH" | "URGENT";
        estimate: number;
        spent: number;
        lastStarted: string | null;
        deadline: string | null;
        originalProject: {
          id: string;
          name: string;
          description: string | null;
          logoUrl: string | null;
          createdAt: string;
        } | null;
        canImport: boolean;
        isImported: boolean;
        supervisor: {
          id: string;
          email: string;
          fullname: string;
          avatarUrl: string | null;
        } | null;
        assignees: {
          id: string;
          email: string;
          fullname: string;
          avatarUrl: string | null;
        }[];
        subtasks: {
          id: string;
          title: string;
          status: "TODO" | "RUNNING" | "DONE" | "ARCHIVED";
          estimate: number;
          spent: number;
          lastStarted: string | null;
          assignees: {
            id: string;
            email: string;
            fullname: string;
            avatarUrl: string | null;
          }[];
          createdAt: string;
          updatedAt: string;
        }[];
        createdAt: string;
        updatedAt: string;
      }[];
      pagination: {
        page: number;
        limit: number;
        totalItems: number;
        totalPages: number;
      };
    };
    createdAt: string;
  }[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

export async function getProjectSectionsApi(projectId: string, params?: IRequest) {
  const res = await api.get<IGetProjectSectionsResponse>(`projects/${projectId}/tasks`, {
    params: removeFalsy(params),
    paramsSerializer: (params) => qs.stringify(params, { arrayFormat: "repeat" }),
  });

  return res.data;
}
