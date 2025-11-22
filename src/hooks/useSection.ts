import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { ISection } from "@/types/section.type";
import { getAllSectionsApi } from "@/apis/section/get-all-sections.api";
import { createSectionApi } from "@/apis/section/create-section.api";
import { updateSectionApi } from "@/apis/section/update-section.api";
import { deleteSectionApi } from "@/apis/section/delete-section.api";

interface IUseSectionParams {
  projectId: string;
  page?: number;
  limit?: number;
  status?: "DONE" | "RUNNING" | "TODO" | "ARCHIVED";
  search?: string;
}

export function useSection(params?: IUseSectionParams) {
  const queryClient = useQueryClient();

  const { data, isLoading, error, isFetching, refetch } = useQuery<ISection[]>({
    queryKey: ["sections", params?.projectId],
    queryFn: async () => {
      console.log("Fetching sections for projectId:", params!.projectId);
      const [res, err] = await getAllSectionsApi({
        projectId: params!.projectId,
        // page: params!.page || 1,
        // limit: params!.limit || 10,
        // status: params!.status,
        // search: params!.search,
      });

      if (err) {
        throw err;
      }

      return res;
    },
    enabled: !!params?.projectId,
  });

  const createSection = useMutation({
    mutationFn: async (data: { name: string; projectId: string; insertAt?: number }) => {
      const [res, err, msg] = await createSectionApi(data);

      if (err) {
        throw err;
      }

      queryClient.invalidateQueries({ queryKey: ["sections", data.projectId] });
      toast.success(msg);
      return res;
    },
  });

  const updateSection = useMutation({
    mutationFn: async (data: { id: string; projectId: string; name?: string }) => {
      const [res, err, msg] = await updateSectionApi(data);

      if (err) {
        throw err;
      }

      return { res, msg, data };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["sections", data.data.projectId] });
      toast.success(data.msg);
      return data.res;
    },
  });

  const deleteSection = useMutation({
    mutationFn: async (data: { id: string; projectId: string }) => {
      const [res, err, msg] = await deleteSectionApi(data);

      if (err) {
        throw err;
      }

      return { res, msg, data };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["sections", data.data.projectId] });
      toast.success(data.msg);
      return data.res;
    },
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

    // update section
    updateSection: updateSection.mutateAsync,
    isUpdatingSection: updateSection.isPending,
    updateSectionError: updateSection.error,

    // delete section
    deleteSection: deleteSection.mutateAsync,
    isDeletingSection: deleteSection.isPending,
    deleteSectionError: deleteSection.error,
  };
}
