"use client";

import { use, useState } from "react";
import { useProjectById } from "@/hooks/use-project";
import MembersSkeleton from "@/components/project/members/members-skeleton";
import useModal from "@/hooks/use-modal";
import { useMemberModalStore } from "@/stores/member-modal.store";
import MembersPagination from "@/components/project/members/members-pagination";
import { useMembers } from "@/hooks/use-members-management";
import MembersHeader from "@/components/project/members/member-header";
import MembersSearch from "@/components/project/members/member-search";
import MembersTable from "@/components/project/members/member-table";
import { useRolesManagement } from "@/hooks/use-roles-management";
import { IRole } from "@/types/role.type";

interface MembersProps {
  params: Promise<{
    projectId: string;
  }>;
}

function Members({ params }: MembersProps) {
  const { openModal } = useMemberModalStore();
  const { openModal: openEditMemberModal } = useMemberModalStore();
  const { openModal: openConfirmModal, closeModal: closeConfirmModal } = useModal<"CONFIRM">();
  const { projectId } = use(params);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const { data: projectData } = useProjectById(projectId);
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
    if (!projectData) return;
    openModal({
      mode: "add",
      project: projectData,
    });
  };

  const handleEditMember = (memberId: string) => {
    const member = paginatedMembers?.find(m => m.id === memberId);
    if (!member) return;

    openEditMemberModal({
      mode: "update",
      member,
      projectId,
      roles,
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