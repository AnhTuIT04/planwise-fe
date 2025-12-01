import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { authApi } from "@/apis/auth/auth.api";
import { IUser } from "@/types/user.type";

export function useAuth() {
  const queryClient = useQueryClient();

  const { data, isLoading, error, isFetching, refetch } = useQuery<IUser>({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const response = await authApi();
      return response.toUser();
    },
  });

  return {
    user: data,
    isLoading,
    error,
    isFetching,
    refetch,
  };
}