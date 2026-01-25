"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { IProject } from "@/types/project.type";
import { getPersonalProjectApi, getProjectByIdApi, GetProjectTasksParams } from "@/apis/project/get-tasks-project.api";
import { getDetailProjectApi } from "@/apis/project/get-detail-project.api";
import { inviteMemberEmailProjectApi } from "@/apis/project/invite-member-email.api";
import { responseInviteProjectApi } from "@/apis/project/response-invite.api";
import { getListOfProjects } from "@/apis/project/get-list-of-projects.api";
import { createProjectApi, CreateProjectRequest } from "@/apis/project/create-project.api";
import { updateProjectApi } from "@/apis/project/update-project.api";
import { getRolesProjectApi } from "@/apis/project/get-roles-project.api";
import { inviteMemberProjectApi } from "@/apis/project/invite-member-project.api";
import { toast } from "sonner";
import { is } from "date-fns/locale";
import { ISection } from "@/types/section.type";
import { getListPersonalSectionApi } from "@/apis/project/get-list-personal-section.api";

type IUseProjectParams = {
  projectId?: string;
  deadlineFrom?: string;
  deadlineTo?: string;
};

type IQueryResponse = { sections: ISection[], project: IProject };

export function useProject(params: IUseProjectParams) {
  const queryClient = useQueryClient();

  const { projectId, deadlineFrom, deadlineTo } = params;

  const { data, isLoading, error, isFetching, refetch } = useQuery<IQueryResponse>({
    queryKey: ["project-detail", projectId, deadlineFrom, deadlineTo],
    queryFn: async () => {
      if (!projectId) throw new Error("Project ID is missing");

      const filterParams: GetProjectTasksParams = {};
      if (deadlineFrom) filterParams.deadlineFrom = deadlineFrom;
      if (deadlineTo) filterParams.deadlineTo = deadlineTo;

      const [res, err] = await getProjectByIdApi(projectId, filterParams);
      const [detailProject, errDetail] = await getDetailProjectApi(projectId);

      if (err || errDetail) {
        throw err || errDetail;
      }

      return { sections: res, project: detailProject };
    },
    enabled: !!projectId, // Chỉ chạy query khi có projectId → hook luôn được gọi như nhau
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
  
  const {data: roles , isLoading: isLoadingRoles, error: errorRoles, isFetching: isFetchingRoles} = useQuery({
    queryKey: ["project-roles", projectId],
    queryFn: async () => {
      if (!projectId) throw new Error("Project ID is missing");
      const [res, err] = await getRolesProjectApi(projectId);
      if (err) {
        throw err;
      }
      return res;
    },
    enabled: !!projectId,
  });

  // Create project
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

  const getListPersonalSection = useMutation({
    mutationFn: async (payload: { projectId: string }) => {
      const [res, err] = await getListPersonalSectionApi(payload);
      if (err) {
        throw err;
      }
      return res;
    },
  });

  const inviteMemberProject = useMutation({
    mutationFn: async (payload: { projectId: string; email: string; roleId: string }) => {
      const [res, err] = await inviteMemberProjectApi(payload.projectId, { email: payload.email, roleId: payload.roleId });
      if (err) {
        throw err;
      }
      return { res, projectId: payload.projectId };
    },
    onSuccess: (data) => {
      // Invalidate member queries to refresh the list
      queryClient.invalidateQueries({ queryKey: ["project-members", data.projectId] });
      queryClient.invalidateQueries({ queryKey: ["project-detail", data.projectId] });
      toast.success(data.res.message || "Member invited successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to invite member");
    },
  });

  const inviteMemberEmailProject = useMutation({
    mutationFn: async (payload: { projectId: string; email: string; roleId: string; projectName: string; inviterName: string }) => {
      const [res, err] = await inviteMemberEmailProjectApi(payload.projectId, { email: payload.email, roleId: payload.roleId, projectName: payload.projectName, inviterName: payload.inviterName });
      if (err) {
        throw err;
      }
      return { res, projectId: payload.projectId };
    },
    onSuccess: (data) => {
      toast.success(data.res.message || "Successfully joined the project");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to join the project");
    },
  }); 
  const responseInviteProject = useMutation({
    mutationFn: async (payload: { projectId: string; response: "ACCEPTED" | "DECLINED" }) => {
      const [res, err] = await responseInviteProjectApi(payload.projectId, { response: payload.response }); 
      if (err) {
        throw err;
      }
      return { res, projectId: payload.projectId };
    },
    onSuccess: (data) => {
      // Invalidate member queries to refresh the list
      queryClient.invalidateQueries({ queryKey: ["project-members", data.projectId] });
      queryClient.invalidateQueries({ queryKey: ["project-detail", data.projectId] });
      toast.success(data.res.message || "Response to invitation recorded successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to respond to invitation");
    },
  });
  return {
    project: data,
    isLoading,
    error,
    isFetching,
    refetch,
    roles,
    isLoadingRoles,
    errorRoles,
    isFetchingRoles,
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

    getListPersonalSection: getListPersonalSection.mutateAsync,
    isGettingListPersonalSection: getListPersonalSection.isPending,
    getListPersonalSectionError: getListPersonalSection.error,

    inviteMemberProject: inviteMemberProject.mutateAsync,
    isInvitingMemberProject: inviteMemberProject.isPending,
    inviteMemberProjectError: inviteMemberProject.error,

    inviteMemberEmailProject: inviteMemberEmailProject.mutateAsync,
    isInvitingMemberEmailProject: inviteMemberEmailProject.isPending,
    inviteMemberEmailProjectError: inviteMemberEmailProject.error,

    responseInviteProject: responseInviteProject.mutateAsync,
    isRespondingInviteProject: responseInviteProject.isPending,
    responseInviteProjectError: responseInviteProject.error,
  };
}
