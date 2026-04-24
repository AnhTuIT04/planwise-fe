import api from "@/lib/api";

interface IRequest {
  projectId: string;
  sectionId: string;
  name: string;
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

export async function updateSectionApi({ sectionId, name }: IRequest) {
  const res = await api.patch<IResponse>(`sections/${sectionId}`, { name });

  return res.data.data;
}
