import { useQuery, useQueryClient } from "@tanstack/react-query";

import { IProject } from "@/types/project.type";
import { getPersonalProjectApi } from "@/apis/project/get-personal-project.api";

type IUseProjectParams =
  | {
      projectId: string;
    }
  | {
      personal: boolean;
    };

export function useProject(params: IUseProjectParams) {
  const queryClient = useQueryClient();

  const { data, isLoading, error, isFetching, refetch } = useQuery<IProject>({
    queryKey: ["projects", params],
    queryFn: async () => {
      // if ("projectId" in params) {
      const [res, err] = await getPersonalProjectApi();

      if (err) {
        throw err;
      }

      return res;
    },
  });

  return {
    project: data,
    isLoading,
    error,
    isFetching,
    refetch,
  };
}
