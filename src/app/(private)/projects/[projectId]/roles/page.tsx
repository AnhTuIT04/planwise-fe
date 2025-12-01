"use client";

import React, { use, useState, useMemo } from "react";
import CreateRoleForm from "@/components/project/roles/create-role-form";
import RolesGrid from "@/components/project/roles/roles-grid";
import { useRolesManagement } from "@/hooks/useRolesManagement";
import useModal from "@/hooks/useModal";
import { Role, Permission, mapIRoleToRole } from "@/types/role.type";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface RolesPageProps {
  params: Promise<{
    projectId: string;
  }>;
}

export default function RolesPage({ params }: RolesPageProps) {
  const { projectId } = use(params);
  const { openModal, closeModal } = useModal<"CONFIRM">();
  
  const {
    roles: rawRoles,
    isLoading,
    createRole,
    updateRole,
    deleteRole,
    PERMISSIONS,
  } = useRolesManagement(projectId);

  // Map IRole to Role for display
  const roles = useMemo(() => {
    return rawRoles.map(r => mapIRoleToRole(r, PERMISSIONS));
  }, [rawRoles, PERMISSIONS]);

  // Local state for create form
  const [newRoleName, setNewRoleName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  // Edit role state
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [editRoleName, setEditRoleName] = useState("");
  const [editPermissions, setEditPermissions] = useState<string[]>([]);

  const handleCreateRole = async () => {
    if (!newRoleName.trim()) return;
    
    await createRole({
      name: newRoleName.trim(),
      permissions: selectedPermissions,
    });
    
    // Reset form
    setNewRoleName("");
    setSelectedPermissions([]);
  };

  const handleEditRole = (role: Role) => {
    setEditingRole(role);
    setEditRoleName(role.name);
    setEditPermissions(role.permissions.map(p => p.id));
  };

  const handleSaveEdit = async () => {
    if (!editingRole || !editRoleName.trim()) return;
    
    await updateRole({
      roleId: editingRole.id,
      name: editRoleName.trim(),
      permissions: editPermissions,
    });
    
    setEditingRole(null);
    setEditRoleName("");
    setEditPermissions([]);
  };

  const handleCancelEdit = () => {
    setEditingRole(null);
    setEditRoleName("");
    setEditPermissions([]);
  };

  const handleDeleteRole = (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    if (!role) return;

    openModal({
      type: "CONFIRM",
      data: {
        title: "Delete Role",
        description: `Are you sure you want to delete the role "${role.name}"? This action cannot be undone.`,
        confirmText: "Delete",
        cancelText: "Cancel",
      },
      onSubmit: async () => {
        await deleteRole(roleId);
        closeModal();
      },
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-7xl p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 rounded bg-gray-200"></div>
          <div className="h-4 w-64 rounded bg-gray-200"></div>
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 rounded-lg bg-gray-200"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

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

      {/* Edit Role Dialog */}
      <Dialog open={!!editingRole} onOpenChange={(open) => !open && handleCancelEdit()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Role</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="edit-role-name">Role Name</Label>
              <Input
                id="edit-role-name"
                value={editRoleName}
                onChange={(e) => setEditRoleName(e.target.value)}
                placeholder="Enter role name"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Permissions</Label>
              <div className="mt-2 space-y-2">
                {PERMISSIONS.map((permission) => (
                  <div key={permission.id} className="flex items-center gap-2">
                    <Checkbox
                      id={`edit-${permission.id}`}
                      checked={editPermissions.includes(permission.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setEditPermissions([...editPermissions, permission.id]);
                        } else {
                          setEditPermissions(editPermissions.filter(p => p !== permission.id));
                        }
                      }}
                    />
                    <label
                      htmlFor={`edit-${permission.id}`}
                      className="text-sm text-gray-700 cursor-pointer"
                    >
                      {permission.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleCancelEdit}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} disabled={!editRoleName.trim()}>
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
