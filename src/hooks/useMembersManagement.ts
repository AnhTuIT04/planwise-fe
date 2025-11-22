import { useState, useMemo } from "react";
import { IMember, MemberRole, MemberStatus } from "@/types/member.type";
import { IBasicUser } from "@/types/user.type";
import { IProject } from "@/types/project.type";

function convertToMember(user: IBasicUser, index: number): IMember {
  const roles = [MemberRole.PROJECT_MANAGER, MemberRole.DEVELOPER, MemberRole.VIEWER];
  return {
    ...user,
    role: roles[index % roles.length],
    status: MemberStatus.ACTIVE,
    joinedDate: "March 15, 2024",
  };
}

export function useMembers(project: IProject | null, searchQuery: string, currentPage: number, itemsPerPage: number) {
  const members: IMember[] = useMemo(() => {
    return project?.members
      ? [project.owner, ...project.members].map((member, index) => convertToMember(member, index))
      : [];
  }, [project]);

  const filteredMembers = useMemo(() => {
    return members.filter(
      (member) =>
        member.fullname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.email.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [members, searchQuery]);

  const paginationData = useMemo(() => {
    const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedMembers = filteredMembers.slice(startIndex, startIndex + itemsPerPage);

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
    members,
    filteredMembers,
    ...paginationData,
    handleRoleChange,
    handleEditMember,
    handleDeleteMember,
  };
}