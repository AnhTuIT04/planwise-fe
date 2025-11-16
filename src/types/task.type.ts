import { IBasicUser } from "./user.type";

export interface ITask {
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
  supervisor: IBasicUser | null;
  assignees: IBasicUser[];
  subtasks: ITask[];
  createdAt: string;
  updatedAt: string;
}
