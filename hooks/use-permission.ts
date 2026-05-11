import { useQuery } from "@tanstack/react-query";
import { getProjectPermissionsApi, IProjectPermission } from "@/services/apis/project/get-project-permissions.api";

export type IPermissionDto = IProjectPermission;

export function usePermission(_projectId?: string | null | undefined) {
  const {
    data: availablePermissions,
    isLoading: isLoadingAvailable,
    error: availableError,
    refetch: refetchAvailable,
  } = useQuery<IPermissionDto[]>({
    queryKey: ["permissions", "available"],
    queryFn: async () => {
      const [res, err] = await getProjectPermissionsApi();
      if (err) throw err;
      return res;
    },
    staleTime: 5 * 60 * 1000,
  });

  const permissionGroups = groupByResource(availablePermissions);

  const getPermissionDetails = (permission: string): IPermissionDto | undefined => {
    return availablePermissions?.find((p) => p.permission === permission);
  };

  return {
    availablePermissions,
    permissionGroups,

    isLoadingAvailable,
    availableError,

    getPermissionDetails,
    refetchAvailable,
  };
}

function groupByResource(perms: IPermissionDto[] | undefined): Record<string, IPermissionDto[]> {
  if (!perms) return {};
  return perms.reduce<Record<string, IPermissionDto[]>>((acc, perm) => {
    const [resource] = perm.permission.split(":");
    if (!acc[resource]) acc[resource] = [];
    acc[resource].push(perm);
    return acc;
  }, {});
}

/**
 * Common permission constants for easy reference in UI
 */
export const PERMISSIONS = {
  PROJECT_UPDATE: "project:update",
  PROJECT_DELETE: "project:delete",
  PROJECT_MANAGE_MEMBERS: "project:manage-members",
  PROJECT_MANAGE_ROLES: "project:manage-roles",
  PROJECT_CREATE_DATA: "project:create-data",
  PROJECT_UPDATE_DATA: "project:update-data",
  PROJECT_DELETE_DATA: "project:delete-data",
} as const;
