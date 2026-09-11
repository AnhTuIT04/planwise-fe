import api from "@/lib/api";
import { IAdminUser, IAdminUserDetail, IOffsetPagination } from "@/types/admin.type";

export interface IAdminUsersParams {
  page?: number;
  limit?: number;
  q?: string;
  status?: "all" | "active" | "disabled";
}

interface IAdminUsersResponse {
  data: IAdminUser[];
  pagination: IOffsetPagination;
  message: string;
}

interface IAdminUserDetailResponse {
  data: IAdminUserDetail;
  message: string;
}

export async function getAdminUsersApi(params: IAdminUsersParams = {}) {
  const res = await api.get<IAdminUsersResponse>("admin/users", { params });
  return res.data;
}

export async function getAdminUserDetailApi(userId: string) {
  const res = await api.get<IAdminUserDetailResponse>(`admin/users/${userId}`);
  return res.data;
}

export async function disableUserApi(userId: string) {
  const res = await api.patch<{ message: string }>(`admin/users/${userId}/disable`);
  return res.data;
}

export async function enableUserApi(userId: string) {
  const res = await api.patch<{ message: string }>(`admin/users/${userId}/enable`);
  return res.data;
}
