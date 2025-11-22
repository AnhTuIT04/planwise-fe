import api from "@/lib/api";
import { ISection } from "@/types/section.type";

export interface MoveTaskRequest {
  fromSectionId: string;
  toSectionId: string;
  insertAt?: number;
}

interface IMoveTaskResponse {
  message: string;
}

export function moveTaskApi(
  id: string,
  payload: MoveTaskRequest
) {
  return api.safeExec<IMoveTaskResponse>(
    {
      method: "PATCH",
      url: `task/${id}/move`,
      data: payload,
    }
  );
}  