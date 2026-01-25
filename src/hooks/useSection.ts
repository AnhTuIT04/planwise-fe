import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { ISection } from "@/types/section.type";
import { getAllSectionsApi } from "@/apis/section/get-all-sections.api";
import { getPersonalProjectApi, getProjectByIdApi } from "@/apis/project/get-tasks-project.api";
import { createSectionApi } from "@/apis/section/create-section.api";
import { updateSectionApi } from "@/apis/section/update-section.api";
import { deleteSectionApi } from "@/apis/section/delete-section.api";
import { useProject } from "./useProject";
interface IUseSectionParams {
  projectId: string;
  page?: number;
  limit?: number;
  status?: "DONE" | "RUNNING" | "TODO" | "ARCHIVED";
  search?: string;
}

export function useSection(params: IUseSectionParams) {
  const queryClient = useQueryClient();
  // const { project } = useProject({projectId: params.projectId});
  // const { data, isLoading, error, isFetching, refetch } = useQuery<ISection[]>({
  //   queryKey: ["sections", params.projectId],
  //   queryFn: async () => {
  //     console.log("Fetching sections for projectId:", params!.projectId);
  //     const [res, err] = await getAllSectionsApi({
  //       projectId: params!.projectId,
  //       // page: params!.page || 1,
  //       // limit: params!.limit || 10,
  //       // status: params!.status,
  //       // search: params!.search,
  //     });
  //     if (err) {
  //       throw err;
  //     }

  //     return res;
  //   },
  //   enabled: !!params?.projectId,
  // });
  const { project,isFetching, isLoading: isLoadingProject, error: projectError } = useProject({
    projectId: params.projectId,
  });

  const sections: ISection[] = project?.sections || [];
  const isLoading = isLoadingProject;
  const error = projectError;

  const refetchProject = () => {
    queryClient.invalidateQueries({
      queryKey: ["projects", { projectId: params.projectId }],
    });
    queryClient.invalidateQueries({
      queryKey: ["project-detail", params.projectId],
    });
    queryClient.invalidateQueries({
      queryKey: ["project-detail"],
    });
    queryClient.invalidateQueries({
      queryKey: ["projects", { personal: true }],
    });
  };
  const createSection = useMutation({
    mutationFn: async (data: { name: string; projectId: string; insertAt?: number }) => {
      const [res, err, msg] = await createSectionApi(data);

      if (err) {
        throw err;
      }
      return { res, msg, data };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["sections", data.data.projectId] });
      queryClient.invalidateQueries({ queryKey: ["sections"] });
      toast.success(data.msg);
      refetchProject();
      return data.res;
    },
    onError: (error: any) => {
      console.log("createSection error:", error);
      toast.error(error.message || "Failed to create section");
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
      queryClient.invalidateQueries({ queryKey: ["sections"] });
      toast.success(data.msg);
      refetchProject();
      return data.res;
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update section");
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
      queryClient.invalidateQueries({ queryKey: ["sections"] });
      toast.success(data.msg);
      refetchProject();
      return data.res;
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete section");
    },
  });

  return {
    // sections
    sections: project?.sections || [],
    isLoading,
    error,
    isFetching,
    refetch: refetchProject,

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
