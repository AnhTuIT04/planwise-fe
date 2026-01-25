"use client";

import { use, useState } from "react";
import { useProject } from "@/hooks/useProject";
import MembersSkeleton from "@/components/project/members/members-skeleton";
import useModal from "@/hooks/useModal";
import MembersPagination from "@/components/project/members/members-pagination";
import { useMembers } from "@/hooks/useMembersManagement";
import MembersHeader from "@/components/project/members/member-header";
import MembersSearch from "@/components/project/members/member-search";
import MembersTable from "@/components/project/members/member-table";
import { useRolesManagement } from "@/hooks/useRolesManagement";
import { IRole } from "@/types/role.type";
import { ca } from "date-fns/locale";

interface MembersProps {
  params: Promise<{
    projectId: string;
  }>;
}

function Members({ params }: MembersProps) {
  const { openModal, closeModal } = useModal<"ADD_MEMBER">();
  const { openModal: openEditMemberModal, closeModal: closeEditMemberModal } = useModal<"EDIT_MEMBER">();
  const { openModal: openConfirmModal, closeModal: closeConfirmModal } = useModal<"CONFIRM">();
  const { projectId } = use(params);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const { project: projectData } = useProject({ projectId });
  const { roles } = useRolesManagement(projectId);

  const {
    filteredMembers,
    paginatedMembers,
    totalPages,
    startIndex,
    isLoading,
    updateMemberRole,
    removeMember,
  } = useMembers(projectId, searchQuery, currentPage, itemsPerPage);

  const handleAddMemberClick = () => {
    if (!projectData?.project) return;
    openModal({
      type: "ADD_MEMBER",
      data: {
        project: projectData.project,
      },
      onSubmit: async () => {
        closeModal();
      },
    });
  };

  const handleEditMember = (memberId: string) => {
    const member = paginatedMembers?.find(m => m.id === memberId);
    if (!member) return;
    
    openEditMemberModal({
      type: "EDIT_MEMBER",
      data: {
        member,
        projectId,
        roles: roles || [],
      },
      onSubmit: async () => {
        closeEditMemberModal();
      },
    });
  };

  const handleDeleteMember = (memberId: string) => {
    const member = paginatedMembers?.find(m => m.id === memberId);
    if (!member) return;
    
    openConfirmModal({
      type: "CONFIRM",
      data: {
        title: "Remove Member",
        description: `Are you sure you want to remove ${member.fullname} from this project?`,
        confirmText: "Remove",
        cancelText: "Cancel",
      },
      onSubmit: async () => {
        await removeMember(memberId)
        .catch((error) => {
          closeConfirmModal();
          
        });
        closeConfirmModal();
      },
    });
  };

  const handleRoleChange = async (memberId: string, roleId: string) => {
    await updateMemberRole({ memberId, roleId });
  };

  if (isLoading) {
    return <MembersSkeleton />;
  }

  return (
    <div className="bg-background flex h-full w-full flex-col overflow-hidden">
      <MembersHeader membersCount={filteredMembers?.length || 0} onAddMember={handleAddMemberClick} />
      
      <MembersSearch searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      
      <MembersTable
        members={paginatedMembers || []}
        roles={roles || []}
        onEditMember={handleEditMember}
        onDeleteMember={handleDeleteMember}
        onRoleChange={handleRoleChange}
      />
      
      <MembersPagination
        currentPage={currentPage}
        totalPages={totalPages}
        startIndex={startIndex}
        itemsPerPage={itemsPerPage}
        totalMembers={filteredMembers?.length || 0}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}

export default Members;