import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { authClientApi } from "@/services/apis/auth/auth-client.api";
import { signOutApi } from "@/services/apis/auth/sign-out.api";
import { IUser } from "@/types/user.type";

export function useAuth() {
  const queryClient = useQueryClient();

  const { data, isLoading, error, isFetching, refetch } = useQuery<IUser>({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const response = await authClientApi();
      return response.toUser();
    },
  });

  const logout = async () => {
    try {
      await signOutApi();
      queryClient.clear();
      window.location.href = "/sign-in";
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  return {
    user: data,
    isLoading,
    error,
    isFetching,
    refetch,
    logout,
  };
}
