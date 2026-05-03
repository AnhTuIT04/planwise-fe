import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { IRole, PERMISSIONS } from "@/types/role.type";
import { getRolesProjectApi } from "@/services/apis/project/get-roles-project.api";
import { createRoleApi, updateRoleApi, deleteRoleApi } from "@/services/apis/project/role.api";

export function useRolesManagement(projectId: string) {
  const queryClient = useQueryClient();

  // Fetch roles from API
  const { data: roles, isLoading, error, isFetching, refetch } = useQuery<IRole[]>({
    queryKey: ["project-roles", projectId],
    queryFn: async () => {
      const [res, err] = await getRolesProjectApi(projectId);
      console.log("res roles: ", res);
      if (err) {
        throw err;
      }
      return res;
    },
    enabled: !!projectId,
  });

  // Create role mutation
  const createRole = useMutation({
    mutationFn: async ({ name, permissions }: { name: string; permissions: string[] }) => {
      const [res, err, msg] = await createRoleApi({projectId, name, permissions });
      if (err) throw err;
      return { res, msg };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["project-roles", projectId] });
      toast.success(data.msg || "Role created successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create role");
    },
  });

  // Update role mutation
  const updateRole = useMutation({
    mutationFn: async ({ roleId, name, permissions }: { roleId: string; name?: string; permissions?: string[] }) => {
      const [res, err, msg] = await updateRoleApi(roleId, { name, permissions });
      if (err) throw err;
      return { res, msg };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["project-roles", projectId] });
      queryClient.invalidateQueries({ queryKey: ["project-members", projectId] });
      toast.success(data.msg || "Role updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update role");
    },
  });

  // Delete role mutation
  const deleteRole = useMutation({
    mutationFn: async (roleId: string) => {
      const [res, err, msg] = await deleteRoleApi(roleId);
      if (err) throw err;
      return { res, msg };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["project-roles", projectId] });
      toast.success(data.msg || "Role deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete role");
    },
  });

  return {
    roles: roles || [],
    isLoading,
    error,
    isFetching,
    refetch,
    PERMISSIONS,

    // Create role
    createRole: createRole.mutateAsync,
    isCreatingRole: createRole.isPending,

    // Update role
    updateRole: updateRole.mutateAsync,
    isUpdatingRole: updateRole.isPending,

    // Delete role
    deleteRole: deleteRole.mutateAsync,
    isDeletingRole: deleteRole.isPending,
  };
}
