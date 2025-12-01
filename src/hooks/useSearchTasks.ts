import { useQuery } from "@tanstack/react-query";
import { searchTasksApi, SearchTasksParams } from "@/apis/task/search-tasks.api";

interface UseSearchTasksParams extends SearchTasksParams {
  projectId: string;
  enabled?: boolean;
}

export function useSearchTasks({ projectId, enabled = true, ...params }: UseSearchTasksParams) {
  const hasFilters = !!(
    params.q ||
    params.deadlineFrom ||
    params.deadlineTo ||
    params.sections?.length ||
    params.statuses?.length ||
    params.priorities?.length
  );

  const query = useQuery({
    queryKey: ["search-tasks", projectId, params],
    queryFn: async () => {
      const [data, error] = await searchTasksApi(projectId, params);
      if (error) throw error;
      return data;
    },
    enabled: enabled && !!projectId && hasFilters,
  });

  return {
    tasks: query.data || [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    refetch: query.refetch,
  };
}
