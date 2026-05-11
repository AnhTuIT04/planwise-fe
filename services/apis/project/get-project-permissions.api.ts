import api from "@/lib/api";

export interface IProjectPermission {
  permission: string;
  name: string;
  description: string;
}

interface IResponse {
  data: IProjectPermission[];
  message: string;
}

export function getProjectPermissionsApi() {
  return api.safeExec<IProjectPermission[]>(
    { method: "GET", url: "projects/permissions" },
    (d: IResponse) => d.data,
  );
}
