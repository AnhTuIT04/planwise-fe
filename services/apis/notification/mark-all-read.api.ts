import api from "@/lib/api";

export async function markAllNotificationsReadApi(): Promise<{ message: string }> {
  const res = await api.patch<{ message: string }>("notifications/read-all");
  return res.data;
}
