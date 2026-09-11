import api from "@/lib/api";
import { IComment } from "@/types/comment.type";

interface ICommentResponse {
  data: IComment;
  message: string;
}

interface ICommentsListResponse {
  data: IComment[];
  message: string;
}

export async function getTaskCommentsApi(taskId: string): Promise<IComment[]> {
  const res = await api.get<ICommentsListResponse>(`tasks/${taskId}/comments`);
  return res.data.data;
}

export async function createTaskCommentApi(
  taskId: string,
  payload: { content: string; parentId?: string }
): Promise<IComment> {
  const res = await api.post<ICommentResponse>(`tasks/${taskId}/comments`, payload);
  return res.data.data;
}

export async function deleteTaskCommentApi(taskId: string, commentId: string): Promise<void> {
  await api.delete(`tasks/${taskId}/comments/${commentId}`);
}
