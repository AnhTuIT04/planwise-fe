import api from "@/lib/api";
import { ISection } from "@/types/section.type";

interface IRequest {
  projectId: string;
}

interface IResponse {
  data: ISection[];
  message: string;
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}
// GET LIST PERSONAL SECTION
export function getListPersonalSectionApi(
  payload: IRequest
) {
  return api.safeExec<IResponse>(
    {
      method: "GET",
      url: `projects/${payload.projectId}/sections/personal`,
    }
  );
}