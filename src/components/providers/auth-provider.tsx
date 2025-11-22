"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, ReactNode, useContext } from "react";
import { toast } from "sonner";

import { navigate } from "@/lib/navigation";
import { IUser } from "@/types/user.type";
import { authApi } from "@/apis/auth/auth.api";
import { signInApi } from "@/apis/auth/sign-in.api";
import LoadingScreen from "@/components/shared/loading-screen";
import { REDIRECT_AFTER_AUTH } from "@/lib/router";
import { updateProfileApi } from "@/apis/auth/update-profile.api";
import { signOutApi } from "@/apis/auth/sign-out.api";

interface AuthContextType {
  user: IUser | null;
  isGettingUser: boolean;

  login: (data: { email: string; password: string }) => Promise<void>;
  isLoggingIn: boolean;

  logout: () => Promise<void>;
  isLoggingOut: boolean;

  updateProfile: (data: { fullname?: string; avatarUrl?: String }) => Promise<void>;
  isUpdatingProfile: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  const { data: user, isLoading: isGettingUser } = useQuery<IUser>({
    queryKey: ["auth"],
    queryFn: async () => {
      const res = await authApi();
      return res.toUser();
    },
    retry: false,
  });

  const login = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const res = await signInApi({
        email: data.email,
        password: data.password,
      });

      toast.success("Login successful", { duration: 3000 });

      const user = res.toUser();
      queryClient.setQueryData(["auth"], user);
      localStorage.setItem("accessToken", res.data.accessToken);
      navigate(REDIRECT_AFTER_AUTH);
    },
    onError: (error: any) => {
      toast.error("Login failed", {
        description: error.response?.data?.message || error.message,
        duration: 3000,
      });
    },
  });

  const logout = useMutation({
    mutationFn: async () => {
      await signOutApi();
      toast.success("Logout successful", { duration: 3000 });
      queryClient.removeQueries();
      localStorage.removeItem("accessToken");
      navigate("/");
    },
    onError: (error: any) => {
      toast.error("Logout failed", {
        description: error.response?.data?.message || error.message,
        duration: 3000,
      });
      queryClient.removeQueries();
      localStorage.removeItem("accessToken");
      navigate("/");
    },
  });

  const updateProfile = useMutation({
    mutationFn: async (data: { fullname?: string; avatarUrl?: String }) => {
      const res = await updateProfileApi(data);

      toast.success("Update successful", {
        description: res.message,
        duration: 3000,
      });

      queryClient.setQueryData(["auth"], res.toUser());
    },
    onError: (error: any) => {
      toast.error("Update failed", {
        description: error.response?.data?.message || error.message,
        duration: 3000,
      });
    },
  });

  const value = {
    user: user || null,
    isGettingUser,
    login: login.mutateAsync,
    isLoggingIn: login.isPending,
    logout: logout.mutateAsync,
    isLoggingOut: logout.isPending,
    updateProfile: updateProfile.mutateAsync,
    isUpdatingProfile: updateProfile.isPending,
  };

  return <AuthContext.Provider value={value}>{isGettingUser ? <LoadingScreen /> : children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
