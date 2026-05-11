import api from "@/lib/api";

interface IRequest {
  projectId: string;
  name?: string;
  description?: string;
  logoUrl?: string;
  listOfSection?: string[];
}

export async function updateProjectApi({ projectId, ...payload }: IRequest) {
  const res = await api.patch(`projects/${projectId}`, payload);

  return res.data;
}
