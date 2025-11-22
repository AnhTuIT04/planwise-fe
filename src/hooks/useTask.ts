import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  createTaskApi,
  updateTaskApi,
  deleteTaskApi,
  getTaskDetailApi,
  CreateTaskRequest,
  UpdateTaskRequest,
  TaskResponse,
  updateTaskStatusApi,
} from "@/apis/task/task.api";

interface IUseTaskParams {
  taskId?: string;
  projectId?: string;
  sectionId?: string;
}

interface UpdateTaskStatusRequest {
  status: "TODO" | "RUNNING" | "DONE" | "ARCHIVED";
}

export function useTask(params?: IUseTaskParams) {
  const queryClient = useQueryClient();

  // Get task detail
  // const {
  //   data: task,
  //   isLoading,
  //   error,
  //   refetch,
  // } = useQuery<TaskResponse>({
  //   queryKey: ["task", params?.taskId],
  //   queryFn: async () => {
  //     const response = await getTaskDetailApi(params!.taskId!);
  //     return response.task;
  //   },
  //   enabled: !!params?.taskId,
  // });

  // Create task
  const createTask = useMutation({
    mutationFn: async (data: CreateTaskRequest) => {
      const response = await createTaskApi(data);
      return response.task;
    },
    onSuccess: (_, variables) => {
      // Invalidate sections query to refresh task list
      queryClient.invalidateQueries({ queryKey: ["sections", variables.projectId] });
      toast.success("Task created successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create task");
    },
  });

  // Update task
  const updateTask = useMutation({
    mutationFn: async (data: { id: string; payload: UpdateTaskRequest; isPersonal?: boolean }) => {
      const response = await updateTaskApi(data.id, data.payload, data.isPersonal);
      return response.task;
    },
    onSuccess: (_, variables) => {
      // Invalidate task detail
      queryClient.invalidateQueries({ queryKey: ["task", variables.id] });
      // Invalidate sections to refresh list
      if (variables.payload.projectId) {
        queryClient.invalidateQueries({ queryKey: ["sections", variables.payload.projectId] });
      }
      toast.success("Task updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update task");
    },
  });

  // Delete task
  const deleteTask = useMutation({
    mutationFn: async (data: { id: string; projectId: string; isPersonal?: boolean }) => {
      // await deleteTaskApi(data.id, data.projectId, data.isPersonal);
      return data;
    },
    onSuccess: (data) => {
      // Invalidate sections to refresh list
      queryClient.invalidateQueries({ queryKey: ["sections", data.projectId] });
      toast.success("Task deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete task");
    },
  });

  const updateTaskStatus = useMutation({
    mutationFn: async (data: { id: string; payload: UpdateTaskStatusRequest }) => {
      const response = await updateTaskStatusApi(data.id, data.payload);
      return response.task;
    },
    onSuccess: (_, variables) => {
      // Invalidate task detail
      queryClient.invalidateQueries({ queryKey: ["task", variables.id] });
      // Invalidate sections to refresh list
      toast.success("Task status updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update task status");
    },
  });

  return {
    // Task detail
    // task,
    // isLoading,
    // error,
    // refetch,

    // Create task
    createTask: createTask.mutateAsync,
    isCreatingTask: createTask.isPending,
    createTaskError: createTask.error,

    // Update task
    updateTask: updateTask.mutateAsync,
    isUpdatingTask: updateTask.isPending,
    updateTaskError: updateTask.error,

    // Delete task
    deleteTask: deleteTask.mutateAsync,
    isDeletingTask: deleteTask.isPending,
    deleteTaskError: deleteTask.error,

    // Update task status
    updateTaskStatus: updateTaskStatus.mutateAsync,
    isUpdatingTaskStatus: updateTaskStatus.isPending,
    updateTaskStatusError: updateTaskStatus.error,
  };
}
