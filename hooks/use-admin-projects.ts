import { useQuery } from "@tanstack/react-query";

import {
  getAdminProjectDetailApi,
  getAdminProjectsApi,
  IAdminProjectsParams,
} from "@/services/apis/admin/admin-projects.api";

// Projects are READ-ONLY for admins: list + general info only, no mutations.
export function useAdminProjects(params: IAdminProjectsParams = {}) {
  return useQuery({
    queryKey: ["admin", "projects", params],
    queryFn: () => getAdminProjectsApi(params),
    placeholderData: (previousData) => previousData,
  });
}

export function useAdminProjectDetail(projectId: string) {
  return useQuery({
    queryKey: ["admin", "project", projectId],
    queryFn: async () => {
      const response = await getAdminProjectDetailApi(projectId);
      return response.data;
    },
    enabled: Boolean(projectId),
  });
}
