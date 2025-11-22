"use client";

import { use, useState } from "react";
import { useProject } from "@/hooks/useProject";
import { IProject } from "@/types/project.type";
import MembersSkeleton from "@/components/project/members/members-skeleton";
import useModal from "@/hooks/useModal";
import MembersPagination from "@/components/project/members/members-pagination";
import { useMembers } from "@/hooks/useMembersManagement";
import MembersHeader from "@/components/project/members/member-header";
import MembersSearch from "@/components/project/members/member-search";
import MembersTable from "@/components/project/members/member-table";


interface MembersProps {
  params: Promise<{
    projectId: string;
  }>;
}

function Members({ params }: MembersProps) {
  const { openModal, closeModal } = useModal<"ADD_MEMBER">();
  const { projectId } = use(params);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const { project, isLoading, error } = useProject({ projectId });

  const {
    members,
    filteredMembers,
    paginatedMembers,
    totalPages,
    startIndex,
    handleRoleChange,
    handleEditMember,
    handleDeleteMember,
  } = useMembers(project, searchQuery, currentPage, itemsPerPage);

  const handleAddMemberClick = () => {
    openModal({
      type: "ADD_MEMBER",
      data: {
        project: project as IProject,
      },
      onSubmit: async () => {
        try {
          await new Promise((r) => setTimeout(r, 500));
        } catch (error) {
          console.error("Error during delete execution:", error);
        } finally {
          closeModal();
        }
      },
    });
  };

  if (isLoading) {
    return <MembersSkeleton />;
  }

  if (error) {
    return (
      <div className="flex h-full w-full items-center justify-center text-red-500">
        Error loading project members.
      </div>
    );
  }

  return (
    <div className="bg-background flex h-full w-full flex-col overflow-hidden">
      <MembersHeader membersCount={members.length} onAddMember={handleAddMemberClick} />
      
      <MembersSearch searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      
      <MembersTable
        members={paginatedMembers}
        onRoleChange={handleRoleChange}
        onEditMember={handleEditMember}
        onDeleteMember={handleDeleteMember}
      />
      
      <MembersPagination
        currentPage={currentPage}
        totalPages={totalPages}
        startIndex={startIndex}
        itemsPerPage={itemsPerPage}
        totalMembers={filteredMembers.length}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}

export default Members;