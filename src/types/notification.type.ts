import { IBasicUser } from "./user.type";
import { IProject } from "./project.type";

export interface INotification {
  id: string;
  type: "TASK_OVERDUE" | "TASK_DUE_SOON" | "PROJECT_INVITATION" | "PROJECT_UPDATE" | "TASK_ASSIGNMENT";
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  user?: IBasicUser;
  project?: {
    id: string;
    name: string;
  };
  task?: {
    id: string;
    title: string;
    deadline?: string;
  };
  metadata?: {
    [key: string]: any;
  };
}

export interface ITaskOverdueNotification extends INotification {
  type: "TASK_OVERDUE";
  task: {
    id: string;
    title: string;
    deadline: string;
  };
  project: {
    id: string;
    name: string;
  };
}

export interface IProjectInvitationNotification extends INotification {
  type: "PROJECT_INVITATION";
  project: {
    id: string;
    name: string;
  };
  user: IBasicUser;
  metadata: {
    role: string;
    invitationId: string;
  };
}

export interface IProjectUpdateNotification extends INotification {
  type: "PROJECT_UPDATE";
  project: {
    id: string;
    name: string;
  };
  user: IBasicUser;
  metadata: {
    action: "joined" | "declined";
    role?: string;
  };
}
