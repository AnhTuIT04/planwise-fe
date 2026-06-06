import api from "@/lib/api";
import { IAdminAccount } from "@/types/admin.type";

interface IAdminResponse {
  data: IAdminAccount;
  message: string;
}

export async function adminSignInApi(payload: { email: string; password: string }) {
  const res = await api.post<IAdminResponse>("admin/auth/signin", payload);
  return res.data;
}

export async function adminSignOutApi() {
  const res = await api.post<{ message: string }>("admin/auth/signout");
  return res.data;
}

export async function adminMeApi() {
  const res = await api.get<IAdminResponse>("admin/auth/me");
  return res.data;
}
