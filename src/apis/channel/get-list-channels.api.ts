import api from "@/lib/api";

interface IResponse {
  data: {
    id: string;
    name: string;
    type: "TEXT" | "VOICE" | "VIDEO";
  }[];
  message: string;
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

export async function getListChannelsApi(projectId: string) {
  const res = await api.get<IResponse>("channel", {
    params: { projectId },
  });

  return {
    ...res.data,
    toChannelList: () =>
      res.data.data.map((channel) => ({
        id: channel.id,
        name: channel.name,
        type: channel.type,
      })),
  };
}
