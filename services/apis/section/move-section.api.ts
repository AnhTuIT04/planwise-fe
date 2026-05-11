import api from "@/lib/api";

interface IRequest {
  projectId: string;
  sectionId: string;
  moveTo: number;
}

export async function moveSectionApi({ sectionId, moveTo }: IRequest) {
  const res = await api.patch(`sections/${sectionId}/move`, { moveTo });

  return res.data;
}
