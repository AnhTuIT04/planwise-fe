import { IBasicUser } from "./user.type";
import { IBasicProject } from "./project.type";

export type ITaskStatus = "TODO" | "RUNNING" | "DONE" | "ARCHIVED";
export type ITaskPriority = "LOW" | "NORMAL" | "HIGH" | "URGENT";

export interface ITask {
  id: string;
  title: string;
  description: string | null;
  status: ITaskStatus;
  priority: ITaskPriority;
  estimate: number;
  spent: number;
  lastStarted: string | null;
  deadline: string | null;
  supervisor: IBasicUser | null;
  assignees: IBasicUser[];
  subtasks: ISubtask[];
  canImport: boolean;
  isImported: boolean;
  originalProject: IBasicProject | null;
  notionPageId?: string | null;
  gmailMessageId?: string | null;
  calendarEventId?: string | null;
  gmailBodyHtml?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ISubtask {
  id: string;
  title: string;
  status: ITaskStatus;
  estimate: number;
  spent: number;
  lastStarted: string | null;
  assignees: IBasicUser[];
  createdAt: string;
  updatedAt: string;
}
