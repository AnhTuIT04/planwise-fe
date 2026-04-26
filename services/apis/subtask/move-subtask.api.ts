import api from "@/lib/api";
import { ITask } from "@/types/task.type";

interface IRequest {
  sectionId: string;
  parentTaskId: string;
  subtaskId: string;
  moveTo: number;
}

interface IResponse {
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
  };
  message: string;
}

export async function moveSubtaskApi({ subtaskId, moveTo }: IRequest): Promise<ITask> {
  const res = await api.patch<IResponse>(`subtasks/${subtaskId}/move`, { moveTo });

  return res.data.data;
}
