import api from "@/lib/api";

interface IAvailablePermissionProjectResponse {
  data: IPermission[];
}
interface IPermission {
  permission: string;
  name: string;
  description: string;
}
function toAvailable(data: IAvailablePermissionProjectResponse): IPermission[] {
  return data.data;
}
export async function getAllAvailablePermissionProjectApi() {
  return await api.safeExec<IPermission[]>(
    {
      method: "GET",
      url: `permissions/project/available`,
    },
    toAvailable
  );
}