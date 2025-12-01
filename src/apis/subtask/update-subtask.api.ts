import api from "@/lib/api";
import { formatISO } from "date-fns";
export interface UpdateSubtaskRequest {
  title?: string;
  status?: "TODO" | "RUNNING" | "DONE" | "ARCHIVED";
  estimate?: number;
  parentTaskId?: string;
}

// UPDATE
export async function updateSubtaskApi(
  id: string,
  payload: UpdateSubtaskRequest
): Promise<void> {
  try {
    await api.patch(`subtask/${id}`, payload);
  } catch (error: any) {
    console.error("updateSubtaskApi error:", error);
    throw error;
  }
}