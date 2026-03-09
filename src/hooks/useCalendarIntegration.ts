"use client";

import { useQuery } from "@tanstack/react-query";
import { getConnectionsApi } from "@/apis/calendar/get-connections.api";

export function useCalendarIntegration(provider: "GOOGLE_CALENDAR") {
  const { data, isLoading } = useQuery({
    queryKey: ["calendar-connections", provider],
    queryFn: async () => {
      const [res, err] = await getConnectionsApi(provider);
      if (err) throw err;
      return res;
    },
  });

  return {
    integrated: (data?.length ?? 0) > 0,
    connections: data ?? [],
    isLoading,
  };
}