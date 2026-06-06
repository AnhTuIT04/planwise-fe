import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import {
  disableUserApi,
  enableUserApi,
  getAdminUserDetailApi,
  getAdminUsersApi,
  IAdminUsersParams,
} from "@/services/apis/admin/admin-users.api";

export function useAdminUsers(params: IAdminUsersParams = {}) {
  return useQuery({
    queryKey: ["admin", "users", params],
    queryFn: () => getAdminUsersApi(params),
    placeholderData: (previousData) => previousData,
  });
}

export function useAdminUserDetail(userId: string) {
  return useQuery({
    queryKey: ["admin", "user", userId],
    queryFn: async () => {
      const response = await getAdminUserDetailApi(userId);
      return response.data;
    },
    enabled: Boolean(userId),
  });
}

export function useAdminUserMutations() {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    queryClient.invalidateQueries({ queryKey: ["admin", "user"] });
    queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
  };

  const disableUserMutation = useMutation({
    mutationFn: disableUserApi,
    onSuccess: (response) => {
      toast.success(response.message);
      invalidate();
    },
    onError: (err: { message?: string }) => {
      toast.error(err?.message || "Failed to disable user");
    },
  });

  const enableUserMutation = useMutation({
    mutationFn: enableUserApi,
    onSuccess: (response) => {
      toast.success(response.message);
      invalidate();
    },
    onError: (err: { message?: string }) => {
      toast.error(err?.message || "Failed to enable user");
    },
  });

  return { disableUserMutation, enableUserMutation };
}
