import api from "@/lib/api";

interface IPermissionGroupResponse {
  project: IPermission[];
  task: IPermission[];
  subtask: IPermission[];
  section: IPermission[];
  comment: IPermission[];
}
interface IPermission {
  id: string;
  name: string;
  description: string;
}

export async function getPermissionGroupApi() {
  return api.safeExec<IPermissionGroupResponse>(
    {
      method: "GET",
      url: `permissions/groups`,
    }
  );
}