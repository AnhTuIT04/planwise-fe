import api from "@/lib/api";
import { IAdminProject, IAdminProjectDetail, IOffsetPagination } from "@/types/admin.type";

export interface IAdminProjectsParams {
  page?: number;
  limit?: number;
  q?: string;
}

interface IAdminProjectsResponse {
  data: IAdminProject[];
  pagination: IOffsetPagination;
  message: string;
}

interface IAdminProjectDetailResponse {
  data: IAdminProjectDetail;
  message: string;
}

export async function getAdminProjectsApi(params: IAdminProjectsParams = {}) {
  const res = await api.get<IAdminProjectsResponse>("admin/projects", { params });
  return res.data;
}

export async function getAdminProjectDetailApi(projectId: string) {
  const res = await api.get<IAdminProjectDetailResponse>(`admin/projects/${projectId}`);
  return res.data;
}
