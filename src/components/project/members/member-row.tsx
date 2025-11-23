"use client";

import { Pencil, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IUserInProject } from "@/types/user.type";

interface MemberRowProps {
  member: IUserInProject;
  onEditMember: (memberId: string) => void;
  onDeleteMember: (memberId: string) => void;
}

export default function MemberRow({ member, onEditMember, onDeleteMember }: MemberRowProps) {
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
      
      <TableCell className="text-muted-foreground">{member.role.name}</TableCell>
      <TableCell className="text-muted-foreground">01/01/2025</TableCell>
      <TableCell>
        <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700">
          Active
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