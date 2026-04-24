import api from "@/lib/api";

interface IRequest {
  name: string;
  projectId: string;
  insertAt?: number;
}

interface IResponse {
  data: {
    id: string;
    name: string;
    taskCount: number;
    createdAt: string;
  };
  message: string;
}

export async function createSectionApi(payload: IRequest) {
  const res = await api.post<IResponse>("sections", payload);

  return res.data.data;
}
