import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { IProject } from "@/types/project.type";
import { getListOfProjects } from "@/services/apis/project/get-all-projects.api";
import { getProjectDetailApi } from "@/services/apis/project/get-project-detail.api";
import { createProjectApi } from "@/services/apis/project/create-project.api";
import { updateProjectApi } from "@/services/apis/project/update-project.api";
import { deleteProjectApi } from "@/services/apis/project/delete-project.api";
import { inviteMemberProjectApi } from "@/services/apis/project/invite-member-project.api";
import { responseInviteProjectApi } from "@/services/apis/project/response-invite.api";

export function useProject() {
  const queryClient = useQueryClient();

  const projectsQuery = useQuery<IProject[]>({
    queryKey: ["projects"],
    queryFn: async () => {
      const data = await getListOfProjects();
      const projects = data.toProjects();

      for (const project of projects) {
        queryClient.setQueriesData({ queryKey: ["project", project.id] }, project);
      }

      return projects;
    },
  });

  return projectsQuery;
}

export function useProjectById(projectId: string) {
  const projectQuery = useQuery<IProject>({
    queryKey: ["project", projectId],
    queryFn: async () => {
      const data = await getProjectDetailApi(projectId);
      return data.toProject();
    },
  });

  return projectQuery;
}

export function useProjectMutations() {
  const queryClient = useQueryClient();

  const createProjectMutation = useMutation({
    mutationFn: createProjectApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project"] });
    },
  });

  const updateProjectMutation = useMutation({
    mutationFn: updateProjectApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project"] });
    },
  });

  const deleteProjectMutation = useMutation({
    mutationFn: deleteProjectApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project"] });
    },
  });

  const inviteMemberMutation = useMutation({
    mutationFn: ({ projectId, payload }: { projectId: string; payload: any }) => inviteMemberProjectApi(projectId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-members"] });
    },
  });

  const responseInviteMutation = useMutation({
    mutationFn: ({ projectId, payload }: { projectId: string; payload: any }) => responseInviteProjectApi(projectId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project-members"] });
    },
  });

  return {
    createProjectMutation,
    updateProjectMutation,
    deleteProjectMutation,
    inviteMemberMutation,
    responseInviteMutation,
  };
}
