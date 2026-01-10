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
  assignTaskToUsersApi,
} from "@/apis/task/task.api";
import { importTaskApi, ImportTaskRequest } from "@/apis/task/import-task.api";
import { MoveTaskRequest, moveTaskApi } from "@/apis/task/move-task.api";
interface IUseTaskParams {
  taskId?: string;
  projectId?: string;
  sectionId?: string;
}

interface UpdateTaskStatusRequest {
  status: "TODO" | "RUNNING" | "DONE" | "ARCHIVED";
  sectionId: string;
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
      return { task: response.task, sectionId: data.sectionId };
    },
    onSuccess: (data, variables) => {
      // Invalidate all related queries to refresh UI
      queryClient.invalidateQueries({ queryKey: ["sections"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project-detail"] });
      queryClient.invalidateQueries({ queryKey: ["projects", { personal: true }] });
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
      // Invalidate all related queries to refresh UI
      queryClient.invalidateQueries({ queryKey: ["task", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["sections"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project-detail"] });
      queryClient.invalidateQueries({ queryKey: ["projects", { personal: true }] });
      toast.success("Task updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update task");
    },
  });

  // Delete task
  const deleteTask = useMutation({
    mutationFn: async (data: { id: string; projectId: string; isPersonal?: boolean }) => {
      await deleteTaskApi(data.id, { projectId: data.projectId });
      return data;
    },
    onSuccess: (data) => {
      // Invalidate all related queries to refresh UI
      queryClient.invalidateQueries({ queryKey: ["sections"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project-detail"] });
      queryClient.invalidateQueries({ queryKey: ["projects", { personal: true }] });
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
      // Invalidate task detail and refresh project view
      queryClient.invalidateQueries({ queryKey: ["task", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project-detail"] });
      toast.success("Task status updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update task status");
    },
  });
  const moveTask = useMutation({
    mutationFn: async (data: { id: string; payload: MoveTaskRequest }) => {
      const response = await moveTaskApi(data.id, data.payload);
      return response;
    },
    onSuccess: (_, variables) => {
      // Invalidate task detail and refresh project view
      queryClient.invalidateQueries({ queryKey: ["task", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project-detail"] });
      // toast.success("Task moved successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to move task");
    },
  });

  const assignTaskToUser = useMutation({
    mutationFn: async (data: { id: string; userIds: string[]; projectId?: string }) => {
      const response = await assignTaskToUsersApi(data.id, data.userIds);
      return { task: response.task, projectId: data.projectId };
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["task", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project-detail"] });
      queryClient.invalidateQueries({ queryKey: ["projects", { personal: true }] });
      toast.success("Task assignments updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update task assignments");
    },
  });

  const importTask = useMutation({
    mutationFn: async (data: { id: string; payload: ImportTaskRequest }) => {
      const response = await importTaskApi(data.id, data.payload);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project-detail"] });
      toast.success("Task imported successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to import task");
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

    // Move task
    moveTask: moveTask.mutateAsync,
    isMovingTask: moveTask.isPending,
    moveTaskError: moveTask.error,

    // Assign task to users
    assignTaskToUsers: assignTaskToUser.mutateAsync,
    isAssigningTaskToUsers: assignTaskToUser.isPending,
    assignTaskToUsersError: assignTaskToUser.error,

    // Import task
    importTask: importTask.mutateAsync,
    isImportingTask: importTask.isPending,
    importTaskError: importTask.error,
  };
}
