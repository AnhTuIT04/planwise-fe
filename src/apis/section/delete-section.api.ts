import api from "@/lib/api";

interface IRequest {
  id: string;
  projectId: string;
}

interface IResponse {
  message: string;
}

export function deleteSectionApi({ id, projectId }: IRequest) {
  return api.safeExec<IResponse>({
    method: "DELETE",
    url: `section/${id}?projectId=${projectId}`,
  });
}
