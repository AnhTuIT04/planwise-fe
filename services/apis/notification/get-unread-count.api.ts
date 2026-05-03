import api from "@/lib/api";

interface IResponse {
  data: { count: number };
  message: string;
}

export async function getUnreadNotificationCountApi(): Promise<{ count: number }> {
  const res = await api.get<IResponse>("notifications/unread-count");
  return res.data.data;
}
