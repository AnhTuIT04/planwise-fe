"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getConnectionsApi } from "@/apis/calendar/get-connections.api";
import { deleteConnectionApi } from "@/apis/calendar/disconnect.api";
import { toast } from "sonner";

export function useCalendarIntegration(provider: "GOOGLE_CALENDAR") {
  const queryClient = useQueryClient()
  const { data, isLoading } = useQuery({
    queryKey: ["calendar-connections", provider],
    queryFn: async () => {
      const [res, err] = await getConnectionsApi(provider);
      if (err) throw err;
      return res;
    },
  });

  const deleteConnection = useMutation({
    mutationFn: ({ provider, connectionId }: { provider: string; connectionId: string }) =>
      deleteConnectionApi(provider, connectionId),
    onSuccess: () => {
      // Invalidate the connections query to refetch the updated list
      queryClient.invalidateQueries({ queryKey: ["calendar-connections", provider] });
      queryClient.invalidateQueries({ queryKey: ["events", provider] }); 
      toast.success("Connection deleted");
    }
  });

  return {
    integrated: (data?.length ?? 0) > 0,
    connections: data ?? [],
    isLoading,
    deleteConnection,
  };
}