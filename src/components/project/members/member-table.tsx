"use client";

import { ChevronDown } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import MemberRow from "./member-row";
import { IUserInProject } from "@/types/user.type";
import { IRole } from "@/types/role.type";

interface MembersTableProps {
  members: IUserInProject[];
  roles: IRole[];
  onEditMember: (memberId: string) => void;
  onDeleteMember: (memberId: string) => void;
  onRoleChange: (memberId: string, roleId: string) => void;
}

export default function MembersTable({ members, roles, onEditMember, onDeleteMember, onRoleChange }: MembersTableProps) {
  return (
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
            {/* <TableHead>Joined Date</TableHead> */}
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-muted-foreground text-center">
                No members found
              </TableCell>
            </TableRow>
          ) : (
            members.map((member) => (
              <MemberRow
                key={member.id}
                member={member}
                roles={roles}
                onEditMember={onEditMember}
                onDeleteMember={onDeleteMember}
                onRoleChange={onRoleChange}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}