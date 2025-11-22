"use client";

import React from "react";
import CreateRoleForm from "@/components/project/roles/create-role-form";
import RolesGrid from "@/components/project/roles/roles-grid";
import { useRolesManagement } from "@/hooks/useRolesManagement";

interface RolesPageProps {
  params: {
    projectId: string;
  };
}

export default function RolesPage({ params }: RolesPageProps) {
  const {
    roles,
    newRoleName,
    setNewRoleName,
    selectedPermissions,
    setSelectedPermissions,
    handleCreateRole,
    handleDeleteRole,
    handleEditRole,
  } = useRolesManagement();

  return (
    <div className="container mx-auto max-w-7xl p-6">
      <div className="mb-8">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">Roles Management</h1>
        <p className="text-gray-600">Manage project roles and permissions</p>
      </div>

      <CreateRoleForm
        newRoleName={newRoleName}
        setNewRoleName={setNewRoleName}
        selectedPermissions={selectedPermissions}
        setSelectedPermissions={setSelectedPermissions}
        onCreateRole={handleCreateRole}
      />

      <RolesGrid
        roles={roles}
        onEditRole={handleEditRole}
        onDeleteRole={handleDeleteRole}
      />
    </div>
  );
}
