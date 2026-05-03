import api from "@/lib/api";
import { IUser } from "@/types/user.type";
interface InviteMemberProjectRequest {
  email: string;
  roleId: string;
}
interface IResponse {
  message: string;
}


export function inviteMemberProjectApi(projectId: string, payload: InviteMemberProjectRequest) {
  return api.safeExec<IResponse>(
    { method: "POST", url: `projects/${projectId}/members`, data: payload }
  );
}