import { IBasicUser } from "./user.type";
import { IBasicProject } from "./project.type";
export interface ITask {
  id: string;
  parentTaskId: string | null;
  title: string;
  description: string | null;
  status: "TODO" | "RUNNING" | "DONE" | "ARCHIVED";
  priority: "LOW" | "NORMAL" | "HIGH" | "URGENT" | null;
  estimate: number;
  spent: number;
  lastStarted: string | null;
  deadline: string | null;
  supervisor: IBasicUser | null;
  assignees: IBasicUser[];
  subtasks: ITask[];
  createdAt: string;
  updatedAt: string;
  originalProject?: IBasicProject | null;
  canImport?: boolean;
  isImported?: boolean;
  platForm?: string;
  notionPageId?: string | null;
  notionDatabaseId?: string | null;
}
