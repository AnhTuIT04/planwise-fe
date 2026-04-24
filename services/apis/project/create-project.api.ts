import api from "@/lib/api";

interface IRequest {
  name: string;
  description?: string;
  logoUrl?: string;
}

export async function createProjectApi(payload: IRequest) {
  const res = await api.post("projects", payload);

  return res.data;
}
