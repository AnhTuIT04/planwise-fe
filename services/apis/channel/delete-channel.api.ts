import api from "@/lib/api";

interface IRequest {
  channelId: string;
  projectId: string;
}

interface IResponse {
  message: string;
}

export async function deleteChannelApi(payload: IRequest) {
  const res = await api.delete<IResponse>(`channel/${payload.channelId}`);
  return { ...res.data, channelId: payload.channelId, projectId: payload.projectId };
}
