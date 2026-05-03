import api from "@/lib/api";

export async function markNotificationReadApi(id: string): Promise<{ message: string }> {
  const res = await api.patch<{ message: string }>(`notifications/${id}/read`);
  return res.data;
}
