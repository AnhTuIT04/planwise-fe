import api from "@/lib/api";
import { IUser } from "@/types/user.type";
interface ResponseInviteProjectRequest {
  response: "ACCEPTED" | "DECLINED";
}
interface IResponse {
  message: string;
} 
export function responseInviteProjectApi(projectId: string, payload: ResponseInviteProjectRequest) {
  return api.safeExec<IResponse>(
    { method: "POST", url: `projects/${projectId}/members/response-invitation`, data: payload }
  );
}