import { useQuery, useQueryClient } from "@tanstack/react-query";

import { IProjectMember } from "@/types/user.type";
import { getProjectMembersApi } from "@/services/apis/project/get-project-members.api";

export function useProjectMember(projectId: string) {
  const queryClient = useQueryClient();

  const projectMembersQuery = useQuery<IProjectMember[]>({
    queryKey: ["project-members", projectId],
    queryFn: async () => {
      const data = await getProjectMembersApi(projectId);
      return data.toUsers();
    },
  });

  return projectMembersQuery;
}
