import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { IUserInProject } from "@/types/user.type";
import { getMembersProjectApi } from "@/apis/project/get-members-project.api";
import { updateMemberRoleApi, removeMemberApi } from "@/apis/project/member.api";

export function useMembers(projectId: string, searchQuery: string, currentPage: number, itemsPerPage: number) {
  const queryClient = useQueryClient();

  const { data, isLoading, error, isFetching, refetch } = useQuery<IUserInProject[]>({
    queryKey: ["project-members", projectId],
    queryFn: async () => {
      const [res, err] = await getMembersProjectApi(projectId);
      if (err) {
        throw err;
      }
      return res;
    },
    enabled: !!projectId,
  });

  // Filter members based on search query
  const filteredMembers = useMemo(() => {
    if (!data) return [];
    if (!searchQuery) return data;
    
    const query = searchQuery.toLowerCase();
    return data.filter(
      (member) =>
        member.fullname.toLowerCase().includes(query) ||
        member.email.toLowerCase().includes(query)
    );
  }, [data, searchQuery]);

  // Calculate pagination
  const totalPages = Math.ceil((filteredMembers?.length || 0) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedMembers = filteredMembers?.slice(startIndex, startIndex + itemsPerPage) || [];

  // Update member role mutation
  const updateMemberRole = useMutation({
    mutationFn: async ({ memberId, roleId }: { memberId: string; roleId: string }) => {
      const [res, err, msg] = await updateMemberRoleApi(projectId, memberId, { roleId });
      if (err) throw err;
      return { res, msg };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["project-members", projectId] });
      queryClient.invalidateQueries({ queryKey: ["project-detail", projectId] });
      toast.success(data.msg || "Member role updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update member role");
    },
  });

  // Remove member mutation
  const removeMember = useMutation({
    mutationFn: async (memberId: string) => {
      const [res, err, msg] = await removeMemberApi(projectId, memberId);
      if (err) throw err;
      return { res, msg };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["project-members", projectId] });
      queryClient.invalidateQueries({ queryKey: ["project-detail", projectId] });
      toast.success(data.msg || "Member removed successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to remove member");
    },
  });

  return {
    members: data,
    filteredMembers,
    paginatedMembers,
    totalPages,
    startIndex,
    isLoading,
    error,
    isFetching,
    refetch,

    // Update member role
    updateMemberRole: updateMemberRole.mutateAsync,
    isUpdatingMemberRole: updateMemberRole.isPending,

    // Remove member
    removeMember: removeMember.mutateAsync,
    isRemovingMember: removeMember.isPending,
  };
}