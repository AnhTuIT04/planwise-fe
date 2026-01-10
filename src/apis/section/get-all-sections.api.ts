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
    tasks: section.tasks.map((task) => ({
      id: task.id,
      parentTaskId: task.parentTaskId,
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      estimate: task.estimate,
      spent: task.timeSpent,
      lastStarted: task.lastStarted,
      deadline: task.deadline,
      supervisor: task.supervisor,
      assignees: task.assignees,
      subtasks: task.subtasks.map((subtask) => ({
        id: subtask.id,
        parentTaskId: subtask.parentTaskId,
        title: subtask.title,
        description: subtask.description,
        status: subtask.status,
        priority: subtask.priority,
        estimate: subtask.estimate,
        spent: subtask.timeSpent,
        lastStarted: subtask.lastStarted,
        deadline: subtask.deadline,
        supervisor: subtask.supervisor,
        assignees: subtask.assignees,
        subtasks: [],
        createdAt: subtask.createdAt,
        updatedAt: subtask.updatedAt,
      })),
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    })),
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
