import api from "@/lib/api";

interface IRequest {
  projectId: string;
  sectionId: string;
  taskId: string;
}

interface IResponse {
  message: string;
}

export async function deleteTaskApi({ taskId, projectId }: IRequest): Promise<string> {
  const res = await api.delete<IResponse>(`tasks/${taskId}`, {
    data: { projectId },
  });

  return res.data.message;
}
