import React from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Role } from "@/types/role.type";
import RoleMembers from "./role-members";

interface RoleCardProps {
  role: Role;
  onEdit?: (role: Role) => void;
  onDelete?: (roleId: string) => void;
}

export default function RoleCard({ role, onEdit, onDelete }: RoleCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      {/* Role Header */}
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            {role.name}
            {role.default && (
              <Badge variant="secondary" className="text-xs">
                Default
              </Badge>
            )}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          {onEdit && (
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-gray-700"
              onClick={() => onEdit(role)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              className="text-red-500 hover:text-red-700"
              onClick={() => onDelete(role.id)}
              disabled={role.default}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Permissions */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {role.permissions.map((permission) => (
            <Badge key={permission.permission} className="text-xs bg-blue-50 text-blue-700 border-0">
              {permission.name}
            </Badge>
          ))}
        </div>
      </div>

      {/* Members */}
      <RoleMembers members={role.members || []} />
    </div>
  );
}
