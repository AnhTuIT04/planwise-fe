import api from "@/lib/api";

interface IRequest {
  projectId: string;
}

interface IResponse {
  message: string;
}

export async function deleteProjectApi({ projectId }: IRequest) {
  const res = await api.delete<IResponse>(`projects/${projectId}`);

  return res.data;
}
