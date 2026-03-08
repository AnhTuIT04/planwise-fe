import api from "@/lib/api";

interface IRequest {
  projectId: string;
  name: string;
  type: "TEXT" | "VOICE" | "VIDEO";
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

export async function createChannelApi(payload: IRequest) {
  const res = await api.post<IResponse>("channel", payload);
  return res.data;
}
