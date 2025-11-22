"use client";

import { Pencil, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IMember, MemberRole } from "@/types/member.type";

interface MemberRowProps {
  member: IMember;
  onRoleChange: (memberId: string, newRole: string) => void;
  onEditMember: (memberId: string) => void;
  onDeleteMember: (memberId: string) => void;
}

export default function MemberRow({ member, onRoleChange, onEditMember, onDeleteMember }: MemberRowProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
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
          onValueChange={(value: string) => onRoleChange(member.id, value)}
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
          <Button variant="ghost" size="icon-sm" onClick={() => onEditMember(member.id)}>
            <Pencil className="text-muted-foreground size-4" />
          </Button>
          <Button variant="ghost" size="icon-sm" onClick={() => onDeleteMember(member.id)}>
            <Trash2 className="text-muted-foreground size-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}