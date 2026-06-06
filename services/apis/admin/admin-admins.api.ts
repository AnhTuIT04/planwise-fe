import api from "@/lib/api";
import { IAdminAccount, IAdminListItem } from "@/types/admin.type";

interface IAdminsResponse {
  data: IAdminListItem[];
  message: string;
}

interface ICreateAdminResponse {
  data: IAdminAccount;
  message: string;
}

export async function getAdminsApi() {
  const res = await api.get<IAdminsResponse>("admin/admins");
  return res.data;
}

export async function createAdminApi(payload: { email: string; password: string; fullname?: string }) {
  const res = await api.post<ICreateAdminResponse>("admin/admins", payload);
  return res.data;
}
