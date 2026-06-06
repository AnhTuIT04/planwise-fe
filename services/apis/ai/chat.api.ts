import api from "@/lib/api";

interface IChatRequest {
  projectId: string;
  message: string;
}

export interface ISuggestedTask {
  title: string;
  description?: string;
  priority?: "LOW" | "NORMAL" | "HIGH" | "URGENT";
  estimate?: number;
  subtasks?: {
    title: string;
    estimate?: number;
  }[];
}

export interface ISuggestedSection {
  tempKey: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  position?: number;
}

export interface IAssignmentSuggestion {
  taskId: string;
  taskTitle: string;
  suggestedUserId: string;
  suggestedUserName: string;
  reason: string;
}

export interface ISuggestedAction {
  type: "UPDATE_STATUS" | "UPDATE_PRIORITY" | "DELETE";
  taskId: string;
  taskTitle: string;
  value?: string;
}

export interface IChatResponse {
  response: string;
  suggestedTasks?: ISuggestedTask[];
  suggestedSections?: ISuggestedSection[];
  prioritizedTaskIds?: string[];
  suggestedActions?: ISuggestedAction[];
  assignmentSuggestions?: IAssignmentSuggestion[];
  unassignedTaskIds?: string[];
}

export async function chatApi(payload: IChatRequest): Promise<IChatResponse> {
  const res = await api.post<IChatResponse>("ai/chat", payload, {
    timeout: 30000, // 30 seconds timeout for AI generation
  });
  return res.data;
}

