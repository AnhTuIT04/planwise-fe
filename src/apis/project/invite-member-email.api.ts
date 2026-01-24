import api from "@/lib/api";
import { IUser } from "@/types/user.type";
interface InviteMemberEmailProjectRequest {
  email: string;
  roleId: string;
  projectName: string;
  inviterName: string;
}
interface IResponse {
  message: string;
}


export function inviteMemberEmailProjectApi(projectId: string, payload: InviteMemberEmailProjectRequest) {
  return api.safeExec<IResponse>(
    { method: "POST", url: `project/${projectId}/invite`, data: payload }
  );
}