import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createSubtaskApi , CreateSubtaskRequest } from "@/apis/subtask/create-subtask.api";
import { deleteSubtaskApi } from "@/apis/subtask/delete-subtask.api";
import { UpdateSubtaskRequest, updateSubtaskApi } from "@/apis/subtask/update-subtask.api";
import { updateAssigneeIdSubtaskApi , updateAssigneeIdSubtaskRequest } from "@/apis/subtask/update-assigneeid-subtask.api";
import { updateStatusSubtaskApi, UpdateSubtaskStatusRequest } from "@/apis/subtask/update-status-subtask.api";

interface IUseTaskParams {
  taskId?: string;
  projectId?: string;
  sectionId?: string;
  parentTaskId?: string;
}

export function useSubtask(params?: IUseTaskParams) {
  const queryClient = useQueryClient();

  // Create subtask
  const createSubtask = useMutation({
    mutationFn: async (data: CreateSubtaskRequest) => {
      await createSubtaskApi(data);
    },
    onSuccess: (_, variables) => {
      // Invalidate all related queries to refresh UI
      queryClient.invalidateQueries({ queryKey: ["task", params?.taskId] });
      queryClient.invalidateQueries({ queryKey: ["project-detail"] });
      if (params?.projectId) {
        queryClient.invalidateQueries({ queryKey: ["projects", { projectId: params.projectId }] });
      }
      queryClient.invalidateQueries({ queryKey: ["projects", { personal: true }] });
      toast.success("Subtask created successfully");
    },
    onError: (error: any) => {
      toast.error(error.response.data.message || "Failed to create subtask");
    },
  });

  // Update subtask
  const updateSubtask = useMutation({
    mutationFn: async (data:{id: string, payload: UpdateSubtaskRequest}) => {
      await updateSubtaskApi(data.id, data.payload);
    },
    onSuccess: (_, variables) => {
      // Invalidate all related queries to refresh UI
      queryClient.invalidateQueries({ queryKey: ["task", params?.taskId] });
      queryClient.invalidateQueries({ queryKey: ["project-detail"] });
      if (params?.projectId) {
        queryClient.invalidateQueries({ queryKey: ["projects", { projectId: params.projectId }] });
      }
      queryClient.invalidateQueries({ queryKey: ["projects", { personal: true }] });
      toast.success("Subtask updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.response.data.message || "Failed to update subtask");
    },
  });

  // Update subtask status
  const updateSubtaskStatus = useMutation({
    mutationFn: async (data: {id: string, payload: UpdateSubtaskStatusRequest}) => {
      await updateStatusSubtaskApi(data.id, data.payload);
    },
    onSuccess: (_, variables) => {
      // Invalidate all related queries to refresh UI
      queryClient.invalidateQueries({ queryKey: ["task", params?.taskId] });
      queryClient.invalidateQueries({ queryKey: ["project-detail"] });
      if (params?.projectId) {
        queryClient.invalidateQueries({ queryKey: ["projects", { projectId: params.projectId }] });
      }
      queryClient.invalidateQueries({ queryKey: ["projects", { personal: true }] });
      toast.success("Subtask status updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.response.data.message || "Failed to update subtask status");
    },
  });

  // Delete subtask
  const deleteSubtask = useMutation({
    mutationFn: async (id: string) => {
      await deleteSubtaskApi(id);
    },
    onSuccess: (_, id) => {
      // Invalidate all related queries to refresh UI
      queryClient.invalidateQueries({ queryKey: ["task", params?.taskId] });
      queryClient.invalidateQueries({ queryKey: ["project-detail"] });
      if (params?.projectId) {
        queryClient.invalidateQueries({ queryKey: ["projects", { projectId: params.projectId }] });
      }
      queryClient.invalidateQueries({ queryKey: ["projects", { personal: true }] });
      toast.success("Subtask deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.response.data.message || "Failed to delete subtask");
    },
  });

  // Update subtask assigneeIds
  const updateSubtaskAssigneeIds = useMutation({
    mutationFn: async (data: { id: string, payload: updateAssigneeIdSubtaskRequest}) => {
      await updateAssigneeIdSubtaskApi(data.id, data.payload);
    },
    onSuccess: (_, variables) => {
      // Invalidate all related queries to refresh UI
      queryClient.invalidateQueries({ queryKey: ["task", params?.taskId] });
      queryClient.invalidateQueries({ queryKey: ["project-detail"] });
      if (params?.projectId) {
        queryClient.invalidateQueries({ queryKey: ["projects", { projectId: params.projectId }] });
      }
      queryClient.invalidateQueries({ queryKey: ["projects", { personal: true }] });
      toast.success("Subtask assignees updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.response.data.message || "Failed to update subtask assignees");
    },
  });

  return {
    createSubtask,
    updateSubtask,
    updateSubtaskStatus,
    deleteSubtask,
    updateSubtaskAssigneeIds,
  };
}   