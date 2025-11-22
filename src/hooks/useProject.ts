"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { IProject } from "@/types/project.type";
import { getPersonalProjectApi, getProjectByIdApi } from "@/apis/project/get-personal-project.api";
import { getListOfProjects } from "@/apis/project/get-list-of-projects.api";
import { createProjectApi, CreateProjectRequest } from "@/apis/project/create-project.api";
import { updateProjectApi } from "@/apis/project/update-project.api";
import { toast } from "sonner";
import { is } from "date-fns/locale";

type IUseProjectParams =
  | {
      projectId: string;
    }
  | {
      personal: boolean;
    };

export function useProject(params: IUseProjectParams = { personal: true }) {
  const queryClient = useQueryClient();

  const { data, isLoading, error, isFetching, refetch } = useQuery<IProject>({
    queryKey: ["projects", params],
    queryFn: async () => {
      if (params.hasOwnProperty("projectId")) {
        const [res, err] = await getProjectByIdApi((params as { projectId: string }).projectId);
        if (err) {
          throw err;
        }
        return res;
      } else {
        const [res, err] = await getPersonalProjectApi();
        if (err) {
          throw err;
        }
        return res;
      }
    },
  });

  const {
    data: allProjects,
    isLoading: isLoadingAllProjects,
    error: errorAllProjects,
    isFetching: isFetchingAllProjects,
    refetch: refetchAllProjects,
  } = useQuery<IProject[]>({
    queryKey: ["allProjects"],
    queryFn: async () => {
      const [res, err] = await getListOfProjects();
      if (err) {
        throw err;
      }
      return res;
    },
  });
  const createProject = useMutation({
    mutationFn: async (data: CreateProjectRequest) => {
      const [res, err, msg] = await createProjectApi(data);
      if (err) throw err;
      return { res, msg };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["allProjects"] });
      toast.success(data.msg || "Project created successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create project");
    },
  });

  // Update project
  const updateProject = useMutation({
    mutationFn: async (data: {
      id: string;
      name?: string;
      description?: string;
      logoUrl?: string;
      listOfSection?: string[];
    }) => {
      const [res, err, msg] = await updateProjectApi(data);

      if (err) {
        throw err;
      }

      return { res, msg, data };
    },
    onSuccess: (data) => {
      // Invalidate all queries that start with "projects"
      queryClient.invalidateQueries({ queryKey: ["projects", {projectId: data.data.id}] });
      // Also invalidate the all projects list
      queryClient.invalidateQueries({ queryKey: ["allProjects"] });
      toast.success(data.msg);
      return data.res;
    },
  });

  return {
    project: data,
    isLoading,
    error,
    isFetching,
    refetch,

    allProjects,
    isLoadingAllProjects,
    errorAllProjects,
    isFetchingAllProjects,
    refetchAllProjects,

    updateProject: updateProject.mutateAsync,
    isUpdatingProject: updateProject.isPending,
    updateProjectError: updateProject.error,

    createProject: createProject.mutateAsync,
    isCreatingProject: createProject.isPending,
    createProjectError: createProject.error,
  };
}
