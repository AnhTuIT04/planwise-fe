import { produce, current } from "immer";
import { arrayMove } from "@dnd-kit/sortable";
import { InfiniteData, useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { ITask } from "@/types/task.type";
import { TaskQueryState } from "@/stores/task-query.store";
import { getSectionTasksApi, IGetSectionTasksResponse } from "@/services/apis/section/get-section-tasks.api";
import { createTaskApi } from "@/services/apis/task/create-task.api";
import { updateTaskApi } from "@/services/apis/task/update-task.api";
import { moveTaskApi } from "@/services/apis/task/move-task.api";
import { updateTaskStatusApi } from "@/services/apis/task/update-task-status.api";
import { deleteTaskApi } from "@/services/apis/task/delete-task.api";
import { assignTaskToUsersApi } from "@/services/apis/task/assign-task.api";
import { importTaskApi } from "@/services/apis/task/import-task.api";

interface IPageParams {
  page: number;
  limit: number;
}
type IData = IGetSectionTasksResponse["data"]["tasks"];
export type IUseTaskQueryKey = ["tasks", string, TaskQueryState];
export type IUseTaskQueryData = InfiniteData<IData, IPageParams>;

export function useTask(projectId: string, sectionId: string, params: TaskQueryState = {}) {
  const queryClient = useQueryClient();

  const tasksInfiniteQuery = useInfiniteQuery<IData, Error, IUseTaskQueryData, IUseTaskQueryKey, IPageParams>({
    queryKey: ["tasks", sectionId, params],
    initialPageParam: { page: 1, limit: 10 },
    queryFn: async ({ pageParam }) => {
      const data = await getSectionTasksApi(sectionId, {
        ...params,
        page: pageParam.page,
        limit: pageParam.limit,
      });
      return data.data.tasks;
    },
    getNextPageParam: (lastPage) => {
      const { page, limit, totalPages } = lastPage.pagination;
      if (page < totalPages) {
        return { page: page + 1, limit };
      }
      return undefined;
    },
    initialData: queryClient.getQueryData<IUseTaskQueryData>(["tasks", sectionId, params]),
    enabled: !!projectId && !!sectionId,
  });

  const tasksQuery = {
    data: tasksInfiniteQuery.data?.pages.flatMap((page) => page.data) || ([] as ITask[]),
    isLoading: tasksInfiniteQuery.isLoading,
    isError: tasksInfiniteQuery.isError,
    hasNextPage: tasksInfiniteQuery.hasNextPage,
    fetchNextPage: tasksInfiniteQuery.fetchNextPage,
    isFetchingNextPage: tasksInfiniteQuery.isFetchingNextPage,
  };

  return tasksQuery;
}

export function useTaskMutations() {
  const queryClient = useQueryClient();

  const createTaskMutation = useMutation({
    mutationFn: createTaskApi,
    onSuccess: (_, variable) => {
      queryClient.invalidateQueries({ queryKey: ["tasks", variable.sectionId] });
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: updateTaskApi,
    onSuccess: (data, variable) => {
      if (variable.deadline && variable.projectId) {
        queryClient.invalidateQueries({ queryKey: ["sections", variable.projectId] });
        queryClient.invalidateQueries({ queryKey: ["tasks", variable.sectionId] });
      }

      queryClient.setQueriesData<IUseTaskQueryData>({ queryKey: ["tasks", variable.sectionId] }, (old) =>
        produce(old, (draft) => {
          if (!draft) return;

          for (const page of draft.pages) {
            const index = page.data.findIndex((task) => task.id === data.id);
            if (index !== -1) {
              page.data[index] = data;
              break;
            }
          }
        }),
      );
    },
  });

  const moveTaskMutation = useMutation({
    mutationFn: moveTaskApi,
    onMutate: ({ taskId, fromSectionId, toSectionId, insertAt }) => {
      // Cancel in-flight refetches in background so optimistic state can apply immediately.
      queryClient.cancelQueries({ queryKey: ["tasks", fromSectionId] });
      queryClient.cancelQueries({ queryKey: ["tasks", toSectionId] });

      // Optimistically update to the new value, now Task already moved to same section (toSectionId)
      // by moveTaskOptimistic, so just update the position in the same section.
      queryClient.setQueriesData<IUseTaskQueryData>({ queryKey: ["tasks", toSectionId] }, (old) =>
        produce(old, (draft) => {
          if (!draft) return;

          const flattenedTasks = draft.pages.flatMap((page) => page.data);
          const oldIndex = flattenedTasks.findIndex((task) => task.id === taskId);
          if (oldIndex === -1 || insertAt < 0 || insertAt >= flattenedTasks.length) return;

          const reorderedTasks = arrayMove(flattenedTasks, oldIndex, insertAt);

          let cursor = 0;
          draft.pages.forEach((page) => {
            const size = page.data.length;
            page.data = reorderedTasks.slice(cursor, cursor + size);
            cursor += size;
          });
        }),
      );
    },
    onSuccess: (_, variable) => {
      queryClient.invalidateQueries({ queryKey: ["tasks", variable.fromSectionId] });
      if (variable.fromSectionId !== variable.toSectionId)
        queryClient.invalidateQueries({ queryKey: ["tasks", variable.toSectionId] });
    },
  });

  const moveTaskOptimistic = (taskId: string, fromSectionId: string, toSectionId: string, toPosition: number) => {
    if (fromSectionId === toSectionId) return false;

    queryClient.cancelQueries({ queryKey: ["tasks", fromSectionId] });
    queryClient.cancelQueries({ queryKey: ["tasks", toSectionId] });

    let movedTask: ITask | null = null;
    queryClient.setQueriesData<IUseTaskQueryData>({ queryKey: ["tasks", fromSectionId] }, (old) =>
      produce(old, (draft) => {
        if (!draft) return;

        for (const page of draft.pages) {
          const index = page.data.findIndex((task) => task.id === taskId);
          if (index !== -1) {
            movedTask = current(page.data[index]);
            page.data.splice(index, 1);
            break;
          }
        }
      }),
    );

    if (!movedTask) return false;

    queryClient.setQueriesData<IUseTaskQueryData>({ queryKey: ["tasks", toSectionId] }, (old) =>
      produce(old, (draft) => {
        if (!draft || draft.pages.length === 0) return;

        // Remove stale optimistic copy if this task was already inserted before.
        for (const page of draft.pages) {
          const existingIndex = page.data.findIndex((task) => task.id === taskId);
          if (existingIndex !== -1) {
            page.data.splice(existingIndex, 1);
            break;
          }
        }

        const totalTasks = draft.pages.reduce((acc, page) => acc + page.data.length, 0);
        const insertAt = Math.max(0, Math.min(toPosition, totalTasks));
        draft.pages[0].data.splice(insertAt, 0, movedTask!);
      }),
    );

    return true;
  };

  const updateTaskStatusMutation = useMutation({
    mutationFn: updateTaskStatusApi,
    onSuccess: (_, variable) => {
      queryClient.invalidateQueries({ queryKey: ["tasks", variable.sectionId] });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: deleteTaskApi,
    onSuccess: (_, variable) => {
      queryClient.invalidateQueries({ queryKey: ["tasks", variable.sectionId] });
    },
  });
  const importTaskMutation = useMutation({
    mutationFn: ({ taskId, payload }: { taskId: string; payload: any }) => importTaskApi(taskId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sections"] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const assignTaskToUsersMutation = useMutation({
    mutationFn: ({ taskId, assigneeIds }: { taskId: string; assigneeIds: string[] }) => assignTaskToUsersApi(taskId, assigneeIds),
    onSuccess: (_, variable) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["task", variable.taskId] });
    },
  });

  return {
    createTaskMutation,
    updateTaskMutation,
    moveTaskMutation,
    moveTaskOptimistic,
    updateTaskStatusMutation,
    deleteTaskMutation,
    importTaskMutation,
    assignTaskToUsersMutation,
  };
}
