"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { produce } from "immer";
import { toast } from "react-toastify";

import { IChannel } from "@/types/channel.type";
import { getListChannelsApi } from "@/services/apis/channel/get-list-channels.api";
import { createChannelApi } from "@/services/apis/channel/create-channel.api";
import { updateChannelApi } from "@/services/apis/channel/update-channel.api";
import { deleteChannelApi } from "@/services/apis/channel/delete-channel.api";

export function useChannel({ projectId }: { projectId: string }) {
  const queryClient = useQueryClient();

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

  const updateChannelMutation = useMutation({
    mutationFn: updateChannelApi,
    onMutate: ({ channelId, name }) => {
      const previous = queryClient.getQueryData<IChannel[]>(["channels", projectId]);
      queryClient.setQueryData<IChannel[]>(["channels", projectId], (old) =>
        produce(old, (draft) => {
          if (!draft) return;
          const ch = draft.find((c) => c.id === channelId);
          if (ch) ch.name = name;
        }),
      );
      return { previous };
    },
    onError: (error: any, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(["channels", projectId], context.previous);
      toast.error(error?.response?.data?.message || "Failed to update channel");
    },
    onSuccess: () => {
      toast.success("Channel renamed");
    },
  });

  const deleteChannelMutation = useMutation({
    mutationFn: deleteChannelApi,
    onMutate: ({ channelId }) => {
      const previous = queryClient.getQueryData<IChannel[]>(["channels", projectId]);
      queryClient.setQueryData<IChannel[]>(["channels", projectId], (old) =>
        produce(old, (draft) => {
          if (!draft) return;
          const idx = draft.findIndex((c) => c.id === channelId);
          if (idx !== -1) draft.splice(idx, 1);
        }),
      );
      return { previous };
    },
    onError: (error: any, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(["channels", projectId], context.previous);
      toast.error(error?.response?.data?.message || "Failed to delete channel");
    },
    onSuccess: () => {
      toast.success("Channel deleted");
    },
  });

  return {
    channels: channels || [],
    isLoading,
    error,
    refetch,
    createChannel: createChannelMutation.mutate,
    isCreating: createChannelMutation.isPending,
    updateChannel: updateChannelMutation.mutate,
    isUpdating: updateChannelMutation.isPending,
    deleteChannel: deleteChannelMutation.mutate,
    isDeleting: deleteChannelMutation.isPending,
  };
}
