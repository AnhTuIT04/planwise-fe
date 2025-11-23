import { useState, useMemo } from "react";
import { IProject } from "@/types/project.type";


export function useMembers(project: IProject | null, searchQuery: string, currentPage: number, itemsPerPage: number) {
  

  const filteredMembers = useMemo(() => {
    return project?.members.filter(
      (member) =>
        member.fullname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.email.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [project?.members, searchQuery]);

  const paginationData = useMemo(() => {
    const totalPages = Math.ceil(filteredMembers ? filteredMembers.length / itemsPerPage : 0);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedMembers = filteredMembers?.slice(startIndex, startIndex + itemsPerPage);

    return {
      totalPages,
      startIndex,
      paginatedMembers,
    };
  }, [filteredMembers, currentPage, itemsPerPage]);

  const handleRoleChange = (memberId: string, newRole: string) => {
    // TODO: Implement role change API call
    console.log(`Changing role for member ${memberId} to ${newRole}`);
  };

  const handleEditMember = (memberId: string) => {
    // TODO: Implement edit member functionality
    console.log(`Editing member ${memberId}`);
  };

  const handleDeleteMember = (memberId: string) => {
    // TODO: Implement delete member functionality
    console.log(`Deleting member ${memberId}`);
  };

  return {
    filteredMembers,
    ...paginationData,
    handleRoleChange,
    handleEditMember,
    handleDeleteMember,
  };
}