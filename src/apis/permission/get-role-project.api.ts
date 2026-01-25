import api from "@/lib/api";
import { IRole } from "@/types/role.type";
// interface IRole {
//   id: string;
//   name: string;
//   default: boolean;
//   permissions: string[];
// }


export async function getRoleProjectApi(projectId: string) {
  const res = await api.safeExec<IRole[]>(
    {
      method: "GET",
      url: `permissions/roles/${projectId}`,
    }
  );
  console.log("getRoleProjectApi res", res);
  return res;
}