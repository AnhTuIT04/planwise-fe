import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { IProject } from "@/types/project.type";
import {getPersonalProjectApi} from "@/apis/project/getPersonProject.api";

interface IProjectParams {
  page?: number;
  limit?: number;
}

export function useProject(param?: IProjectParams) {
  const queryClient = useQueryClient();

  const { data, isLoading, error, isFetching, refetch } = useQuery<IProject>({
    queryKey: ["projects", param],
    queryFn: async () => {
      console.log("COME HERE");

      const [res, err] = await getPersonalProjectApi({
        page: param?.page || 1,
        limit: param?.limit || 10,
      });

      if (err) {
        throw err;
      }

      return res;
    },
  });

  return {
    // sections
    project: data,
    isLoading,
    error,
    isFetching,
    refetch,
  };
}
