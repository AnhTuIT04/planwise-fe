import api from "@/lib/api";
import { IProject } from "@/types/project.type";
interface IResponse {
  data: IProject;
  message: string;
}
function toProject(data: IResponse): IProject {
  return data.data;
}
export function getDetailProjectApi(projectId: string) {
  return api.safeExec<IProject>({ method: "GET", url: `project/${projectId}` },toProject);
}