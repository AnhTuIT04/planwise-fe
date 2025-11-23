import api from "@/lib/api";
import { formatISO } from "date-fns";

export interface CreateSubtaskRequest {
  title: string;
  status?: "TODO" | "RUNNING" | "DONE" | "ARCHIVED";
  timeEstimate?: number;
  parentTaskId: string;
  assigneeIds?: string[];
}

// CREATE
export async function createSubtaskApi(
  payload: CreateSubtaskRequest
): Promise<void> {
  try {
    await api.post(`subtask`, payload);
  } catch (error: any) {
    console.error("createSubtaskApi error:", error);
    throw error;
  }
}