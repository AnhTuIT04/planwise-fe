import api from "@/lib/api";

interface IRequest {
  email: string;
  roleId?: string;
}

interface IResponse {
  message: string;
}

export async function inviteMemberApi(projectId: string, payload: IRequest) {
  const res = await api.post<IResponse>(`projects/${projectId}/members`, payload);

  return res.data;
}
