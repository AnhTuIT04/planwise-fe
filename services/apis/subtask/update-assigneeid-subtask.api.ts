import api from "@/lib/api";


export interface updateAssigneeIdSubtaskRequest {
  assigneeIds: string[];
}

// UPDATE ASSIGNEE IDS
export async function updateAssigneeIdSubtaskApi(
  id: string,
  payload: updateAssigneeIdSubtaskRequest
): Promise<void> {
  try {
    await api.patch(`subtasks/${id}/assignees`, {
      assigneeIds: payload.assigneeIds,
    });
  } catch (error: any) {
    console.error("updateAssigneeIdSubtaskApi error:", error);
    throw error;
  }
}   