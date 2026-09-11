import { IBasicUser } from "./user.type";

export interface IComment {
  id: string;
  content: string;
  mediaUrl?: string | null;
  author: IBasicUser;
  taskId: string;
  parentId?: string | null;
  replies: IComment[];
  createdAt: string;
  updatedAt: string;
}
