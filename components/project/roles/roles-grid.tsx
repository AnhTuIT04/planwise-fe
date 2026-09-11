import React from "react";
import { Users } from "lucide-react";
import { Role } from "@/types/role.type";
import RoleCard from "./role-card";

interface RolesGridProps {
  roles: Role[];
  onEditRole?: (role: Role) => void;
  onDeleteRole?: (roleId: string) => void;
}

export default function RolesGrid({ roles, onEditRole, onDeleteRole }: RolesGridProps) {
  if (roles.length === 0) {
    return (
      <div className="py-12 text-center">
        <div className="rounded-lg bg-gray-50 p-8">
          <Users className="mx-auto mb-4 h-12 w-12 text-gray-400" />
          <h3 className="mb-2 text-lg font-medium text-gray-900">No roles yet</h3>
          <p className="text-gray-600">Create your first role to get started.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid max-h-[calc(100vh-350px)] grid-cols-1 gap-6 overflow-y-auto md:grid-cols-2 lg:grid-cols-3">
      {roles.map((role) => (
        <RoleCard
          key={role.id}
          role={role}
          onEdit={onEditRole || (() => undefined)}
          onDelete={onDeleteRole || (() => undefined)}
        />
      ))}
    </div>
  );
}
