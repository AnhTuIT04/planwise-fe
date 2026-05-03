import api from "@/lib/api";

interface IRequest {
  response: "ACCEPTED" | "DECLINED";
}

interface IResponse {
  message: string;
}

export async function respondInvitationApi(projectId: string, response: IRequest["response"]) {
  const res = await api.post<IResponse>(`projects/${projectId}/members/response-invitation`, { response });
  return res.data;
}
