"use client";

import React, { use, useState, useMemo } from "react";
import { usePermission, PERMISSIONS as PERMISSION_STRINGS } from "@/hooks/usePermission";
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import api from "@/lib/api";
import { toast } from "sonner";

import { IRole } from "@/types/role.type";
import { useRolesManagement } from "@/hooks/useRolesManagement";

interface RolesPageProps {
  params: Promise<{
    projectId: string;
  }>;
}
interface IPermissionDto {
  permission: string;
  name: string;
  description: string;
}

export default function RolesPage({ params }: RolesPageProps) {
  const { projectId } = use(params);
  const { availablePermissions, permissionGroups, roleProject, isLoadingAvailable, isLoadingPermissions, isLoadingRoleProject } = usePermission(projectId);
  const { roles, isLoading, error, createRole, updateRole, deleteRole } = useRolesManagement(projectId);

  const [newRoleName, setNewRoleName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  const [editingRole, setEditingRole] = useState<IRole | null>(null);
  const [editRoleName, setEditRoleName] = useState("");
  const [editPermissions, setEditPermissions] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  const [deleteConfirm, setDeleteConfirm] = useState<{ roleId: string; roleName: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);


  const handleCreateRole = async () => {
    if (!newRoleName.trim()) {
      toast.error("Role name is required");
      return;
    }

    if (selectedPermissions.length === 0) {
      toast.error("Select at least one permission");
      return;
    }

    try {
      setIsCreating(true);
      await createRole({ name: newRoleName.trim(), permissions: selectedPermissions });

      // toast.success("Role created successfully");
      setNewRoleName("");
      setSelectedPermissions([]);
      // window.location.reload();
    } catch (error: any) {
      // toast.error(error.response?.data?.message || "Failed to create role");
    } finally {
      setIsCreating(false);
    }
  };

  const handleEditRole = (role: IRole) => {
    setEditingRole(role);
    setEditRoleName(role.name);
    setEditPermissions(role.permissions.map((p) => p.permission));
  };

  const handleSaveEdit = async () => {
    if (!editingRole || !editRoleName.trim()) {
      toast.error("Role name is required");
      return;
    }

    if (editPermissions.length === 0) {
      toast.error("Select at least one permission");
      return;
    }

    try {
      setIsEditing(true);
      await updateRole({ roleId: editingRole.id, name: editRoleName.trim(), permissions: editPermissions });

      toast.success("Role updated successfully");
      setEditingRole(null);
      // await loadRoles();
    } catch (error: any) {
      // toast.error(error.response?.data?.message || "Failed to update role");
    } finally {
      setIsEditing(false);
    }
  };

  const handleDeleteRole = async (roleId: string) => {
    try {
      setIsDeleting(true);
      await deleteRole(roleId);

      toast.success("Role deleted successfully");
      setDeleteConfirm(null);
      // await loadRoles();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete role");
    } finally {
      setIsDeleting(false);
    }
  };

  const togglePermission = (permission: string, isEditMode: boolean = false) => {
    if (isEditMode) {
      setEditPermissions((prev) =>
        prev.includes(permission) ? prev.filter((p) => p !== permission) : [...prev, permission]
      );
    } else {
      setSelectedPermissions((prev) =>
        prev.includes(permission) ? prev.filter((p) => p !== permission) : [...prev, permission]
      );
    }
  };

  const getPermissionName = (permission: string): string => {
    return availablePermissions?.find((p) => p.permission === permission)?.name || permission;
  };

  if (isLoadingAvailable || isLoadingPermissions || isLoadingRoleProject) {
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
    <div className="min-h-screen overflow-y-auto w-full">
      <div className="container mx-auto max-w-7xl p-6">
        <div className="mb-8">
          <h1 className="mb-2 text-2xl font-bold text-gray-900">Roles Management</h1>
          <p className="text-gray-600">Manage project roles and their permissions</p>
        </div>

      {/* Create Role Card */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg">Create New Role</CardTitle>
          <CardDescription>Define a new role with specific permissions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="role-name">Role Name</Label>
            <Input
              id="role-name"
              value={newRoleName}
              onChange={(e) => setNewRoleName(e.target.value)}
              placeholder="e.g., Project Lead, Reviewer"
              className="mt-1"
            />
          </div>

          <div>
            <Label>Select Permissions</Label>
            <div className="mt-2 space-y-3 max-h-64 overflow-y-auto">
              {Object.entries(permissionGroups || {}).map(([category, permissions]) => (
                <div key={category}>
                  <h4 className="font-semibold text-sm text-gray-700 capitalize mb-2">{category}</h4>
                  <div className="space-y-2 ml-4">
                    {(permissions as IPermissionDto[]).map((permission) => (
                      <div key={permission.permission} className="flex items-start gap-3">
                        <Checkbox
                          id={`perm-${permission.permission}`}
                          checked={selectedPermissions.includes(permission.permission)}
                          onCheckedChange={() => togglePermission(permission.permission, false)}
                          className="mt-1"
                        />
                        <div>
                          <label
                            htmlFor={`perm-${permission.permission}`}
                            className="text-sm font-medium text-gray-700 cursor-pointer block"
                          >
                            {permission.name}
                          </label>
                          <p className="text-xs text-gray-500 mt-0.5">{permission.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setNewRoleName("");
                setSelectedPermissions([]);
              }}
            >
              Clear
            </Button>
            <Button onClick={handleCreateRole} disabled={isCreating || !newRoleName.trim()}>
              {isCreating ? "Creating..." : "Create Role"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {roleProject?.map((role) => (
          <Card key={role.id} className="flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base">{role.name}</CardTitle>
                  {role.default && (
                    <div className="mt-1 inline-block rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                      Default Role
                    </div>
                  )}
                </div>
              </div>
              <CardDescription className="text-xs">{role.permissions.length} permissions</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-3">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-700">Permissions:</p>
                <div className="space-y-1">
                  {role.permissions.length > 0 ? (
                    role.permissions.slice(0, 3).map((p) => (
                      <div key={p.permission} className="text-xs text-gray-600">
                        • {p.name}
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-gray-500">No permissions</p>
                  )}
                  {role.permissions.length > 3 && (
                    <p className="text-xs text-gray-500 font-medium">+{role.permissions.length - 3} more</p>
                  )}
                </div>
              </div>
            </CardContent>
            <div className="border-t px-6 py-3 flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleEditRole(role)}
                className="flex-1"
              >
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setDeleteConfirm({ roleId: role.id, roleName: role.name })}
                disabled={role.default}
              >
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Edit Role Dialog */}
      <Dialog open={!!editingRole} onOpenChange={(open) => !open && setEditingRole(null)}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Role - {editingRole?.name}</DialogTitle>
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
              <div className="mt-2 space-y-3 max-h-96 overflow-y-auto border rounded-lg p-4 bg-gray-50">
                {Object.entries(permissionGroups || {}).map(([category, permissions]) => (
                  <div key={category}>
                    <h4 className="font-semibold text-sm text-gray-700 capitalize mb-2">{category}</h4>
                    <div className="space-y-2 ml-4">
                      {(permissions as IPermissionDto[]).map((permission) => (
                        <div key={permission.permission} className="flex items-start gap-3">
                          <Checkbox
                            id={`edit-${permission.permission}`}
                            checked={editPermissions.includes(permission.permission)}
                            onCheckedChange={() => togglePermission(permission.permission, true)}
                            className="mt-1"
                          />
                          <div>
                            <label
                              htmlFor={`edit-${permission.permission}`}
                              className="text-sm font-medium text-gray-700 cursor-pointer block"
                            >
                              {permission.name}
                            </label>
                            <p className="text-xs text-gray-500 mt-0.5">{permission.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEditingRole(null)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveEdit}
              disabled={isEditing || !editRoleName.trim() || editPermissions.length === 0}
            >
              {isEditing ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirm} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Role</DialogTitle>
          </DialogHeader>
          <p className="text-gray-600">
            Are you sure you want to delete the role "<strong>{deleteConfirm?.roleName}</strong>"? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteConfirm && handleDeleteRole(deleteConfirm.roleId)}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Role"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      </div>
    </div>
  );
}
