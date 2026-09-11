import api from "@/lib/api";
import { IAdminStats } from "@/types/admin.type";

interface IAdminStatsResponse {
  data: IAdminStats;
  message: string;
}

export async function getAdminStatsApi() {
  const res = await api.get<IAdminStatsResponse>("admin/stats");
  return res.data;
}
