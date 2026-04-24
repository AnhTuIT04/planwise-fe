import api from "@/lib/api";

interface IRequest {
  projectId: string;
  sectionId: string;
}

interface IResponse {
  message: string;
}

export async function deleteSectionApi({ sectionId }: IRequest) {
  const res = await api.delete<IResponse>(`sections/${sectionId}`);

  return res.data;
}
