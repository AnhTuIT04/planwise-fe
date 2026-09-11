import api from "@/lib/api";

interface IRequest {
  channelId: string;
  name: string;
}

interface IResponse {
  data: {
    id: string;
    name: string;
    type: "TEXT" | "VOICE" | "VIDEO";
    projectId: string;
  };
  message: string;
}

export async function updateChannelApi(payload: IRequest) {
  const res = await api.patch<IResponse>(`channel/${payload.channelId}`, { name: payload.name });
  return res.data;
}
