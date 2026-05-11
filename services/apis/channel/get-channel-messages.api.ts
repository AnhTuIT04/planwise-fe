import api from "@/lib/api";
import { IMessage } from "@/types/channel.type";

interface IResponse {
  data: IMessage[];
  nextCursor: string | null;
  message: string;
}

export async function getChannelMessagesApi(channelId: string, cursor: string | null, limit: number = 20) {
  const res = await api.get<IResponse>(`channel/${channelId}/messages`, {
    params: { cursor: cursor ? cursor : undefined, limit },
  });

  return { data: res.data.data, nextCursor: res.data.nextCursor };
}

export type GetChannelMessagesResponse = Awaited<ReturnType<typeof getChannelMessagesApi>>;
