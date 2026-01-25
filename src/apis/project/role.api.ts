import api from "@/lib/api";
import { IRole } from "@/types/role.type";

interface CreateRoleRequest {
  name: string;
  permissions: string[];
  projectId: string;
}

interface UpdateRoleRequest {
  name?: string;
  permissions?: string[];
}

interface IRoleResponse {
  data: IRole;
  message: string;
}

interface IResponse {
  message: string;
}

function toRole(data: IRoleResponse): IRole {
  return data.data;
}

// Create role
export function createRoleApi(payload: CreateRoleRequest) {
  return api.safeExec<IRole>(
    { method: "POST", url: `role`, data: payload },
    toRole
  );
}

// Update role
export function updateRoleApi(roleId: string, payload: UpdateRoleRequest) {
  return api.safeExec<IRole>(
    { method: "PATCH", url: `role/${roleId}`, data: payload },
    toRole
  );
}

// Delete role
export function deleteRoleApi(roleId: string) {
  return api.safeExec<IResponse>(
    { method: "DELETE", url: `role/${roleId}` }
  );
}
