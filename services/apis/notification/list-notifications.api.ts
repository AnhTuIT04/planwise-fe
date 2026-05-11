import api from "@/lib/api";
import { INotification, INotificationCategory } from "@/types/notification.type";

export interface IListNotificationsResponse {
  data: {
    items: INotification[];
    pagination: {
      page: number;
      limit: number;
      totalItems: number;
      totalPages: number;
    };
  };
  message: string;
}

export interface IListNotificationsParams {
  page?: number;
  limit?: number;
  category?: INotificationCategory;
  isRead?: boolean;
}

interface IRawResponse {
  data: INotification[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
  message: string;
}

export async function listNotificationsApi(
  params: IListNotificationsParams,
): Promise<IListNotificationsResponse> {
  const query: Record<string, string | number | boolean> = {
    page: params.page ?? 1,
    limit: params.limit ?? 20,
  };
  if (params.category && params.category !== "all") query.category = params.category;
  if (params.isRead !== undefined) query.isRead = params.isRead;

  const res = await api.get<IRawResponse>("notifications", { params: query });
  return {
    data: { items: res.data.data, pagination: res.data.pagination },
    message: res.data.message,
  };
}
