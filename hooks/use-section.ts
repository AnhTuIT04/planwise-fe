import { produce } from "immer";
import { arrayMove } from "@dnd-kit/sortable";
import { InfiniteData, useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { TaskQueryState } from "@/stores/task-query.store";
import { getProjectSectionsApi, IGetProjectSectionsResponse } from "@/services/apis/project/get-project-sections.api";
import { createSectionApi } from "@/services/apis/section/create-section.api";
import { updateSectionApi } from "@/services/apis/section/update-section.api";
import { moveSectionApi } from "@/services/apis/section/move-section.api";
import { deleteSectionApi } from "@/services/apis/section/delete-section.api";

interface IPageParams {
  page: number;
  limit: number;
}
type IData = IGetProjectSectionsResponse;
type IQueryKey = ["sections", string, TaskQueryState];
type IQueryData = InfiniteData<IData, IPageParams>;

export function useSection(projectId: string, params: TaskQueryState = {}) {
  const queryClient = useQueryClient();

  const sectionsInfiniteQuery = useInfiniteQuery<IData, Error, IQueryData, IQueryKey, IPageParams>({
    queryKey: ["sections", projectId, params],
    initialPageParam: { page: 1, limit: 10 },
    queryFn: async ({ pageParam }) => {
      const data = await getProjectSectionsApi(projectId, {
        ...params,
        page: pageParam.page,
        limit: pageParam.limit,
      });

      for (const section of data.data) {
        queryClient.setQueryData(["tasks", section.id, params], {
          pages: [section.tasks],
          pageParams: [{ page: 1, limit: 10 }],
        });
      }

      return data;
    },
    getNextPageParam: (lastPage) => {
      const { page, limit, totalPages } = lastPage.pagination;
      if (page < totalPages) {
        return { page: page + 1, limit };
      }
      return undefined;
    },
    enabled: !!projectId,
  });

  const sectionsQuery = {
    data: sectionsInfiniteQuery.data?.pages.flatMap((page) => page.data) ?? ([] as IGetProjectSectionsResponse["data"]),
    isLoading: sectionsInfiniteQuery.isLoading,
    isError: sectionsInfiniteQuery.isError,
    hasNextPage: sectionsInfiniteQuery.hasNextPage,
    fetchNextPage: sectionsInfiniteQuery.fetchNextPage,
    isFetchingNextPage: sectionsInfiniteQuery.isFetchingNextPage,
  };

  return sectionsQuery;
}

export function useSectionMutations() {
  const queryClient = useQueryClient();

  const createSectionMutation = useMutation({
    mutationFn: createSectionApi,
    onSuccess: (_, variable) => {
      queryClient.invalidateQueries({ queryKey: ["sections", variable.projectId] });
    },
  });

  const updateSectionMutation = useMutation({
    mutationFn: updateSectionApi,
    onSuccess: (data, variable) => {
      queryClient.setQueriesData<IQueryData>({ queryKey: ["sections", variable.projectId] }, (old) =>
        produce(old, (draft) => {
          if (!draft) return;

          for (const page of draft.pages) {
            const index = page.data.findIndex((section) => section.id === data.id);
            if (index !== -1) {
              page.data[index] = { ...page.data[index], ...data };
              break;
            }
          }
        }),
      );
    },
  });

  const moveSectionMutation = useMutation({
    mutationFn: moveSectionApi,
    onMutate: ({ projectId, sectionId, moveTo }) => {
      // Cancel in-flight refetches in background so optimistic state can apply immediately.
      void queryClient.cancelQueries({ queryKey: ["sections", projectId] });

      // Snapshot the previous value
      const previousData = queryClient.getQueryData<IQueryData>(["sections", projectId]);

      // Optimistically update to the new value
      queryClient.setQueriesData<IQueryData>({ queryKey: ["sections", projectId] }, (old) =>
        produce(old, (draft) => {
          if (!draft) return;

          const flattenedSections = draft.pages.flatMap((page) => page.data);
          const oldIndex = flattenedSections.findIndex((section) => section.id === sectionId);
          if (oldIndex === -1 || moveTo < 0 || moveTo >= flattenedSections.length) return;

          const reorderedSections = arrayMove(flattenedSections, oldIndex, moveTo);

          let cursor = 0;
          draft.pages.forEach((page) => {
            const size = page.data.length;
            page.data = reorderedSections.slice(cursor, cursor + size);
            cursor += size;
          });
        }),
      );

      // Return a context object with the snapshotted value
      return { previousData };
    },
    onSuccess: (_, variable) => {
      queryClient.invalidateQueries({ queryKey: ["sections", variable.projectId] });
    },
    onError: (_, variable, context) => {
      if (context?.previousData) {
        queryClient.setQueriesData({ queryKey: ["sections", variable.projectId] }, context.previousData);
      }
    },
  });

  const deleteSectionMutation = useMutation({
    mutationFn: deleteSectionApi,
    onSuccess: (_, variable) => {
      queryClient.invalidateQueries({ queryKey: ["sections", variable.projectId] });
    },
  });

  return {
    createSectionMutation,
    updateSectionMutation,
    moveSectionMutation,
    deleteSectionMutation,
  };
}
