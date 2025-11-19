"use client";

import { use, useState } from "react";
import { Search, Pencil, Trash2, Plus, ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProject } from "@/hooks/useProject";
import { IMember, MemberRole, MemberStatus } from "@/types/member.type";
import { IBasicUser } from "@/types/user.type";
import MembersSkeleton from "@/components/project/members-skeleton";

interface MembersProps {
  params: Promise<{
    projectId: string;
  }>;
}

function convertToMember(user: IBasicUser, index: number): IMember {
  const roles = [MemberRole.PROJECT_MANAGER, MemberRole.DEVELOPER, MemberRole.VIEWER];
  return {
    ...user,
    role: roles[index % roles.length],
    status: MemberStatus.ACTIVE,
    joinedDate: "March 15, 2024",
  };
}

function Members({ params }: MembersProps) {
  const { projectId } = use(params);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const { project, isLoading, error } = useProject({ projectId });

  // Convert project members to IMember format (with mock data for roles/status)
  const members: IMember[] = project?.members
    ? [project.owner, ...project.members].map((member, index) => convertToMember(member, index))
    : [];

  // Filter members based on search query
  const filteredMembers = members.filter(
    (member) =>
      member.fullname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Pagination
  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedMembers = filteredMembers.slice(startIndex, startIndex + itemsPerPage);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

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

  if (isLoading) {
    return <MembersSkeleton />;
  }

  if(error) {
    return (
      <div className="flex h-full w-full items-center justify-center text-red-500">Error loading project members.</div>
    );
  }

  return (
    <div className="bg-background flex h-full w-full flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-card border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Team Members</h1>
            <p className="text-muted-foreground text-sm">{members.length} members in this project</p>
          </div>
          <Button className="gap-2">
            <Plus className="size-4" />
            Add Member
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-card border-b px-6 py-3">
        <div className="relative">
          <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            placeholder="Search members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Table */}
      <div className="m-3 flex-1 overflow-auto rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead>
                <div className="flex items-center gap-1">
                  Role
                  <ChevronDown className="size-3.5" />
                </div>
              </TableHead>
              <TableHead>Joined Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedMembers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-muted-foreground text-center">
                  No members found
                </TableCell>
              </TableRow>
            ) : (
              paginatedMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="size-10">
                        <AvatarImage src={member.avatarUrl || undefined} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {getInitials(member.fullname)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium">{member.fullname}</span>
                        <span className="text-muted-foreground text-sm">{member.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Select
                      defaultValue={member.role}
                      onValueChange={(value: string) => handleRoleChange(member.id, value)}
                    >
                      <SelectTrigger className="w-[180px] border-purple-200 bg-purple-50 text-purple-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={MemberRole.OWNER}>Owner</SelectItem>
                        <SelectItem value={MemberRole.PROJECT_MANAGER}>Project Manager</SelectItem>
                        <SelectItem value={MemberRole.DEVELOPER}>Developer</SelectItem>
                        <SelectItem value={MemberRole.VIEWER}>Viewer</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{member.joinedDate}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700">
                      {member.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon-sm" onClick={() => handleEditMember(member.id)}>
                        <Pencil className="text-muted-foreground size-4" />
                      </Button>
                      <Button variant="ghost" size="icon-sm" onClick={() => handleDeleteMember(member.id)}>
                        <Trash2 className="text-muted-foreground size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="bg-card border-t px-6 py-3">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground text-sm">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredMembers.length)} of{" "}
            {filteredMembers.length} members
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className="min-w-9"
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Members;
