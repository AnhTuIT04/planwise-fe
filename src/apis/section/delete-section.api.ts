import api from "@/lib/api";

interface IRequest {
  id: string;
  projectId: string;
}

interface IResponse {
  message: string;
}

export function deleteSectionApi({ id, projectId }: IRequest) {
  console.log("Deleting section with id:", id, "from projectId:", projectId);
  return api.safeExec<IResponse>({
    method: "DELETE",
    url: `section/${id}`,
  });
}
