import { useQuery } from "@tanstack/react-query";

import { getAdminStatsApi } from "@/services/apis/admin/admin-stats.api";

export function useAdminStats() {
  return useQuery({
    queryKey: ["admin", "stats"],
    queryFn: async () => {
      const response = await getAdminStatsApi();
      return response.data;
    },
  });
}
