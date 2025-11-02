import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { ISection } from "@/types/section.type";
import { getAllSectionsApi } from "@/apis/section/getAllSections.api";
import { createSectionApi } from "@/apis/section/createSection.api";

interface ISectionParams {
  page?: number;
  limit?: number;
  status?: "DONE" | "IN_PROGRESS" | "TODO";
  search?: string;
}

export function useSection(param?: ISectionParams) {
  const queryClient = useQueryClient();

  const { data, isLoading, error, isFetching, refetch } = useQuery<ISection[]>({
    queryKey: ["sections", param],
    queryFn: async () => {
      console.log("COME HERE");

      const [res, err] = await getAllSectionsApi({
        page: param?.page || 1,
        limit: param?.limit || 10,
        status: param?.status,
        search: param?.search,
      });

      if (err) {
        throw err;
      }

      return res;
    },
  });

  const createSection = useMutation({
    mutationFn: async (data: { name: string; projectId: string; listOfTask?: string }) => {
      const [res, err] = await createSectionApi(data);

      if (err) {
        throw err;
      }

      return res;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["sections"] });
      return data;
    },
    retry: false,
  });

  return {
    // sections
    sections: data,
    isLoading,
    error,
    isFetching,
    refetch,

    // create section
    createSection: createSection.mutateAsync,
    isCreatingSection: createSection.isPending,
    createSectionError: createSection.error,
  };
}
