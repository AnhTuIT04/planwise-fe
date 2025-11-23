import api from "@/lib/api";
import { formatISO } from "date-fns";

export interface ImportTaskRequest {
  fromProjectId: string;
  toSectionId: string;
  insertAt: number;
}
export interface ImportTaskResponse {
  message: string;
}

// IMPORT
export function importTaskApi(
  id: string,
  payload: ImportTaskRequest
) {
  return api.safeExec<ImportTaskResponse>(
    {
      method: "POST",
      url: `task/${id}/import`,
      data: payload,
    }
  );
}