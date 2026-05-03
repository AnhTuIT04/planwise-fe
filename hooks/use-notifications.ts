import {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  IListNotificationsResponse,
  listNotificationsApi,
} from "@/services/apis/notification/list-notifications.api";
import { markNotificationReadApi } from "@/services/apis/notification/mark-read.api";
import { markAllNotificationsReadApi } from "@/services/apis/notification/mark-all-read.api";
import { getUnreadNotificationCountApi } from "@/services/apis/notification/get-unread-count.api";
import { INotificationCategory } from "@/types/notification.type";

const PAGE_SIZE = 20;

interface IPageParams {
  page: number;
  limit: number;
}

type IPage = IListNotificationsResponse["data"];
type INotificationsInfiniteData = InfiniteData<IPage, IPageParams>;

export function useNotifications(category: INotificationCategory) {
  const query = useInfiniteQuery<IPage, Error, INotificationsInfiniteData, [string, string, INotificationCategory], IPageParams>({
    queryKey: ["notifications", "list", category],
    initialPageParam: { page: 1, limit: PAGE_SIZE },
    queryFn: async ({ pageParam }) => {
      const res = await listNotificationsApi({
        page: pageParam.page,
        limit: pageParam.limit,
        category,
      });
      return res.data;
    },
    getNextPageParam: (lastPage) => {
      const { page, limit, totalPages } = lastPage.pagination;
      if (page < totalPages) return { page: page + 1, limit };
      return undefined;
    },
  });

  return {
    items: query.data?.pages.flatMap((p) => p.items) ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    hasNextPage: query.hasNextPage,
    fetchNextPage: query.fetchNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
  };
}

export function useUnreadNotificationCount() {
  return useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: getUnreadNotificationCountApi,
  });
}

export function useNotificationMutations() {
  const queryClient = useQueryClient();

  const markRead = useMutation({
    mutationFn: markNotificationReadApi,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["notifications", "list"] });

      queryClient.setQueriesData<INotificationsInfiniteData>(
        { queryKey: ["notifications", "list"] },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              items: page.items.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
            })),
          };
        },
      );

      queryClient.setQueryData<{ count: number }>(["notifications", "unread-count"], (old) => ({
        count: Math.max(0, (old?.count ?? 1) - 1),
      }));
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const markAllRead = useMutation({
    mutationFn: markAllNotificationsReadApi,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["notifications", "list"] });

      queryClient.setQueriesData<INotificationsInfiniteData>(
        { queryKey: ["notifications", "list"] },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              items: page.items.map((n) => ({ ...n, isRead: true })),
            })),
          };
        },
      );

      queryClient.setQueryData<{ count: number }>(["notifications", "unread-count"], { count: 0 });
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  return { markRead, markAllRead };
}
