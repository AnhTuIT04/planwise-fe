import { produce } from "immer";
import { arrayMove } from "@dnd-kit/sortable";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { IUseTaskQueryData } from "@/hooks/use-task";
import { useTaskModalStore } from "@/stores/task-modal.store";
import { createSubtaskApi } from "@/services/apis/subtask/create-subtask.api";
import { updateSubtaskApi } from "@/services/apis/subtask/update-subtask.api";
import { updateSubtaskStatusApi } from "@/services/apis/subtask/update-subtask-status.api";
import { moveSubtaskApi } from "@/services/apis/subtask/move-subtask.api";
import { deleteSubtaskApi } from "@/services/apis/subtask/delete-subtask.api";

export function useSubtaskMutations(sectionId: string, taskId: string) {
  const queryClient = useQueryClient();

  const createSubtaskMutation = useMutation({
    mutationFn: createSubtaskApi,
    onSuccess: async (data) => {
      queryClient.setQueriesData<IUseTaskQueryData>({ queryKey: ["tasks", sectionId] }, (old) =>
        produce(old, (draft) => {
          if (!draft) return;

          for (const page of draft.pages) {
            const index = page.data.findIndex((task) => task.id === taskId);
            if (index !== -1) {
              page.data[index] = data;
              break;
            }
          }
        }),
      );
    },
  });

  const updateSubtaskMutation = useMutation({
    mutationFn: updateSubtaskApi,
    onSuccess: async (data) => {
      queryClient.setQueriesData<IUseTaskQueryData>({ queryKey: ["tasks", sectionId] }, (old) =>
        produce(old, (draft) => {
          if (!draft) return;

          for (const page of draft.pages) {
            const index = page.data.findIndex((task) => task.id === taskId);
            if (index !== -1) {
              page.data[index] = data;
              break;
            }
          }
        }),
      );
    },
  });

  const updateSubtaskStatusMutation = useMutation({
    mutationFn: updateSubtaskStatusApi,
    onSuccess: async (data) => {
      queryClient.setQueriesData<IUseTaskQueryData>({ queryKey: ["tasks", sectionId] }, (old) =>
        produce(old, (draft) => {
          if (!draft) return;

          for (const page of draft.pages) {
            const index = page.data.findIndex((task) => task.id === taskId);
            if (index !== -1) {
              page.data[index] = data;
              break;
            }
          }
        }),
      );
    },
  });

  const moveSubtaskMutation = useMutation({
    mutationFn: moveSubtaskApi,
    onMutate: ({ subtaskId, moveTo }) => {
      // Snapshot the previous value
      const previousData = queryClient.getQueryData<IUseTaskQueryData>(["tasks", sectionId]);
      const previousTask = useTaskModalStore.getState().task;
      const subtaskIndex = previousTask.subtasks.findIndex((subtask) => subtask.id === subtaskId);

      if (subtaskIndex === -1 || moveTo < 0 || moveTo >= previousTask.subtasks.length) {
        return { previousData, previousTask };
      }

      const nextSubtasks = arrayMove(previousTask.subtasks, subtaskIndex, moveTo);

      // Optimistically update to the new value
      queryClient.setQueriesData<IUseTaskQueryData>({ queryKey: ["tasks", sectionId] }, (old) =>
        produce(old, (draft) => {
          if (!draft) return;

          for (const page of draft.pages) {
            const taskIndex = page.data.findIndex((task) => task.id === taskId);
            if (taskIndex !== -1) {
              page.data[taskIndex].subtasks = nextSubtasks;
              break;
            }
          }
        }),
      );

      useTaskModalStore.getState().setModalData({ subtasks: nextSubtasks });

      // Return a context object with the snapshotted value
      return { previousData, previousTask };
    },
    onSuccess: async (data) => {
      queryClient.setQueriesData<IUseTaskQueryData>({ queryKey: ["tasks", sectionId] }, (old) =>
        produce(old, (draft) => {
          if (!draft) return;

          for (const page of draft.pages) {
            const index = page.data.findIndex((task) => task.id === taskId);
            if (index !== -1) {
              page.data[index] = data;
              break;
            }
          }
        }),
      );
    },
    onError: (_, __, context) => {
      if (context?.previousData) {
        queryClient.setQueriesData({ queryKey: ["tasks", sectionId] }, context.previousData);
      }

      if (context?.previousTask) {
        useTaskModalStore.getState().setModalData(context.previousTask);
      }
    },
  });

  const deleteSubtaskMutation = useMutation({
    mutationFn: deleteSubtaskApi,
    onSuccess: async (data) => {
      queryClient.setQueriesData<IUseTaskQueryData>({ queryKey: ["tasks", sectionId] }, (old) =>
        produce(old, (draft) => {
          if (!draft) return;

          for (const page of draft.pages) {
            const index = page.data.findIndex((task) => task.id === taskId);
            if (index !== -1) {
              page.data[index] = data;
              break;
            }
          }
        }),
      );
    },
  });

  return {
    createSubtaskMutation,
    updateSubtaskMutation,
    updateSubtaskStatusMutation,
    moveSubtaskMutation,
    deleteSubtaskMutation,
  };
}
