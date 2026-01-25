import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { getRoleProjectApi } from "@/apis/permission/get-role-project.api";
import { getPermissionGroupApi } from "@/apis/permission/get-permission-group.api";
import { getAllAvailablePermissionProjectApi } from "@/apis/permission/get-all-available-permission.api";
import { getMyPermissionProjectApi } from "@/apis/permission/get-my-permission.api";
export interface IPermissionDto {
  permission: string;
  name: string;
  description: string;
}

export interface IUserPermissions {
  roleId: string;
  roleName: string;
  permissions: IPermissionDto[];
}

export function usePermission(projectId: string | null | undefined) {
  const {
    data: userPermissions,
    isLoading: isLoadingPermissions,
    error: permissionsError,
    refetch: refetchPermissions,
  } = useQuery<IUserPermissions>({
    queryKey: ["permissions", "my-permissions", projectId],
    queryFn: async () => {
      if (!projectId) throw new Error("Project ID is required");
      const [res,err] = await getMyPermissionProjectApi(projectId);
      if (err) {
        throw err;
      }
      return res;
    },
    enabled: !!projectId,
  });

  const { data: availablePermissions, isLoading: isLoadingAvailable } = useQuery({
    queryKey: ["permissions", "available"],
    queryFn: async () => {
      const [res, err] = await getAllAvailablePermissionProjectApi();
      if (err) {
        throw err;
      }
      return res;
    },
  });

  const { data: permissionGroups } = useQuery({
    queryKey: ["permissions", "groups"],
    queryFn: async () => {
      const [res, err] = await getPermissionGroupApi();
      if (err) {
        throw err;
      }
      return res;
    },
  });


  const { data: roleProject, isLoading: isLoadingRoleProject } = useQuery({
    queryKey: ["permissions", "role-project", projectId],
    queryFn: async () => {
      if (!projectId) throw new Error("Project ID is required");
      const [res, err] = await getRoleProjectApi(projectId);
        if (err) {
        throw err;
      }
      return res;
    },
    enabled: !!projectId,
  });
  /**
   * Check if user has a specific permission
   */
  const hasPermission = (permission: string): boolean => {
    if (!userPermissions?.permissions) return false;
    return userPermissions.permissions.some((p) => p.permission === permission);
  };

  /**
   * Check if user has any of the specified permissions
   */
  const hasAnyPermission = (permissions: string[]): boolean => {
    if (!userPermissions?.permissions) return false;
    return permissions.some((permission) =>
      userPermissions.permissions.some((p) => p.permission === permission)
    );
  };

  /**
   * Check if user has all specified permissions
   */
  const hasAllPermissions = (permissions: string[]): boolean => {
    if (!userPermissions?.permissions) return false;
    return permissions.every((permission) =>
      userPermissions.permissions.some((p) => p.permission === permission)
    );
  };

  /**
   * Get list of user's permission strings
   */
  const getUserPermissionStrings = (): string[] => {
    return userPermissions?.permissions?.map((p) => p.permission) || [];
  };

  /**
   * Get permission details by permission string
   */
  const getPermissionDetails = (permission: string): IPermissionDto | undefined => {
    return availablePermissions?.find((p) => p.permission === permission);
  };

  return {
    // Data
    userPermissions,
    availablePermissions,
    permissionGroups,
    // permissionProject,
    roleProject,

    // Loading states
    isLoadingPermissions,
    isLoadingAvailable,
    isLoadingRoleProject,

    // Errors
    permissionsError,

    // Methods
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    getUserPermissionStrings,
    getPermissionDetails,

    // Refetch
    refetchPermissions,
  };
}

/**
 * Common permission constants for easy reference in UI
 */
export const PERMISSIONS = {
  // Project
  PROJECT_READ: "project:read",
  PROJECT_UPDATE: "project:update",
  PROJECT_DELETE: "project:delete",
  PROJECT_VIEW_MEMBERS: "project:view-members",
  PROJECT_MANAGE_MEMBERS: "project:manage-members",
  PROJECT_MANAGE_ROLES: "project:manage-roles",

  // Task
  TASK_CREATE: "task:create",
  TASK_READ: "task:read",
  TASK_UPDATE: "task:update",
  TASK_DELETE: "task:delete",
  TASK_ARCHIVE: "task:archive",
  TASK_ASSIGN: "task:assign",

  // Subtask
  SUBTASK_CREATE: "subtask:create",
  SUBTASK_READ: "subtask:read",
  SUBTASK_UPDATE: "subtask:update",
  SUBTASK_DELETE: "subtask:delete",

  // Section
  SECTION_CREATE: "section:create",
  SECTION_READ: "section:read",
  SECTION_UPDATE: "section:update",
  SECTION_DELETE: "section:delete",

  // Comment
  COMMENT_CREATE: "comment:create",
  COMMENT_READ: "comment:read",
  COMMENT_UPDATE: "comment:update",
  COMMENT_DELETE: "comment:delete",
} as const;
