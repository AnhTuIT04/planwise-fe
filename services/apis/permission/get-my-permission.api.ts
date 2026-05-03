import api from "@/lib/api";

interface IMyPermissionProjectResponse {
  roleId: string;
  roleName: string;
  permissions: IPermission[];
}
interface IPermission {
  name: string;
  description: string;
  permission: string;
}

export async function getMyPermissionProjectApi(projectId: string) {
  return api.safeExec<IMyPermissionProjectResponse>(
    {
      method: "GET",
      url: `permissions/my-permissions/${projectId}`,
    }
  );
}