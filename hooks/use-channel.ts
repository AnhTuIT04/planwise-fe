"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { IChannel } from "@/types/channel.type";
import { getListChannelsApi } from "@/services/apis/channel/get-list-channels.api";
import { createChannelApi } from "@/services/apis/channel/create-channel.api";

export function useChannel({ projectId }: { projectId: string }) {
  const queryClient = useQueryClient();

  // Get all channels
  const {
    data: channels,
    isLoading,
    error,
    refetch,
  } = useQuery<IChannel[]>({
    queryKey: ["channels", projectId],
    queryFn: async () => {
      const res = await getListChannelsApi(projectId);
      return res.toChannelList();
    },
    enabled: !!projectId,
  });

  // Create channel mutation
  const createChannelMutation = useMutation({
    mutationFn: (payload: { projectId: string; name: string; type: "TEXT" | "VOICE" | "VIDEO" }) =>
      createChannelApi(payload),

    onSuccess: (data) => {
      toast.success("Channel created successfully");
      queryClient.invalidateQueries({ queryKey: ["channels", data.data.projectId] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create channel");
    },
  });

  return {
    channels: channels || [],
    isLoading,
    error,
    refetch,
    createChannel: createChannelMutation.mutate,
    isCreating: createChannelMutation.isPending,
  };
}
