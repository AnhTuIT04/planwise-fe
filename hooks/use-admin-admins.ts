import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { createAdminApi, getAdminsApi } from "@/services/apis/admin/admin-admins.api";

export function useAdminAdmins() {
  return useQuery({
    queryKey: ["admin", "admins"],
    queryFn: async () => {
      const response = await getAdminsApi();
      return response.data;
    },
  });
}

export function useCreateAdminMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAdminApi,
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries({ queryKey: ["admin", "admins"] });
    },
    onError: (err: { message?: string }) => {
      toast.error(err?.message || "Failed to create admin");
    },
  });
}
