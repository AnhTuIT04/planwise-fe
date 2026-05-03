import api from "@/lib/api";

interface IRequest {
  name: string;
  description?: string;
  logoUrl?: string;
}

interface IResponse {
  data: {
    id: string;
    name: string;
    description: string | null;
    logoUrl: string | null;
    isPersonal: boolean;
    memberCount: number;
    sectionCount: number;
    taskCount: number;
    createdAt: string;
  };
  message: string;
}

export async function createProjectApi(payload: IRequest) {
  const res = await api.post<IResponse>("projects", payload);
  return res.data;
}
