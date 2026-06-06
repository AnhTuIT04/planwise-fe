import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import { adminMeApi, adminSignInApi, adminSignOutApi } from "@/services/apis/admin/admin-auth.api";

export function useAdminAuth() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "me"],
    queryFn: async () => {
      const response = await adminMeApi();
      return response.data;
    },
    retry: false,
  });

  const signInMutation = useMutation({
    mutationFn: adminSignInApi,
    onSuccess: (response) => {
      queryClient.setQueryData(["admin", "me"], response.data);
      toast.success(response.message);
      router.replace("/admin");
    },
    onError: (err: { message?: string }) => {
      toast.error(err?.message || "Sign in failed");
    },
  });

  const logout = async () => {
    try {
      await adminSignOutApi();
      queryClient.clear();
      window.location.href = "/admin-sign-in";
    } catch {
      toast.error("Logout failed");
    }
  };

  return {
    admin: data,
    isLoading,
    error,
    signInMutation,
    logout,
  };
}
