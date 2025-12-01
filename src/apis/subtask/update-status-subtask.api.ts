import api from "@/lib/api";
import { formatISO } from "date-fns";
export interface UpdateSubtaskStatusRequest {
  status: "TODO" | "RUNNING" | "DONE" | "ARCHIVED";
  sectionId: string;
}

// UPDATE STATUS
export async function updateStatusSubtaskApi(
  id: string,
  payload: UpdateSubtaskStatusRequest
): Promise<void> {
  try {
    await api.patch(`subtask/${id}/status`, payload);
  } catch (error: any) {
    console.error("updateStatusSubtaskApi error:", error);
    throw error;
  }
}