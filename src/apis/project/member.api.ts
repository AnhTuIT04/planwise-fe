import api from "@/lib/api";
import { IUserInProject } from "@/types/user.type";

interface UpdateMemberRoleRequest {
  roleId: string;
}

interface IResponse {
  message: string;
}

interface IMemberResponse {
  data: IUserInProject;
  message: string;
}

function toMember(data: IMemberResponse): IUserInProject {
  return data.data;
}

// Update member role
export function updateMemberRoleApi(projectId: string, memberId: string, payload: UpdateMemberRoleRequest) {
  return api.safeExec<IUserInProject>(
    { method: "PATCH", url: `project/${projectId}/members/${memberId}`, data: payload },
    toMember
  );
}

// Remove member from project
export function removeMemberApi(projectId: string, memberId: string) {
  return api.safeExec<IResponse>(
    { method: "DELETE", url: `project/${projectId}/members/${memberId}` }
  );
}
