import api from "@/lib/api";
import { CreateSubtaskRequest } from "./create-subtask.api";

export interface updateAssigneeIdSubtaskRequest {
  assigneeIds: string[];
}

// UPDATE ASSIGNEE IDS
export async function updateAssigneeIdSubtaskApi(
  id: string,
  payload: updateAssigneeIdSubtaskRequest
): Promise<void> {
  try {
    await api.patch(`subtask/${id}/assignees`, {
      assigneeIds: payload.assigneeIds,
    });
  } catch (error: any) {
    console.error("updateAssigneeIdSubtaskApi error:", error);
    throw error;
  }
}   